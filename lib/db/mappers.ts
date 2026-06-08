import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import type {
  AfroBenefit,
  AfroSubType as AfroSubTypeRow,
  FormSymptom,
  HairType,
  Treatment,
  TreatmentBenefit,
  TreatmentIngredient,
  TreatmentSymptom,
} from "@prisma/client";

export type TreatmentWithRelations = Treatment & {
  ingredients: TreatmentIngredient[];
  benefits: TreatmentBenefit[];
  symptoms: TreatmentSymptom[];
  afroBenefits: AfroBenefit[];
};

export function toTreatmentRecord(treatment: TreatmentWithRelations): TreatmentRecord {
  const afroBenefitByType: Partial<Record<AfroSubType, string>> = {};
  for (const row of treatment.afroBenefits) {
    if (row.subType === "4A" || row.subType === "4B" || row.subType === "4C") {
      afroBenefitByType[row.subType] = row.description;
    }
  }

  return {
    id: treatment.id,
    name: treatment.name,
    ingredients: treatment.ingredients
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => i.text),
    benefits: treatment.benefits
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => b.text),
    symptoms: treatment.symptoms
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => s.text),
    vitamins: treatment.vitamins ?? undefined,
    chemicallyTreatedNote: treatment.chemicallyTreatedNote ?? undefined,
    generalNote: treatment.generalNote ?? undefined,
    afroBenefitByType:
      Object.keys(afroBenefitByType).length > 0 ? afroBenefitByType : undefined,
  };
}

export type TaxonomyData = {
  hairTypes: { value: string; label: string }[];
  afroSubTypes: { value: AfroSubType; label: string; description: string }[];
  symptoms: { value: string; label: string }[];
};

export function toTaxonomyData(
  hairTypes: HairType[],
  afroSubTypes: AfroSubTypeRow[],
  symptoms: FormSymptom[],
): TaxonomyData {
  return {
    hairTypes: hairTypes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((h) => ({ value: h.id, label: h.label })),
    afroSubTypes: afroSubTypes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((a) => ({
        value: a.id as AfroSubType,
        label: a.label,
        description: a.description,
      })),
    symptoms: symptoms
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ value: s.value, label: s.label })),
  };
}
