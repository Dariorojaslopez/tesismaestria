"use client";

import { TechAvatarIcon } from "@/components/ui/TechAvatarIcon";
import { useBotSpeaking } from "@/lib/speech/useBotSpeaking";
import { cn } from "@/lib/utils";

type SpeakingAvatarProps = {
  className?: string;
  /** Tamaño del contenedor circular (Tailwind), p. ej. size-10. */
  frameClassName?: string;
  /** Si se indica, solo anima cuando esa frase se está leyendo. */
  speechKey?: string;
  /** Muestra “Hablando…” en lectores de pantalla. */
  labelSpeaking?: string;
};

/**
 * Avatar de la asistente: se anima (boca + pulso) mientras hay TTS activo.
 */
export function SpeakingAvatar({
  className,
  frameClassName,
  speechKey,
  labelSpeaking = "La asistente está hablando",
}: SpeakingAvatarProps) {
  const speaking = useBotSpeaking(speechKey);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm",
        speaking && "avatar-frame-speaking",
        frameClassName,
      )}
      aria-live="polite"
      aria-label={speaking ? labelSpeaking : undefined}
    >
      {speaking ? (
        <span
          className="pointer-events-none absolute inset-[-3px] rounded-full bg-emerald-400/25 avatar-ring-pulse"
          aria-hidden
        />
      ) : null}
      <TechAvatarIcon className={className} speaking={speaking} />
    </span>
  );
}
