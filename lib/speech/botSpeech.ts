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

function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase();
  const name = v.name.toLowerCase();
  let score = 0;

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

  if (
    /female|mujer|femenina|sabina|paola|sof[ií]a|monica|mónica|helena|karla|luciana|dalia|valentina|esperanza|irene|elvira|paloma|marina|catalina|beatriz|luc[ií]a/i.test(
      name,
    )
  ) {
    score += 38;
  }

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
  let best = voices[0];
  for (let i = 1; i < voices.length; i++) {
    if (scoreVoice(voices[i]) > scoreVoice(best)) best = voices[i];
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
  /** Más lento y menos agudo → sensación más suave y menos “sintética”. */
  utterance.rate = 0.87;
  utterance.pitch = 1.02;
  utterance.volume = 0.94;

  const voice = pickVoice();
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
