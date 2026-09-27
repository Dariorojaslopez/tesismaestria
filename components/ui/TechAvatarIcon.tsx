/** Avatar estilizado: mujer afro. Con `speaking` anima boca y un pulso suave. */

import { useId } from "react";
import { cn } from "@/lib/utils";

export type TechAvatarIconProps = {
  className?: string;
  /** Mueve la boca y un resplandor mientras el TTS está activo. */
  speaking?: boolean;
};

export function TechAvatarIcon({
  className,
  speaking = false,
}: TechAvatarIconProps) {
  const uid = useId().replace(/:/g, "");
  const hairId = `ta-hair-${uid}`;
  const skinId = `ta-skin-${uid}`;
  const glassId = `ta-glass-${uid}`;

  return (
    <svg
      className={cn(speaking && "avatar-speaking", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={hairId} x1="12" y1="8" x2="52" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c1410" />
          <stop offset="1" stopColor="#3d2a22" />
        </linearGradient>
        <linearGradient id={skinId} x1="28" y1="28" x2="40" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c67d5c" />
          <stop offset="1" stopColor="#8b4f3a" />
        </linearGradient>
        <linearGradient id={glassId} x1="22" y1="34" x2="46" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Afro */}
      <circle cx="22" cy="22" r="9" fill={`url(#${hairId})`} />
      <circle cx="32" cy="16" r="10" fill={`url(#${hairId})`} />
      <circle cx="44" cy="20" r="9" fill={`url(#${hairId})`} />
      <circle cx="18" cy="32" r="7" fill={`url(#${hairId})`} />
      <circle cx="48" cy="30" r="8" fill={`url(#${hairId})`} />
      <circle cx="32" cy="26" r="11" fill={`url(#${hairId})`} />

      {/* Rostro */}
      <ellipse cx="32" cy="38" rx="11" ry="12" fill={`url(#${skinId})`} />

      {/* Lentes / HUD tech */}
      <path
        d="M22 36h8a3 3 0 003-3v-1M34 36h8a3 3 0 003-3v-1"
        stroke={`url(#${glassId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="23" y="33" width="6" height="4" rx="1" fill={`url(#${glassId})`} opacity="0.9" />
      <rect x="35" y="33" width="6" height="4" rx="1" fill={`url(#${glassId})`} opacity="0.9" />

      {/* Circuito */}
      <path
        d="M46 44h6M49 41v6"
        stroke="#10b981"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="52" cy="44" r="1.8" fill="#0ea5e9" opacity="0.9" />

      {/* Boca: sonrisa en reposo / ovalo al hablar */}
      <path
        className="avatar-mouth-idle"
        d="M27 44c2.2 1.8 7.8 1.8 10 0"
        stroke="#5c2e22"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
        fill="none"
      />
      <ellipse
        className="avatar-mouth-talk"
        cx="32"
        cy="45.5"
        rx="3.2"
        ry="1.1"
        fill="#5c2e22"
        opacity="0"
      />
    </svg>
  );
}
