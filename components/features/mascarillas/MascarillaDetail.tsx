import Link from "next/link";
import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import { MASCARILLA_BASE } from "@/lib/mascarillaRoutes";

const AFRO_ORDER: AfroSubType[] = ["4A", "4B", "4C"];

export type MascarillaDetailProps = {
  treatment: TreatmentRecord;
  /** Subtipo resaltado (p. ej. desde el diagnóstico). */
  highlightAfro?: AfroSubType;
};

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function MascarillaDetail({
  treatment,
  highlightAfro,
}: MascarillaDetailProps) {
  const afro = treatment.afroBenefitByType;
  const hasAfro = afro && AFRO_ORDER.some((k) => afro[k]?.trim());

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2 border-b border-slate-200/80 pb-8">
        <p className="text-sm font-medium text-emerald-800">
          Tratamientos Capilares Ellas
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {treatment.name}
        </h1>
        <p className="text-base text-slate-600">
          Ingredientes clave:{" "}
          <span className="font-medium text-slate-800">
            {treatment.ingredients.join(" · ")}
          </span>
        </p>
      </header>

      {highlightAfro && afro?.[highlightAfro] ? (
        <div className="rounded-2xl border-2 border-teal-400/60 bg-teal-50/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-900/90">
            Enfoque para tu tipo {highlightAfro}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-900">
            {afro[highlightAfro]}
          </p>
        </div>
      ) : null}

      <Section title="Beneficios">
        <ul className="flex flex-col gap-2">
          {treatment.benefits.map((b) => (
            <li key={b} className="flex gap-2 text-slate-800">
              <span className="text-emerald-600" aria-hidden>
                ✓
              </span>
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Ideal si presentas">
        <ul className="flex flex-wrap gap-2">
          {treatment.symptoms.map((s) => (
            <li
              key={s}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Ingredientes (composición)">
        <ul className="space-y-2">
          {treatment.ingredients.map((i) => (
            <li
              key={i}
              className="flex gap-2 border-l-2 border-emerald-400/70 pl-3 text-slate-800"
            >
              <span className="leading-relaxed">{i}</span>
            </li>
          ))}
        </ul>
      </Section>

      {treatment.vitamins ? (
        <Section title="Vitaminas y activos">
          <p className="text-base leading-relaxed text-slate-800">
            {treatment.vitamins}
          </p>
        </Section>
      ) : null}

      {hasAfro ? (
        <Section title="Por tipo de rizo (4A · 4B · 4C)">
          <div className="grid gap-4 sm:grid-cols-1">
            {AFRO_ORDER.map((key) => {
              const text = afro?.[key];
              if (!text?.trim()) return null;
              const isHighlight = highlightAfro === key;
              return (
                <div
                  key={key}
                  className={`rounded-xl border px-4 py-3 ${
                    isHighlight
                      ? "border-teal-400 bg-teal-50/90 ring-1 ring-teal-200/80"
                      : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{key}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      ) : null}

      {treatment.chemicallyTreatedNote ? (
        <Section
          title="Cabello con tratamiento químico"
          className="border-amber-200/90 bg-amber-50/40"
        >
          <p className="text-base leading-relaxed text-amber-950/95">
            {treatment.chemicallyTreatedNote}
          </p>
        </Section>
      ) : null}

      {treatment.generalNote ? (
        <Section title="Nota general">
          <p className="text-base leading-relaxed text-slate-700">
            {treatment.generalNote}
          </p>
        </Section>
      ) : null}

      <footer className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8">
        <Link
          href="/#diagnostico"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Volver al diagnóstico
        </Link>
        <Link
          href={MASCARILLA_BASE}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline"
        >
          Ver todas las mascarillas
        </Link>
      </footer>
    </article>
  );
}
