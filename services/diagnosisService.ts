import { getRecommendationsWithScores } from "@/lib/recommendation";
import { persistDiagnosis } from "@/services/repositories/diagnosisRepository";
import { findAllTreatments } from "@/services/repositories/treatmentRepository";
import { formatDiagnosisExplanation } from "./diagnosis/formatExplanation";
import type { DiagnosisInput, DiagnosisResult } from "./diagnosis/types";
import { parseAfroSubType } from "./diagnosis/validateAfroSubType";
import { validateSymptoms } from "./diagnosis/validation";

export type { DiagnosisInput, DiagnosisResult } from "./diagnosis/types";
export { DiagnosisValidationError } from "./diagnosis/validation";

/**
 * Orquesta el flujo de diagnóstico: validación → catálogo en DB → motor → persistencia.
 */
export async function processDiagnosis(
  input: DiagnosisInput,
): Promise<DiagnosisResult> {
  const symptoms = validateSymptoms(input.symptoms);
  const afroSubType = parseAfroSubType(input.afroSubType);
  const catalog = await findAllTreatments();
  const recommendations = getRecommendationsWithScores(symptoms, catalog, {
    afroSubType,
  });
  const treatments = recommendations.map((row) => row.treatment);
  const hairTypeLabel =
    typeof input.hairTypeLabel === "string" && input.hairTypeLabel.trim()
      ? input.hairTypeLabel.trim()
      : typeof input.hairType === "string"
        ? input.hairType
        : undefined;

  const explanation = formatDiagnosisExplanation(symptoms, treatments, {
    hairType: hairTypeLabel,
    afroSubType,
  });

  const sessionId = await persistDiagnosis({
    hairType: input.hairType,
    hairTypeLabel,
    afroSubType,
    symptoms,
    explanation,
    recommendations,
  });

  return { sessionId, treatments, explanation };
}
