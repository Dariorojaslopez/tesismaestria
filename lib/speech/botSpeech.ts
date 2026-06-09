/**
 * Cola de Text-to-Speech para mensajes del asistente (Web Speech API).
 * Prioriza voces en español con matices latinoamericanos y tono femenino cuando el sistema las expone.
 */

type Queued = { text: string; key: string };

let queue: Queued[] = [];
let processing = false;
const animatingKeys = new Set<string>();
const completedKeys = new Set<string>();

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis.getVoices() ?? [];
}

const FEMALE_VOICE_HINTS =
  /female|femenina|mujer|woman|sabina|helena|elvira|luc[ií]a|paulina|monica|mónica|paola|sof[ií]a|karla|luciana|dalia|valentina|esperanza|irene|paloma|marina|catalina|beatriz|salom[eé]|camila|isabella|laura|natalia|neural2-a\b|standard-a\b|wavenet-a\b|es-[a-z]{2}-.*\ba\b/i;

const MALE_VOICE_HINTS =
  /male|masculino|hombre|man\b|pablo|jorge|carlos|diego|ra[uú]l|alonso|bienvenido|neural2-b\b|standard-b\b|wavenet-b\b|es-[a-z]{2}-.*\bb\b/i;

function isFemaleVoice(v: SpeechSynthesisVoice): boolean {
  return FEMALE_VOICE_HINTS.test(v.name);
}

function isMaleVoice(v: SpeechSynthesisVoice): boolean {
  return MALE_VOICE_HINTS.test(v.name);
}

function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase();
  const name = v.name.toLowerCase();
  let score = 0;

  if (isFemaleVoice(v)) score += 200;
  if (isMaleVoice(v)) score -= 250;

  if (lang.startsWith("es-419") || lang.startsWith("es-mx")) score += 55;
  else if (lang.startsWith("es-ar") || lang.startsWith("es-co")) score += 48;
  else if (lang.startsWith("es-us")) score += 46;
  else if (lang.startsWith("es-")) score += 30;
  else if (lang.startsWith("es")) score += 24;

  /** Voces neurales / HD suelen sonar menos “robóticas” que las clásicas del SO. */
  if (
    /neural|natural\b|wavenet|enhanced|premium|online|multimedia|hd\b|generative/i.test(
      name,
    )
  ) {
    score += 72;
  }

  if (/^google\s|google\s(español|spanish)|google\s.*\bes[-_]/i.test(name)) {
    score += 55;
  }

  if (/microsoft.*(neural|natural|online)/i.test(name)) score += 50;

  if (/mexico|méxico|latam|latino|colombia|argentina|419|centroam/i.test(name)) {
    score += 14;
  }

  /** Penalizar voces muy antiguas / compactas cuando hay alternativas mejores. */
  if (/compact|sapi\s*5|legacy|classic\s*tts|robotic/i.test(name)) score -= 40;

  return score;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices().filter((v) => v.lang.toLowerCase().startsWith("es"));
  if (voices.length === 0) return null;

  const femaleVoices = voices.filter(isFemaleVoice);
  const pool = femaleVoices.length > 0 ? femaleVoices : voices.filter((v) => !isMaleVoice(v));
  const candidates = pool.length > 0 ? pool : voices;

  let best = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (scoreVoice(candidates[i]) > scoreVoice(best)) best = candidates[i];
  }
  return best;
}

function flushQueue(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (processing) return;
  const next = queue.shift();
  if (!next) return;

  processing = true;
  animatingKeys.add(next.key);
  const utterance = new SpeechSynthesisUtterance(next.text);
  utterance.lang = "es-419";
  const voice = pickVoice();
  const female = voice ? isFemaleVoice(voice) : false;

  /** Ritmo suave; pitch un poco más alto si no hay voz femenina explícita en el SO. */
  utterance.rate = 0.9;
  utterance.pitch = female ? 1.05 : 1.12;
  utterance.volume = 0.94;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || utterance.lang;
  }

  const done = () => {
    animatingKeys.delete(next.key);
    completedKeys.add(next.key);
    processing = false;
    flushQueue();
  };

  utterance.onend = done;
  utterance.onerror = done;

  window.speechSynthesis.speak(utterance);
}

/** Encola lectura; evita duplicar la misma clave en cola (p. ej. Strict Mode). */
export function enqueueBotSpeech(text: string, key: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return;
  if (animatingKeys.has(key) || completedKeys.has(key)) return;
  if (queue.some((item) => item.key === key)) return;

  queue.push({ text: trimmed, key });
  void getVoices();
  flushQueue();
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
  getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    getVoices();
  };
}
