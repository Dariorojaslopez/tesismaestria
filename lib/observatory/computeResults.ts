import { TREATMENTS } from "@/data/treatments";
import { getRecommendationsWithScores } from "@/lib/recommendation";
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

function buildDiagnosisSummary(data: ObservatoryWizardData): string {
  const symptoms = data.symptoms.slice(0, 3).join(", ");
  const city = data.city ? ` en ${data.city}` : "";
  return `Perfil capilar${city} con foco en ${symptoms || "equilibrio y salud del cuero cabelludo"}. La IA Ellas prioriza ingredientes naturales acordes a tus hábitos declarados.`;
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
  const scoredTreatments = getRecommendationsWithScores(
    data.symptoms,
    TREATMENTS,
    data.hairType === "coily" && data.afroSubType
      ? { afroSubType: data.afroSubType }
      : {},
  ).slice(0, 5);

  return {
    profileLabel: buildProfileLabel(data),
    diagnosisSummary: buildDiagnosisSummary(data),
    compatibilityPercent: compatibilityPercent(scoredTreatments),
    scoredTreatments,
    topIngredients: extractTopIngredients(scoredTreatments),
    habitInsights: buildHabitInsights(data),
  };
}
