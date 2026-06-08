"use client";

import { motion } from "framer-motion";
import { DiagnosisCTA } from "@/components/ui/DiagnosisCTA";
import { HeroLifestyleImage } from "./HeroLifestyleImage";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function LandingHero() {
  return (
    <section
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#f5f5f7]"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-20%,rgba(255,255,255,0.9),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-[1] pt-2 sm:pt-3 md:pt-4">
        <HeroLifestyleImage className="mb-6 sm:mb-8" />
      </div>

      <div className="relative z-[1] flex flex-1 flex-col justify-center px-6 pb-14 pt-2 sm:px-10 sm:pb-16 md:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easeOut }}
            className="text-sm font-medium uppercase tracking-[0.18em] text-apple-label sm:text-base"
          >
            Cuidado capilar natural
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: easeOut }}
            className="mt-3 text-balance text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl sm:leading-[1.05] md:text-6xl md:leading-[1.02]"
          >
            Diagnóstico capilar inteligente
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: easeOut }}
            className="mx-auto mt-5 max-w-2xl text-pretty text-lg font-normal leading-relaxed text-apple-label sm:mt-6 sm:text-xl sm:leading-relaxed"
          >
            Recomendaciones personalizadas con inteligencia artificial para el
            cuidado del cabello afro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: easeOut }}
            className="mt-8 flex justify-center sm:mt-10"
          >
            <DiagnosisCTA />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
