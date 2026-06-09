"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type KpiCardProps = {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  index: number;
};

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, active, duration]);

  return display;
}

export function KpiCard({ label, value, suffix = "", trend, index }: KpiCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const display = useCountUp(value, inView);
  const isPercent = suffix === "%";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-gold-500/20 bg-white p-5 shadow-sm transition hover:border-gold-500/35 hover:shadow-gold"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-gold-500/10 blur-2xl transition group-hover:bg-gold-400/15" />
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-apple-label">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
        {isPercent ? (
          <>
            {display}
            <span className="text-gold-600">{suffix}</span>
          </>
        ) : (
          <>
            <span className="text-gold-600">{suffix}</span>
            {display.toLocaleString("es-CO")}
          </>
        )}
      </p>
      <p className="mt-3 text-xs text-gold-700/80">{trend}</p>
    </motion.div>
  );
}
