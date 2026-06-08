import { HAIR_TREATMENTS, type HairTreatment } from "@/data/catalog/treatments";

export type Treatment = HairTreatment;

/** Texto normalizado: minúsculas, sin acentos, espacios colapsados */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Reglas declarativas: si el síntoma coincide con `when`, sumamos `score`
 * por cada `inBenefits` que aparezca como subcadena en el texto de beneficios (normalizado).
 */
const RULES: readonly {
  when: (symptomNorm: string) => boolean;
  inBenefits: readonly string[];
  score: number;
}[] = [
  {
    when: (s) =>
      (/\bhair\b/.test(s) && /\bloss\b/.test(s)) ||
      /\balopecia\b/.test(s) ||
      (/\bcaida\b/.test(s) &&
        (/\bcabello\b/.test(s) || /\bpelo\b/.test(s) || /\bcapilar\b/.test(s))) ||
      /\bthinning\b/.test(s),
    inBenefits: [
      "caida",
      "prevenir",
      "prevencion",
      "adelgazamiento",
      "vitamin",
    ],
    score: 3,
  },
  {
    when: (s) =>
      (/\bdry\b/.test(s) && /\bhair\b/.test(s)) ||
      /\bdryness\b/.test(s) ||
      /\bcabello seco\b/.test(s) ||
      /\bpelo seco\b/.test(s) ||
      /\bsequedad\b/.test(s) ||
      /\bdehydrat/.test(s),
    inBenefits: ["hidrat", "repara", "seco", "reseco"],
    score: 2,
  },
  {
    when: (s) => /\bfrizz\b/.test(s) || /\bencresp/.test(s),
    inBenefits: ["frizz", "anti-frizz"],
    score: 2,
  },
  {
    when: (s) =>
      /\bshine\b/.test(s) ||
      /\bbrillo\b/.test(s) ||
      /\bdull\b/.test(s) ||
      /\bopaco\b/.test(s),
    inBenefits: ["brillo"],
    score: 2,
  },
  {
    when: (s) =>
      /\bgrowth\b/.test(s) ||
      /\bcrecimient/.test(s) ||
      /\bno crece\b/.test(s) ||
      /\bslow growth\b/.test(s),
    inBenefits: ["crecimient", "circulacion", "circulaci"],
    score: 2,
  },
  {
    when: (s) =>
      /\bstrength\b/.test(s) ||
      /\bweak\b/.test(s) ||
      /\bdebil\b/.test(s) ||
      /\bfortalec/.test(s),
    inBenefits: ["fortalec", "repar"],
    score: 2,
  },
  {
    when: (s) =>
      /\bdamage\b/.test(s) ||
      /\bbreakage\b/.test(s) ||
      /\bbreaking\b/.test(s) ||
      /\bdañ/.test(s) ||
      /\bdañad/.test(s) ||
      /\bquebradiz/.test(s),
    inBenefits: ["repar"],
    score: 2,
  },
  {
    when: (s) => /\bhydrat/.test(s) || (/\bhidrat/.test(s) && !/\bhair\b/.test(s)),
    inBenefits: ["hidrat"],
    score: 1,
  },
];

function scoreSymptomAgainstBenefits(
  symptomNorm: string,
  benefitBlob: string,
): number {
  let total = 0;

  for (const rule of RULES) {
    if (!rule.when(symptomNorm)) continue;
    let hits = 0;
    for (const fragment of rule.inBenefits) {
      if (benefitBlob.includes(fragment)) hits += 1;
    }
    if (hits > 0) {
      total += rule.score * hits;
    }
  }

  const tokens = symptomNorm.split(/[^a-z0-9]+/).filter((t) => t.length >= 4);
  for (const token of tokens) {
    if (benefitBlob.includes(token)) total += 1;
  }

  return total;
}

function relevanceScore(treatment: Treatment, symptomsNorm: string[]): number {
  const benefitBlob = normalize(treatment.benefits.join(" "));
  return symptomsNorm.reduce(
    (sum, symptom) => sum + scoreSymptomAgainstBenefits(symptom, benefitBlob),
    0,
  );
}

/**
 * Catálogo legado (`data/catalog/treatments`): cruza síntomas con `benefits`.
 * La UI actual usa esta función hasta migrar a `getRecommendations` en `lib/recommendation.ts`.
 */
export function getCatalogRecommendations(symptoms: string[]): Treatment[] {
  const symptomsNorm = Array.from(
    new Set(symptoms.map(normalize).filter((s) => s.length > 0)),
  );
  if (symptomsNorm.length === 0) return [];

  const ranked = HAIR_TREATMENTS.map((treatment) => ({
    treatment,
    score: relevanceScore(treatment, symptomsNorm),
  }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.treatment.name.localeCompare(b.treatment.name, "es"),
    );

  return ranked.map((row) => row.treatment);
}
