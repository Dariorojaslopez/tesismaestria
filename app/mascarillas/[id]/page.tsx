import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MascarillaDetail } from "@/components/features/mascarillas/MascarillaDetail";
import type { AfroSubType } from "@/data/treatments";
import { findTreatmentById } from "@/services/repositories/treatmentRepository";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

function parseAfroParam(raw: string | string[] | undefined): AfroSubType | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "4A" || v === "4B" || v === "4C") return v;
  return undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await findTreatmentById(params.id);
  if (!t) {
    return { title: "Mascarilla" };
  }
  return {
    title: `${t.name} · Mascarilla Ellas`,
    description: t.benefits.slice(0, 3).join(". "),
  };
}

export default async function MascarillaPage({ params, searchParams }: PageProps) {
  const treatment = await findTreatmentById(params.id);
  if (!treatment) {
    notFound();
  }

  const highlightAfro = parseAfroParam(searchParams.afro);

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
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Ficha de producto
          </span>
        </div>
      </div>
      <MascarillaDetail
        treatment={treatment}
        highlightAfro={highlightAfro}
      />
    </div>
  );
}
