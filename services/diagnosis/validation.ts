export class DiagnosisValidationError extends Error {
  readonly code: "INVALID_SYMPTOMS" | "EMPTY_SYMPTOMS";

  constructor(code: DiagnosisValidationError["code"], message: string) {
    super(message);
    this.name = "DiagnosisValidationError";
    this.code = code;
  }
}

function dedupeSymptoms(symptoms: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of symptoms) {
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

/**
 * Normaliza y valida la lista de síntomas. Lanza si el formato es inválido o no queda ninguno.
 */
export function validateSymptoms(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    throw new DiagnosisValidationError(
      "INVALID_SYMPTOMS",
      "Los síntomas deben enviarse como una lista de textos.",
    );
  }

  const cleaned: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") {
      throw new DiagnosisValidationError(
        "INVALID_SYMPTOMS",
        "Cada síntoma debe ser un texto.",
      );
    }
    const t = item.trim();
    if (t.length > 0) cleaned.push(t);
  }

  if (cleaned.length === 0) {
    throw new DiagnosisValidationError(
      "EMPTY_SYMPTOMS",
      "Indica al menos un síntoma descrito en texto.",
    );
  }

  return dedupeSymptoms(cleaned);
}
