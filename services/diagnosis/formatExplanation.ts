import type { AfroSubType, TreatmentRecord } from "@/data/treatments";

function listQuoted(items: string[]): string {
  if (items.length === 0) return "";
  return items.map((s) => `«${s}»`).join(", ");
}

export type ExplanationMeta = {
  hairType?: string;
  afroSubType?: AfroSubType;
};

/**
 * Texto legible para el usuario o para registros (no es lógica de negocio).
 */
export function formatDiagnosisExplanation(
  symptoms: string[],
  treatments: TreatmentRecord[],
  meta: ExplanationMeta = {},
): string {
  const symptomPart = listQuoted(symptoms);
  const hairBits: string[] = [];
  if (meta.hairType?.trim()) {
    hairBits.push(`tipo de cabello «${meta.hairType.trim()}»`);
  }
  if (meta.afroSubType) {
    hairBits.push(`subtipo afro ${meta.afroSubType}`);
  }
  const hairPart =
    hairBits.length > 0 ? ` Tomando en cuenta ${hairBits.join(" y ")},` : "";

  if (treatments.length === 0) {
    return (
      `Con los síntomas ${symptomPart},${hairPart} el catálogo actual no arroja coincidencias suficientes ` +
      `para sugerir tratamientos concretos. Prueba a reformular o ampliar la descripción.`
    );
  }

  const names = treatments.map((t) => t.name).join(", ");
  return (
    `A partir de ${symptomPart},${hairPart} se priorizan mascarillas del catálogo Ellas ordenadas por relevancia ` +
    `para esas necesidades. Propuestas: ${names}. ` +
    `Son orientaciones generales; ante síntomas agudos o persistentes conviene acudir a un profesional.`
  );
}
