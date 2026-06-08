import type { TreatmentRecord } from "@/data/treatments";
import { prisma } from "@/lib/prisma";

export type PersistDiagnosisInput = {
  hairType?: string;
  hairTypeLabel?: string;
  afroSubType?: string;
  symptoms: string[];
  explanation: string;
  recommendations: { treatment: TreatmentRecord; score: number }[];
};

export async function persistDiagnosis(
  input: PersistDiagnosisInput,
): Promise<string> {
  const session = await prisma.diagnosisSession.create({
    data: {
      hairType: input.hairType ?? null,
      hairTypeLabel: input.hairTypeLabel ?? null,
      afroSubType: input.afroSubType ?? null,
      explanation: input.explanation,
      symptoms: {
        create: input.symptoms.map((text) => ({ text })),
      },
      recommendations: {
        create: input.recommendations.map((row, index) => ({
          treatmentId: row.treatment.id,
          score: row.score,
          rank: index + 1,
        })),
      },
    },
    select: { id: true },
  });

  return session.id;
}
