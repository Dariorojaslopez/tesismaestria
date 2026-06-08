"use client";

import { motion } from "framer-motion";
import { TechAvatarIcon } from "@/components/ui/TechAvatarIcon";

/** Mockup tipo Apple: marco metal claro, pantalla suave, sombra ligera. */
export function HeroProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,520px)]" aria-hidden>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto aspect-[10/19] w-[72%] max-w-[280px] rounded-[2.4rem] bg-gradient-to-b from-[#e8e8ed] via-[#d2d2d7] to-[#c4c4c9] p-[2px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18),0_12px_24px_-8px_rgba(0,0,0,0.08)] sm:w-[65%] sm:max-w-[320px] sm:rounded-[2.75rem] sm:p-[3px] md:max-w-[360px]"
      >
        <div className="h-full w-full rounded-[2.25rem] bg-[#1d1d1f] p-[8px] sm:rounded-[2.55rem] sm:p-2">
          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-white via-[#f5f5f7] to-[#e8e8ed] sm:rounded-[2rem]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_15%,rgba(0,113,227,0.06),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(212,175,55,0.06),transparent_45%)]" />
            <svg
              className="absolute bottom-0 left-1/2 w-[120%] -translate-x-1/2 text-[#1d1d1f]/[0.04]"
              viewBox="0 0 400 200"
              fill="currentColor"
              aria-hidden
            >
              <ellipse cx="200" cy="220" rx="160" ry="140" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pt-8">
              <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-md shadow-black/[0.06] ring-1 ring-black/[0.04] sm:size-24">
                <TechAvatarIcon className="size-14 sm:size-16" />
              </div>
              <p className="px-6 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-apple-label sm:text-xs">
                Asistente · Ellas
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute -bottom-6 left-1/2 h-32 w-[85%] max-w-md -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-black/[0.06] to-transparent blur-2xl" />
    </div>
  );
}
