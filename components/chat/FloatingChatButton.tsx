"use client";

import { motion } from "framer-motion";
import { TechAvatarIcon } from "@/components/ui/TechAvatarIcon";

type Props = {
  onOpen: () => void;
  hidden: boolean;
};

export function FloatingChatButton({ onOpen, hidden }: Props) {
  if (hidden) return null;

  return (
    <motion.button
      type="button"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="fixed bottom-6 right-6 z-[90] flex size-14 items-center justify-center rounded-full bg-[#d4af37] text-white shadow-[0_8px_32px_-4px_rgba(212,175,55,0.5),0_4px_16px_rgba(0,0,0,0.12)] ring-4 ring-[#f5f5f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8962e] sm:size-16"
      onClick={onOpen}
      aria-label="Abrir asistente capilar Ellas"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-white/20 animate-pulse-slow"
        aria-hidden
      />
      <span className="relative flex size-11 items-center justify-center rounded-full bg-white sm:size-12">
        <TechAvatarIcon className="size-8 sm:size-9" />
      </span>
    </motion.button>
  );
}
