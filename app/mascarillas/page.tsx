import type { Metadata } from "next";
import Link from "next/link";
import { mascarillaPath } from "@/lib/mascarillaRoutes";
import { findAllTreatments } from "@/services/repositories/treatmentRepository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mascarillas · Tratamientos Capilares Ellas",
  description:
    "Catálogo de mascarillas capilares naturales: ingredientes y beneficios por producto.",
};

export default async function MascarillasIndexPage() {
  const treatments = await findAllTreatments();

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200/80 bg-white/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Inicio
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Mascarillas
        </h1>
        <p className="mt-2 text-slate-600">
          Catálogo Tratamientos Capilares Ellas. Abre cada ficha para ver
          vitaminas, tipos 4A–4C y más detalle.
        </p>
        <ul className="mt-8 grid list-none gap-3 sm:gap-4">
          {treatments.map((t) => (
            <li key={t.id}>
              <Link
                href={mascarillaPath(t.id)}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-emerald-300/80 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <span className="font-semibold text-slate-900">{t.name}</span>
                <span className="mt-1 text-sm text-emerald-800 sm:mt-0">
                  Ver ficha →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
