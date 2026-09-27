"use client";

import { useSyncExternalStore } from "react";
import {
  getActiveSpeechKey,
  isBotSpeaking,
  subscribeBotSpeaking,
} from "@/lib/speech/botSpeech";

function subscribe(onStoreChange: () => void): () => void {
  return subscribeBotSpeaking(() => onStoreChange());
}

function getSpeakingSnapshot(): boolean {
  return isBotSpeaking();
}

function getActiveKeySnapshot(): string | null {
  return getActiveSpeechKey();
}

function getFalse(): boolean {
  return false;
}

function getNull(): null {
  return null;
}

/**
 * Estado de voz del asistente.
 * @param speechKey Si se indica, `speaking` solo es true cuando esa frase se está leyendo.
 */
export function useBotSpeaking(speechKey?: string): boolean {
  const speaking = useSyncExternalStore(
    subscribe,
    getSpeakingSnapshot,
    getFalse,
  );
  const activeKey = useSyncExternalStore(
    subscribe,
    getActiveKeySnapshot,
    getNull,
  );

  if (!speechKey) return speaking;
  return speaking && activeKey === speechKey;
}
