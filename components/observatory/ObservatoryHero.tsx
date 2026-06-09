"use client";

import { motion } from "framer-motion";
import type { ObservatoryAnalyticsPayload } from "@/lib/observatory/analyticsTypes";
import { KpiCard } from "./KpiCard";

type ObservatoryHeroProps = {
  analytics: ObservatoryAnalyticsPayload;
  loading?: boolean;
};

export function ObservatoryHero({ analytics, loading = false }: ObservatoryHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.06] bg-white px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
            <span className="size-1.5 animate-pulse rounded-full bg-gold-500" />
            Centro de inteligencia capilar
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[#1d1d1f] sm:text-5xl lg:text-6xl">
            Resultados
            <span className="block text-gradient-gold">Capilares Afro</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-apple-label sm:text-lg">
            Datos, IA y recomendaciones personalizadas de la comunidad Ellas.
            Visualiza el pulso del cuidado capilar afro y participa con tu
            diagnóstico.
          </p>
        </motion.div>

        <div
          className={`mt-12 grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : "opacity-100"}`}
        >
          {analytics.kpis.map((kpi, index) => (
            <KpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              suffix={kpi.suffix}
              trend={kpi.trend}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
