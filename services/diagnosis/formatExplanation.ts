import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import {
  careReferenceLine,
  describeHabits,
  ethnicHairGuidance,
} from "@/lib/diagnosis/ethnicHairGuidance";
import type { CareHabits } from "@/lib/diagnosis/careHabits";
import { describeMatch } from "@/lib/diagnosis/matchReason";
import { pickPhrase } from "@/lib/diagnosis/phraseVariants";

function listQuoted(items: string[]): string {
  if (items.length === 0) return "";
  return items.map((s) => s.toLowerCase()).join(", ");
}

export type ExplanationMeta = {
  /** Etiqueta visible, p. ej. «Crespo / afro». */
  hairType?: string;
  /** Valor del formulario: straight | wavy | curly | coily. */
  hairPattern?: string;
  afroSubType?: AfroSubType;
  habits?: CareHabits;
};

/**
 * Respuesta del diagnóstico: contexto del rizo, motivo de cada mascarilla
 * y límite de cuidado cosmético.
 */
export function formatDiagnosisExplanation(
  symptoms: string[],
  treatments: TreatmentRecord[],
  meta: ExplanationMeta = {},
): string {
  const guidance = ethnicHairGuidance({
    symptoms,
    hairType: meta.hairPattern,
    hairLabel: meta.hairType,
    afroSubType: meta.afroSubType,
    habits: meta.habits,
  });

  const hairBits: string[] = [];
  if (meta.hairType?.trim()) hairBits.push(meta.hairType.trim().toLowerCase());
  if (meta.afroSubType) hairBits.push(`subtipo ${meta.afroSubType}`);
  const symptomsText = listQuoted(symptoms);
  const profile = pickPhrase(
    hairBits.length > 0
      ? [
          `Con cabello ${hairBits.join(", ")} y ${symptomsText}`,
          `Parto de un cabello ${hairBits.join(", ")} con ${symptomsText}`,
          `Para un cabello ${hairBits.join(", ")}, viendo ${symptomsText}`,
        ]
      : [
          `Con ${symptomsText}`,
          `A partir de ${symptomsText}`,
          `Mirando ${symptomsText}`,
        ],
  );
  const routine = describeHabits(meta.habits);
  const profileLine = routine
    ? pickPhrase([
        `${profile}. En tu rutina, ${routine}.`,
        `${profile}. Además, ${routine}.`,
        `${profile}. Eso va con que ${routine}.`,
      ])
    : `${profile}.`;

  const caseSpecific = Boolean(meta.habits);
  const lead = [
    profileLine,
    ...(caseSpecific ? [] : [guidance.structure]),
    guidance.context,
    ...guidance.notes,
  ].join(" ");

  if (treatments.length === 0) {
    return `${lead} ${pickPhrase([
      "El catálogo actual no tiene una mascarilla que encaje con esa combinación. Prueba a marcar otro síntoma.",
      "Con esa combinación no encuentro una mascarilla clara en el catálogo. Prueba con otro síntoma.",
      "Todavía no hay una coincidencia suficiente en el catálogo. Cambia o amplía lo que marcaste.",
    ])} ${careReferenceLine()} ${guidance.disclaimer}`;
  }

  const intro =
    treatments.length === 1
      ? pickPhrase([
          "Esta mascarilla es la que mejor encaja:",
          "La opción que más se acerca es esta:",
          "Me quedo con esta mascarilla:",
        ])
      : pickPhrase([
          "Estas mascarillas se reparten lo que marcaste:",
          "El tratamiento sigue siendo este trío, y cada una cubre una parte:",
          "Te las propongo así, con el motivo de cada una:",
          "Estas son las que elijo, y te cuento por qué:",
        ]);

  const lines = treatments.map((treatment) => {
    const reason = describeMatch(treatment, symptoms, meta.afroSubType);
    return `${treatment.name}. ${reason}`;
  });

  return [
    lead,
    intro,
    ...lines,
    careReferenceLine(),
    guidance.disclaimer,
  ].join("\n\n");
}
