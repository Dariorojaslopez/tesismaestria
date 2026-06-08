"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Fotografía principal de marca: producto real, comunidad y cuidado natural.
 */
export function HeroLifestyleImage({ className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#e8e8ed] shadow-[0_24px_64px_-20px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.06] sm:rounded-[1.75rem]">
        <div className="relative w-full min-h-[min(52vh,520px)] h-[min(52vh,520px)] sm:min-h-[min(56vh,580px)] sm:h-[min(56vh,580px)] md:min-h-[min(64vh,640px)] md:h-[min(64vh,640px)] lg:min-h-[min(68vh,720px)] lg:h-[min(68vh,720px)]">
          <Image
            src="/images/hero-ellas.png"
            alt="Mujeres con cabello natural y mascarillas capilares artesanales Ellas"
            fill
            priority
            className="object-cover object-bottom sm:object-[center_bottom]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1152px"
          />
        </div>
      </div>
    </motion.div>
  );
}
