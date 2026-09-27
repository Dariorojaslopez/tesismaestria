import { TREATMENTS } from "@/data/treatments";
import type { CareHabits, WashRhythm } from "@/lib/diagnosis/careHabits";
import { ethnicHairGuidance } from "@/lib/diagnosis/ethnicHairGuidance";
import {
  getRecommendationsWithScores,
  selectComplementaryRecommendations,
} from "@/lib/recommendation";
import type { ObservatoryResult, ObservatoryWizardData } from "./types";

const HAIR_LABELS: Record<string, string> = {
  straight: "Liso",
  wavy: "Ondulado",
  curly: "Rizado",
  coily: "Crespo / afro",
};

function buildProfileLabel(data: ObservatoryWizardData): string {
  const hair = HAIR_LABELS[data.hairType] ?? data.hairType;
  if (data.hairType === "coily" && data.afroSubType) {
    return `Cabello ${hair} · Tipo ${data.afroSubType}`;
  }
  return `Cabello ${hair}`;
}

function observatoryHabits(data: ObservatoryWizardData): CareHabits {
  const washRhythm: WashRhythm | undefined =
    data.washFrequency === "Diario" || data.washFrequency === "2-3 veces por semana"
      ? "often"
      : data.washFrequency === "Semanal"
        ? "weekly"
        : data.washFrequency === "Quincenal"
          ? "rare"
          : undefined;
  return {
    washRhythm,
    usesHeat: data.usesHeat,
    usesChemicals: data.usesChemicals,
  };
}

function buildDiagnosisSummary(data: ObservatoryWizardData): string {
  const habits = observatoryHabits(data);
  const guidance = ethnicHairGuidance({
    symptoms: data.symptoms,
    hairType: data.hairType,
    afroSubType:
      data.hairType === "coily" && data.afroSubType
        ? data.afroSubType
        : undefined,
    habits,
  });
  const note = guidance.notes[0] ? ` ${guidance.notes[0]}` : "";
  return `${guidance.structure} ${guidance.context}${note}`;
}

function buildHabitInsights(data: ObservatoryWizardData): string[] {
  const insights: string[] = [];
  if (data.washFrequency) {
    insights.push(`Frecuencia de lavado: ${data.washFrequency}`);
  }
  if (data.usesHeat) {
    insights.push("Uso de calor detectado — se priorizan fórmulas reparadoras.");
  }
  if (data.usesChemicals) {
    insights.push("Historial de procesos químicos — rutinas de fortalecimiento recomendadas.");
  }
  if (data.naturalProductsInterest) {
    insights.push(`Preferencia: ${data.naturalProductsInterest}`);
  }
  if (data.careRoutine) {
    insights.push(`Rutina actual: ${data.careRoutine}`);
  }
  return insights;
}

function extractTopIngredients(
  scored: ReturnType<typeof getRecommendationsWithScores>,
  limit = 6,
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const row of scored) {
    for (const raw of row.treatment.ingredients) {
      const name = raw.split(":")[0]?.trim() ?? raw.trim();
      const key = name.toLowerCase();
      if (!name || seen.has(key)) continue;
      seen.add(key);
      result.push(name);
      if (result.length >= limit) return result;
    }
  }
  return result;
}

function compatibilityPercent(
  scored: ReturnType<typeof getRecommendationsWithScores>,
): number {
  if (scored.length === 0) return 62;
  const top = scored[0]?.score ?? 0;
  const maxObserved = 24;
  const raw = Math.min(98, Math.round(58 + (top / maxObserved) * 40));
  return Math.max(raw, 68);
}

export function computeObservatoryResult(
  data: ObservatoryWizardData,
): ObservatoryResult {
  const habits = observatoryHabits(data);
  const ranked = getRecommendationsWithScores(
    data.symptoms,
    TREATMENTS,
    data.hairType === "coily" && data.afroSubType
      ? { afroSubType: data.afroSubType, habits }
      : { habits },
  );
  const scoredTreatments = selectComplementaryRecommendations(
    ranked,
    data.symptoms,
    5,
  );

  return {
    profileLabel: buildProfileLabel(data),
    diagnosisSummary: buildDiagnosisSummary(data),
    compatibilityPercent: compatibilityPercent(scoredTreatments),
    scoredTreatments,
    topIngredients: extractTopIngredients(scoredTreatments),
    habitInsights: buildHabitInsights(data),
  };
}
