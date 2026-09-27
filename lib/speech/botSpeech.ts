/**
 * Cola de Text-to-Speech para el asistente (Web Speech API).
 * Busca una voz femenina suave en español y habla a ritmo de conversación.
 * La calidad depende del sistema: Edge/Chrome con voces Natural/Online suenan mejor.
 */

type Queued = { text: string; key: string };

let queue: Queued[] = [];
let processing = false;
let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesPrimed = false;
const animatingKeys = new Set<string>();
const completedKeys = new Set<string>();
/** Evita doble lectura en el primer montaje (React Strict Mode / carga de voces). */
const scheduledKeys = new Set<string>();

const PAUSE_BETWEEN_MS = 280;
const PAUSE_BETWEEN_CHUNKS_MS = 160;
/** Evita leer diagnósticos enteros: suenan robóticos y agotan. */
const MAX_CHARS_PER_TURN = 420;

const FEMALE_VOICE_HINTS =
  /female|femenina|mujer|woman|sabina|dalia|helena|elvira|luc[ií]a|paulina|monica|mónica|paola|sof[ií]a|karla|luciana|valentina|esperanza|irene|paloma|marina|catalina|beatriz|salom[eé]|camila|isabella|laura|natalia|zira|jenny|aria|sara|ana\b|neural2-a\b|standard-a\b|wavenet-a\b|es-[a-z]{2}-.*\ba\b/i;

const MALE_VOICE_HINTS =
  /male|masculino|hombre|man\b|pablo|jorge|carlos|diego|ra[uú]l|alonso|bienvenido|david|antonio|neural2-b\b|standard-b\b|wavenet-b\b|es-[a-z]{2}-.*\bb\b/i;

/** Voces cercanas a Alexa/asistentes: neurales, online o “natural”. */
const PREMIUM_VOICE_HINTS =
  /online \(natural\)|natural\b|neural|wavenet|generative|premium|enhanced|hd\b|sabina|dalia|helena|elvira|paulina|google.*espa[nñ]ol|google.*spanish|microsoft.*(sabina|dalia|helena|elvira|paulina)/i;

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis.getVoices() ?? [];
}

function isFemaleVoice(v: SpeechSynthesisVoice): boolean {
  return FEMALE_VOICE_HINTS.test(v.name);
}

function isMaleVoice(v: SpeechSynthesisVoice): boolean {
  return MALE_VOICE_HINTS.test(v.name);
}

function isPremiumVoice(v: SpeechSynthesisVoice): boolean {
  return PREMIUM_VOICE_HINTS.test(v.name);
}

function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase();
  const name = v.name.toLowerCase();
  let score = 0;

  if (isFemaleVoice(v)) score += 240;
  if (isMaleVoice(v)) score -= 320;
  if (isPremiumVoice(v)) score += 200;

  // Preferidas conocidas (suaves, tipo asistente).
  if (/paulina/i.test(name)) score += 80;
  if (/sabina|dalia|helena|elvira|m[oó]nica/i.test(name)) score += 70;
  if (/google.*espa[nñ]ol.*(m[eé]xico|estados unidos|us)|espa[nñ]ol \(m[eé]xico\)/i.test(name)) {
    score += 65;
  }

  if (lang.startsWith("es-mx") || lang.startsWith("es-419")) score += 75;
  else if (lang.startsWith("es-us") || lang.startsWith("es-co")) score += 58;
  else if (lang.startsWith("es-ar") || lang.startsWith("es-cl")) score += 45;
  else if (lang.startsWith("es-es")) score += 32;
  else if (lang.startsWith("es")) score += 20;

  if (/online/i.test(name)) score += 95;
  if (/natural|neural|wavenet|generative/i.test(name)) score += 90;
  if (/google/i.test(name)) score += 50;
  if (/microsoft/i.test(name) && /natural|online/i.test(name)) score += 55;

  if (/desktop/i.test(name) && !/natural|neural|online/i.test(name)) score -= 140;
  if (/compact|sapi\s*5|legacy|classic\s*tts|robotic|espeak|flite/i.test(name)) {
    score -= 110;
  }

  return score;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;

  const voices = getVoices().filter((v) => v.lang.toLowerCase().startsWith("es"));
  if (voices.length === 0) return null;

  const premiumFemale = voices.filter((v) => isFemaleVoice(v) && isPremiumVoice(v));
  const femaleVoices = voices.filter(isFemaleVoice);
  const pool =
    premiumFemale.length > 0
      ? premiumFemale
      : femaleVoices.length > 0
        ? femaleVoices
        : voices.filter((v) => !isMaleVoice(v));
  const candidates = pool.length > 0 ? pool : voices;

  let best = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (scoreVoice(candidates[i]) > scoreVoice(best)) best = candidates[i];
  }

  cachedVoice = best;
  return best;
}

/** Prepara el texto para que suene más conversacional. */
function softenForSpeech(text: string): string {
  return text
    .replace(/¡+/g, "")
    .replace(/!+/g, ".")
    .replace(/\?+/g, "?")
    .replace(/«|»|"/g, "")
    .replace(/\b4A\b/gi, "cuatro A")
    .replace(/\b4B\b/gi, "cuatro B")
    .replace(/\b4C\b/gi, "cuatro C")
    .replace(/\bAguh y Okoye\b/gi, "Agú y Okóye")
    .replace(/\bCribier\b/gi, "Cribier")
    .replace(/\bKing\b/gi, "King")
    .replace(/\bEMC\b/g, "")
    .replace(/\bDOI\b/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Para mensajes largos (diagnóstico): resume lo hablado.
 * El texto completo sigue visible en pantalla.
 */
export function toSpokenSummary(text: string, maxChars = MAX_CHARS_PER_TURN): string {
  const clean = softenForSpeech(text);
  if (clean.length <= maxChars) return clean;

  const parts = clean
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const lead = parts[0] ?? clean;
  const second = parts.find(
    (p, i) =>
      i > 0 &&
      !/criterios se apoyan|orientaci[oó]n de cuidado|consulta a un dermat[oó]logo/i.test(
        p,
      ),
  );

  let spoken = lead;
  if (second && spoken.length + second.length < maxChars) {
    spoken = `${spoken} ${second}`;
  }

  if (spoken.length > maxChars) {
    const cut = spoken.slice(0, maxChars);
    const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
    spoken = lastStop > 80 ? cut.slice(0, lastStop + 1) : `${cut.trim()}…`;
  }

  if (!/mascarilla|recomiend|propuest|elige|tr[ií]o/i.test(spoken)) {
    spoken = `${spoken} Te dejo las mascarillas abajo.`;
  }

  return softenForSpeech(spoken);
}

function chunkForSpeech(text: string): string[] {
  const soft = softenForSpeech(text);
  if (!soft) return [];

  const sentences = soft
    .split(/(?<=[.?;:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return [soft];

  const chunks: string[] = [];
  let buf = "";
  for (const sentence of sentences) {
    if (buf && buf.length + sentence.length > 160) {
      chunks.push(buf.trim());
      buf = sentence;
    } else {
      buf = buf ? `${buf} ${sentence}` : sentence;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

/**
 * Ritmo cercano a un asistente: ni lento ni acelerado.
 * El pitch alto hace que suene más robótico; se deja casi natural.
 */
function speechProfile(voice: SpeechSynthesisVoice | null) {
  const premium = voice ? isPremiumVoice(voice) : false;
  const female = voice ? isFemaleVoice(voice) : false;
  const name = voice?.name.toLowerCase() ?? "";

  // Paulina / Sabina / Google ya vienen cálidas: casi no tocar el pitch.
  const softNamed = /paulina|sabina|dalia|helena|elvira|m[oó]nica|google/i.test(name);

  return {
    rate: premium ? 0.98 : 0.94,
    pitch: softNamed ? 1.02 : female ? 1.06 : 1.08,
    volume: 0.92,
  };
}

function waitForVoices(timeoutMs = 1200): Promise<void> {
  return new Promise((resolve) => {
    if (getVoices().length > 0) {
      resolve();
      return;
    }

    const synth = window.speechSynthesis;
    const onChange = () => {
      if (getVoices().length > 0) {
        synth.removeEventListener("voiceschanged", onChange);
        resolve();
      }
    };

    synth.addEventListener("voiceschanged", onChange);
    window.setTimeout(() => {
      synth.removeEventListener("voiceschanged", onChange);
      resolve();
    }, timeoutMs);
  });
}

function speakChunk(
  text: string,
  voice: SpeechSynthesisVoice | null,
  profile: ReturnType<typeof speechProfile>,
): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang || "es-MX";
    utterance.rate = profile.rate;
    utterance.pitch = profile.pitch;
    utterance.volume = profile.volume;
    if (voice) utterance.voice = voice;

    const done = () => resolve();
    utterance.onend = done;
    utterance.onerror = done;
    window.speechSynthesis.speak(utterance);
  });
}

async function speakNext(next: Queued): Promise<void> {
  const voice = pickVoice();
  const profile = speechProfile(voice);
  const chunks = chunkForSpeech(next.text);

  try {
    for (let i = 0; i < chunks.length; i++) {
      await speakChunk(chunks[i], voice, profile);
      if (i < chunks.length - 1) {
        await new Promise((r) => window.setTimeout(r, PAUSE_BETWEEN_CHUNKS_MS));
      }
    }
  } finally {
    animatingKeys.delete(next.key);
    completedKeys.add(next.key);
    processing = false;
    window.setTimeout(() => {
      void flushQueue();
    }, PAUSE_BETWEEN_MS);
  }
}

async function flushQueue(): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (processing) return;

  const next = queue.shift();
  if (!next) return;

  processing = true;

  try {
    if (!voicesPrimed) {
      await waitForVoices();
      voicesPrimed = true;
      cachedVoice = null;
    }

    // Chrome a veces “congela” la cola; un cancel limpio ayuda.
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    animatingKeys.add(next.key);
    await speakNext(next);
  } catch {
    animatingKeys.delete(next.key);
    processing = false;
    void flushQueue();
  }
}

/** Encola lectura; evita duplicar la misma clave en cola (p. ej. Strict Mode). */
export function enqueueBotSpeech(text: string, key: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return;
  if (scheduledKeys.has(key)) return;
  if (animatingKeys.has(key) || completedKeys.has(key)) return;
  if (queue.some((item) => item.key === key)) return;

  scheduledKeys.add(key);
  queue.push({ text: trimmed, key });
  void flushQueue();
}

export function cancelBotSpeech(): void {
  queue = [];
  processing = false;
  animatingKeys.clear();
  completedKeys.clear();
  scheduledKeys.clear();
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function primeSpeechVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const refresh = () => {
    cachedVoice = null;
    void getVoices();
    void pickVoice();
  };

  refresh();
  window.speechSynthesis.onvoiceschanged = refresh;

  // Forzar carga temprana de voces (Chrome).
  try {
    window.speechSynthesis.getVoices();
  } catch {
    // ignore
  }
}
