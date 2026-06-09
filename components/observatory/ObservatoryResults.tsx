"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ObservatoryResult } from "@/lib/observatory/types";
import { brandImageSrcForTreatmentId } from "@/lib/brandProductImage";

type ObservatoryResultsProps = {
  result: ObservatoryResult;
  userName: string;
  onReset: () => void;
};

export function ObservatoryResults({
  result,
  userName,
  onReset,
}: ObservatoryResultsProps) {
  const greeting = userName.trim() || "Usuaria";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-gold-500/25 bg-gradient-to-br from-white to-gold-500/5 p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
          Tu resultado · IA Ellas
        </p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-[#1d1d1f] sm:text-3xl">
          {greeting}, tu perfil capilar está listo
        </h3>
        <p className="mt-2 text-sm font-medium text-gold-700">{result.profileLabel}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-apple-label">
          {result.diagnosisSummary}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-label">
            Compatibilidad
          </p>
          <div className="relative mx-auto mt-6 flex size-36 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#d4af37"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(result.compatibilityPercent / 100) * 327} 327`}
              />
            </svg>
            <span className="font-display text-4xl font-semibold text-[#1d1d1f]">
              {result.compatibilityPercent}
              <span className="text-lg text-gold-600">%</span>
            </span>
          </div>
          <p className="mt-4 text-center text-xs text-apple-label">
            Alineación con rutinas naturales Ellas
          </p>
        </div>

        <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-label">
            Ingredientes sugeridos
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.topIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs font-medium text-gold-800"
              >
                {ingredient}
              </span>
            ))}
          </div>
          {result.habitInsights.length > 0 ? (
            <ul className="mt-5 space-y-2 text-sm text-[#424245]">
              {result.habitInsights.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-gold-600">→</span>
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-apple-label">
          Productos recomendados
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.scoredTreatments.map((row, index) => {
            const img = brandImageSrcForTreatmentId(row.treatment.id);
            return (
              <li
                key={row.treatment.id}
                className="flex gap-4 rounded-xl border border-black/[0.08] bg-apple-gray/50 p-4"
              >
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-white">
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-[10px] text-black/40">Ellas</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gold-700">
                    #{index + 1} · Score {row.score}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#1d1d1f]">
                    {row.treatment.name}
                  </p>
                  <Link
                    href={`/mascarillas/${row.treatment.id}`}
                    className="mt-2 inline-block text-xs text-gold-700 hover:underline"
                  >
                    Ver ficha →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-black/[0.12] px-5 py-3 text-sm font-medium text-[#1d1d1f] transition hover:border-gold-500/40"
        >
          Nuevo diagnóstico
        </button>
        <Link
          href="/#catalogo"
          className="rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-gold-400"
        >
          Explorar catálogo
        </Link>
      </div>
    </motion.div>
  );
}
