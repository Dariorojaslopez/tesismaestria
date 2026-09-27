import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import type { CareHabits } from "@/lib/diagnosis/careHabits";
export type { AfroSubType, TreatmentRecord } from "@/data/treatments";

export type RecommendationContext = {
  afroSubType?: AfroSubType;
  habits?: CareHabits;
};

export type ScoredTreatment = {
  treatment: TreatmentRecord;
  score: number;
};

/** Tratamiento por defecto cuando ninguna regla coincide (Cebolla / ONION BOOST). */
export const DEFAULT_FALLBACK_TREATMENT_ID = "onion-boost";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function significantTokens(s: string): string[] {
  return s.split(/[^a-z0-9]+/).filter((t) => t.length >= 3);
}

function overlapScore(a: string, b: string): number {
  if (a === b) return 4;
  const minLen = 3;
  if (a.length >= minLen && b.length >= minLen) {
    if (a.includes(b) || b.includes(a)) return 3;
  }
  const aw = new Set(significantTokens(a));
  const bw = new Set(significantTokens(b));
  let shared = 0;
  for (const w of aw) {
    if (bw.has(w)) shared += 1;
  }
  return shared;
}

function scoreAgainstSymptomList(
  userSymptom: string,
  treatmentSymptoms: readonly string[],
): number {
  let best = 0;
  const u = normalize(userSymptom);
  for (const raw of treatmentSymptoms) {
    best = Math.max(best, overlapScore(u, normalize(raw)));
  }
  return best;
}

function scoreAgainstBenefits(userSymptom: string, benefits: readonly string[]): number {
  const blob = normalize(benefits.join(" "));
  const u = normalize(userSymptom);
  let score = 0;
  if (blob.includes(u) && u.length >= 4) score += 2;
  for (const t of significantTokens(u)) {
    if (blob.includes(t)) score += 1;
  }
  return score;
}

const AFRO_TYPE_BONUS = 3;

function afroTypeBonus(
  treatment: TreatmentRecord,
  afroSubType: AfroSubType | undefined,
): number {
  if (!afroSubType) return 0;
  const note = treatment.afroBenefitByType?.[afroSubType];
  return note && note.trim().length > 0 ? AFRO_TYPE_BONUS : 0;
}

function habitBonus(treatment: TreatmentRecord, habits: CareHabits | undefined): number {
  if (!habits) return 0;
  const blob = normalize(
    [...treatment.symptoms, ...treatment.benefits, treatment.generalNote ?? ""].join(" "),
  );
  let bonus = 0;
  const stressed = habits.usesHeat === true || habits.usesChemicals === true;
  if (stressed && /repar|fortalec|rotur|quiebre|elastic|punta/.test(blob)) {
    bonus += 2;
  }
  if (habits.concernZone === "scalp" && /caspa|picor|caida|cuero/.test(blob)) {
    bonus += 2;
  }
  if (
    (habits.concernZone === "lengths" || habits.concernZone === "both") &&
    /puntas|rotur|brillo|hidrat/.test(blob)
  ) {
    bonus += 1;
  }
  return bonus;
}

function scoreTreatment(
  treatment: TreatmentRecord,
  userSymptomsNorm: string[],
  context: RecommendationContext,
): number {
  let total = afroTypeBonus(treatment, context.afroSubType);
  total += habitBonus(treatment, context.habits);
  for (const symptom of userSymptomsNorm) {
    total += scoreAgainstSymptomList(symptom, treatment.symptoms);
    total += scoreAgainstBenefits(symptom, treatment.benefits);
  }
  return total;
}

function rankTreatments(
  treatments: readonly TreatmentRecord[],
  userSymptomsNorm: string[],
  context: RecommendationContext,
): ScoredTreatment[] {
  return treatments
    .map((treatment) => ({
      treatment,
      score: scoreTreatment(treatment, userSymptomsNorm, context),
    }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.treatment.name.localeCompare(b.treatment.name, "es"),
    );
}

function applyDefaultFallback(
  ranked: ScoredTreatment[],
  treatments: readonly TreatmentRecord[],
): ScoredTreatment[] {
  if (ranked.length > 0) return ranked;

  const fallback = treatments.find(
    (treatment) => treatment.id === DEFAULT_FALLBACK_TREATMENT_ID,
  );
  if (!fallback) return [];

  return [{ treatment: fallback, score: 0 }];
}

export function getRecommendationsWithScores(
  symptoms: string[],
  treatments: readonly TreatmentRecord[],
  context: RecommendationContext = {},
): ScoredTreatment[] {
  const userSymptomsNorm = Array.from(
    new Set(symptoms.map(normalize).filter((s) => s.length > 0)),
  );
  if (userSymptomsNorm.length === 0) return [];
  const ranked = rankTreatments(treatments, userSymptomsNorm, context);
  return applyDefaultFallback(ranked, treatments);
}

export function getRecommendations(
  symptoms: string[],
  treatments: readonly TreatmentRecord[],
  context: RecommendationContext = {},
): TreatmentRecord[] {
  return getRecommendationsWithScores(symptoms, treatments, context).map(
    (row) => row.treatment,
  );
}

export type SymptomMatch = {
  symptom: string;
  strength: "strong" | "related";
};

/** Coincidencia fuerte = el síntoma está en la ficha; relacionada = aparece en beneficios. */
export function classifySymptomMatches(
  treatment: TreatmentRecord,
  userSymptoms: readonly string[],
): SymptomMatch[] {
  const matches: SymptomMatch[] = [];
  for (const symptom of userSymptoms) {
    const key = normalize(symptom);
    if (!key) continue;
    if (scoreAgainstSymptomList(key, treatment.symptoms) >= 3) {
      matches.push({ symptom, strength: "strong" });
      continue;
    }
    if (scoreAgainstBenefits(key, treatment.benefits) > 0) {
      matches.push({ symptom, strength: "related" });
    }
  }
  return matches;
}

/**
 * Conserva la mascarilla de mayor puntaje y completa el cupo con otras
 * que cubran síntomas todavía no atendidos.
 */
export function selectComplementaryRecommendations(
  ranked: readonly ScoredTreatment[],
  userSymptoms: readonly string[],
  limit = 3,
): ScoredTreatment[] {
  if (ranked.length <= 1) return ranked.slice(0, limit);

  const pool = [...ranked];
  const picked: ScoredTreatment[] = [];
  const covered = new Set<string>();

  const cover = (row: ScoredTreatment) => {
    for (const match of classifySymptomMatches(row.treatment, userSymptoms)) {
      covered.add(normalize(match.symptom));
    }
  };

  const uncoveredWeight = (row: ScoredTreatment) => {
    let weight = 0;
    for (const match of classifySymptomMatches(row.treatment, userSymptoms)) {
      if (covered.has(normalize(match.symptom))) continue;
      weight += match.strength === "strong" ? 2 : 1;
    }
    return weight;
  };

  const anchor = pool.shift();
  if (!anchor) return [];
  picked.push(anchor);
  cover(anchor);

  while (picked.length < limit && pool.length > 0) {
    let bestIndex = 0;
    let bestFresh = -1;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < pool.length; i++) {
      const fresh = uncoveredWeight(pool[i]);
      const score = pool[i].score;
      if (fresh > bestFresh || (fresh === bestFresh && score > bestScore)) {
        bestIndex = i;
        bestFresh = fresh;
        bestScore = score;
      }
    }

    const chosen = pool.splice(bestIndex, 1)[0];
    if (!chosen) break;
    picked.push(chosen);
    cover(chosen);
  }

  return picked;
}
