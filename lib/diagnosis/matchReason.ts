import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import { classifySymptomMatches } from "@/lib/recommendation";
import { pickPhrase } from "@/lib/diagnosis/phraseVariants";

function sentence(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const headed = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(headed) ? headed : `${headed}.`;
}

function benefitSentence(benefits: readonly string[]): string {
  const parts = benefits
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "";
  return sentence(parts.join(", "));
}

function listSymptoms(symptoms: readonly string[]): string {
  if (symptoms.length === 0) return "";
  if (symptoms.length === 1) return symptoms[0].toLowerCase();
  const head = symptoms.slice(0, -1).map((item) => item.toLowerCase());
  return `${head.join(", ")} y ${symptoms[symptoms.length - 1].toLowerCase()}`;
}

export function explainMatch(
  treatment: TreatmentRecord,
  symptoms: readonly string[],
  afroSubType?: AfroSubType,
): { headline: string; line: string } {
  const matches = classifySymptomMatches(treatment, symptoms);
  const strong = matches
    .filter((match) => match.strength === "strong")
    .map((match) => match.symptom);
  const related = matches
    .filter((match) => match.strength === "related")
    .map((match) => match.symptom);

  const listed = listSymptoms(strong.length ? strong : related);
  const headline = strong.length
    ? pickPhrase([
        `Cubre ${listed}.`,
        `La elijo porque responde a ${listed}.`,
        `Encaja sobre todo con ${listed}.`,
        `Va dirigida a ${listed}.`,
      ])
    : related.length
      ? pickPhrase([
          `Se relaciona con ${listed} por sus beneficios.`,
          `Sus beneficios se acercan a ${listed}.`,
          `No está marcada justo para eso, pero se acerca a ${listed}.`,
        ])
      : pickPhrase([
          "Es una opción general del catálogo cuando no hay una coincidencia más específica.",
          "La dejo como alternativa general del catálogo, sin una coincidencia fina.",
          "Entra como apoyo general, porque no hay una ficha más específica.",
        ]);

  const benefit = benefitSentence(treatment.benefits);
  const afro =
    afroSubType && treatment.afroBenefitByType?.[afroSubType]
      ? sentence(treatment.afroBenefitByType[afroSubType])
      : "";

  const parts = [headline, benefit, afro].filter(Boolean);
  if (benefit && parts.length > 1 && Math.random() < 0.5) {
    const swapped = [benefit, headline, afro].filter(Boolean);
    return { headline, line: swapped.join(" ") };
  }

  return {
    headline,
    line: parts.join(" "),
  };
}

export function describeMatch(
  treatment: TreatmentRecord,
  symptoms: readonly string[],
  afroSubType?: AfroSubType,
): string {
  return explainMatch(treatment, symptoms, afroSubType).line;
}
