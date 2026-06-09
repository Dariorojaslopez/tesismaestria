"use client";

import type { ReactNode } from "react";

type ChartPanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function ChartPanel({
  title,
  subtitle,
  children,
  className = "",
}: ChartPanelProps) {
  return (
    <article
      className={`rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <header className="mb-5">
        <h3 className="text-sm font-semibold tracking-wide text-[#1d1d1f]">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-apple-label">{subtitle}</p>
        ) : null}
      </header>
      <div className="h-[260px] w-full sm:h-[280px]">{children}</div>
    </article>
  );
}
