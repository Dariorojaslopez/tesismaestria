/**
 * Cola de Text-to-Speech para mensajes del asistente (Web Speech API).
 * Prioriza voces femeninas neurales/naturales en español latinoamericano.
 */

type Queued = { text: string; key: string };

let queue: Queued[] = [];
let processing = false;
let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesPrimed = false;
const animatingKeys = new Set<string>();
const completedKeys = new Set<string>();

const PAUSE_BETWEEN_MS = 420;

const FEMALE_VOICE_HINTS =
  /female|femenina|mujer|woman|sabina|dalia|helena|elvira|luc[ií]a|paulina|monica|mónica|paola|sof[ií]a|karla|luciana|valentina|esperanza|irene|paloma|marina|catalina|beatriz|salom[eé]|camila|isabella|laura|natalia|neural2-a\b|standard-a\b|wavenet-a\b|es-[a-z]{2}-.*\ba\b/i;

const MALE_VOICE_HINTS =
  /male|masculino|hombre|man\b|pablo|jorge|carlos|diego|ra[uú]l|alonso|bienvenido|neural2-b\b|standard-b\b|wavenet-b\b|es-[a-z]{2}-.*\bb\b/i;

/** Voces que suelen sonar más cálidas y menos robóticas en Windows/Chrome. */
const PREMIUM_VOICE_HINTS =
  /sabina.*natural|dalia.*natural|helena.*natural|elvira.*natural|paulina.*natural|lucia.*natural|luc[ií]a.*natural|google.*español|google.*spanish|neural|natural\b|wavenet|online.*spanish/i;

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

  if (isFemaleVoice(v)) score += 220;
  if (isMaleVoice(v)) score -= 300;
  if (isPremiumVoice(v)) score += 160;

  if (lang.startsWith("es-419") || lang.startsWith("es-mx")) score += 70;
  else if (lang.startsWith("es-co") || lang.startsWith("es-ar")) score += 55;
  else if (lang.startsWith("es-us")) score += 48;
  else if (lang.startsWith("es-")) score += 28;

  if (/online|natural|neural|wavenet|generative|hd\b/i.test(name)) score += 90;
  if (/google/i.test(name)) score += 45;
  if (/mexico|méxico|latam|latino|colombia|419/i.test(name)) score += 20;

  /** Voces “Desktop” clásicas suelen sonar más metálicas. */
  if (/desktop/i.test(name) && !/natural|neural|online/i.test(name)) score -= 120;
  if (/compact|sapi\s*5|legacy|classic\s*tts|robotic/i.test(name)) score -= 90;

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

/** Suaviza el texto para un tono más cálido (menos “grito” robótico). */
function softenForSpeech(text: string): string {
  return text
    .replace(/¡+/g, "")
    .replace(/!+/g, ".")
    .replace(/\?+/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

function speechProfile(voice: SpeechSynthesisVoice | null) {
  const premium = voice ? isPremiumVoice(voice) : false;
  const female = voice ? isFemaleVoice(voice) : false;

  return {
    /** Más lento = más natural y menos “lector automático”. */
    rate: premium ? 0.84 : 0.8,
    /** Tono un poco más agudo para sensación femenina y dulce. */
    pitch: female ? (premium ? 1.14 : 1.18) : 1.22,
    volume: 0.9,
  };
}

function waitForVoices(timeoutMs = 800): Promise<void> {
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

function speakNext(next: Queued): void {
  const utterance = new SpeechSynthesisUtterance(softenForSpeech(next.text));
  utterance.lang = "es-MX";

  const voice = pickVoice();
  const profile = speechProfile(voice);

  utterance.rate = profile.rate;
  utterance.pitch = profile.pitch;
  utterance.volume = profile.volume;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || utterance.lang;
  }

  const done = () => {
    animatingKeys.delete(next.key);
    completedKeys.add(next.key);
    processing = false;
    window.setTimeout(() => flushQueue(), PAUSE_BETWEEN_MS);
  };

  utterance.onend = done;
  utterance.onerror = done;

  window.speechSynthesis.speak(utterance);
}

async function flushQueue(): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (processing) return;

  const next = queue.shift();
  if (!next) return;

  if (!voicesPrimed) {
    await waitForVoices();
    voicesPrimed = true;
    cachedVoice = null;
  }

  processing = true;
  animatingKeys.add(next.key);
  speakNext(next);
}

/** Encola lectura; evita duplicar la misma clave en cola (p. ej. Strict Mode). */
export function enqueueBotSpeech(text: string, key: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return;
  if (animatingKeys.has(key) || completedKeys.has(key)) return;
  if (queue.some((item) => item.key === key)) return;

  queue.push({ text: trimmed, key });
  void flushQueue();
}

export function cancelBotSpeech(): void {
  queue = [];
  processing = false;
  animatingKeys.clear();
  completedKeys.clear();
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
}
