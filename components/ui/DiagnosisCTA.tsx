"use client";

import { useChatShell } from "@/components/chat";

export function DiagnosisCTA() {
  const { openChat } = useChatShell();

  return (
    <button
      type="button"
      onClick={openChat}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-center overflow-hidden rounded-full border border-[#f0e6c8] bg-gradient-to-br from-[#fffdf7] via-[#f0d78c] to-[#c9a227] px-10 py-3.5 text-base font-semibold tracking-wide text-[#1f160c] shadow-[inset_0_2px_3px_rgba(255,255,255,0.75),inset_0_-3px_8px_rgba(120,82,20,0.35),0_6px_20px_-4px_rgba(180,140,40,0.45),0_2px_8px_rgba(0,0,0,0.12)] ring-2 ring-[#d4af37]/50 ring-offset-2 ring-offset-[#f5f5f7] transition-[filter,transform,box-shadow] hover:brightness-[1.04] hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.85),inset_0_-3px_8px_rgba(120,82,20,0.3),0_8px_28px_-4px_rgba(212,175,55,0.55),0_4px_12px_rgba(0,0,0,0.14)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8962e] sm:w-auto sm:min-w-[240px]"
    >
      {/* Brillo superior tipo facetado */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/55 via-white/15 to-transparent"
        aria-hidden
      />
      {/* Reflejo lateral */}
      <span
        className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden
      />
      <span className="relative z-[1] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
        Comenzar diagnóstico
      </span>
    </button>
  );
}
