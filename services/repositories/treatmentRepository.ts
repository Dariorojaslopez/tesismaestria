import type { TreatmentRecord } from "@/data/treatments";
import { toTreatmentRecord } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";

const treatmentInclude = {
  ingredients: true,
  benefits: true,
  symptoms: true,
  afroBenefits: true,
} as const;

export async function findAllTreatments(): Promise<TreatmentRecord[]> {
  const rows = await prisma.treatment.findMany({
    include: treatmentInclude,
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toTreatmentRecord);
}

export async function findTreatmentById(
  id: string,
): Promise<TreatmentRecord | null> {
  const row = await prisma.treatment.findUnique({
    where: { id },
    include: treatmentInclude,
  });
  return row ? toTreatmentRecord(row) : null;
}

export async function findAllTreatmentIds(): Promise<string[]> {
  const rows = await prisma.treatment.findMany({
    select: { id: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => row.id);
}
