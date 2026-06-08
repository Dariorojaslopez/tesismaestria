"use client";

import { motion } from "framer-motion";
import { HairDiagnosisForm } from "@/components/diagnosis";
import { TechAvatarIcon } from "@/components/ui/TechAvatarIcon";
import { cancelBotSpeech } from "@/lib/speech/botSpeech";

type Props = {
  onClose: () => void;
};

export function ChatDrawer({ onClose }: Props) {
  const close = () => {
    cancelBotSpeech();
    onClose();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-drawer-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-5"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        aria-label="Cerrar asistente"
        onClick={close}
      />
      <motion.div
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        exit={{ y: "105%" }}
        transition={{ type: "spring", damping: 34, stiffness: 360 }}
        className="relative z-[101] flex h-[min(90dvh,840px)] w-full max-w-[min(100%,28rem)] flex-col overflow-hidden rounded-t-[1.4rem] border border-black/[0.08] bg-white shadow-[0_-12px_48px_rgba(0,0,0,0.12)] sm:max-h-[min(88dvh,820px)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-[#fbfbfd] px-4 py-3.5 backdrop-blur-md sm:px-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
            <TechAvatarIcon className="size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="chat-drawer-title"
              className="truncate text-[0.95rem] font-semibold tracking-tight text-[#1d1d1f] sm:text-base"
            >
              Asistente Ellas · IA capilar
            </h2>
            <p className="text-[11px] text-apple-label sm:text-xs">
              Diagnóstico guiado · Tratamientos naturales
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-apple-blue transition-colors hover:bg-apple-blue/10 active:bg-apple-blue/15"
          >
            Cerrar
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden bg-[#f5f5f7] p-2 sm:p-3">
          <HairDiagnosisForm layout="drawer" className="h-full min-h-0 shadow-none ring-0" />
        </div>
      </motion.div>
    </motion.div>
  );
}
