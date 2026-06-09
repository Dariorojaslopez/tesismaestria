import { PrismaClient } from "@prisma/client";
import { AFRO_TYPE_OPTIONS } from "../data/afroHairTypes";
import { TREATMENTS } from "../data/treatments";
import { TREATMENT_BRAND_IMAGE_NUM } from "../lib/brandProductImage";
import { seedObservatory } from "./seedObservatory";

const prisma = new PrismaClient();

const HAIR_TYPES = [
  { id: "straight", label: "Liso", sortOrder: 0 },
  { id: "wavy", label: "Ondulado", sortOrder: 1 },
  { id: "curly", label: "Rizado", sortOrder: 2 },
  { id: "coily", label: "Crespo / afro", sortOrder: 3 },
] as const;

const FORM_SYMPTOMS = [
  { value: "Caída o debilitamiento", label: "Caída o debilitamiento", sortOrder: 0 },
  { value: "Sequedad", label: "Sequedad", sortOrder: 1 },
  { value: "Rotura o puntas abiertas", label: "Rotura o puntas abiertas", sortOrder: 2 },
  { value: "Crecimiento lento", label: "Crece muy lento", sortOrder: 3 },
  { value: "Encrespamiento", label: "Encrespamiento o pelo muy esponjoso", sortOrder: 4 },
  { value: "Caspa o picor leve", label: "Caspa o picor leve", sortOrder: 5 },
  { value: "Falta de brillo", label: "Falta de brillo", sortOrder: 6 },
  {
    value: "Pelo rebelde o con electricidad estática",
    label: "Pelo rebelde o electricidad estática",
    sortOrder: 7,
  },
] as const;

async function seedTaxonomies() {
  for (const hairType of HAIR_TYPES) {
    await prisma.hairType.upsert({
      where: { id: hairType.id },
      update: { label: hairType.label, sortOrder: hairType.sortOrder },
      create: hairType,
    });
  }

  for (const [index, afro] of AFRO_TYPE_OPTIONS.entries()) {
    await prisma.afroSubType.upsert({
      where: { id: afro.value },
      update: {
        label: afro.label,
        description: afro.description,
        sortOrder: index,
      },
      create: {
        id: afro.value,
        label: afro.label,
        description: afro.description,
        sortOrder: index,
      },
    });
  }

  for (const symptom of FORM_SYMPTOMS) {
    await prisma.formSymptom.upsert({
      where: { value: symptom.value },
      update: { label: symptom.label, sortOrder: symptom.sortOrder },
      create: symptom,
    });
  }
}

async function seedTreatments() {
  for (const [index, treatment] of TREATMENTS.entries()) {
    const imageNum = TREATMENT_BRAND_IMAGE_NUM[treatment.id] ?? null;

    await prisma.treatment.upsert({
      where: { id: treatment.id },
      update: {
        name: treatment.name,
        vitamins: treatment.vitamins ?? null,
        chemicallyTreatedNote: treatment.chemicallyTreatedNote ?? null,
        generalNote: treatment.generalNote ?? null,
        imageNum,
        priceInCents: 3_500_000,
        sortOrder: index,
      },
      create: {
        id: treatment.id,
        name: treatment.name,
        vitamins: treatment.vitamins ?? null,
        chemicallyTreatedNote: treatment.chemicallyTreatedNote ?? null,
        generalNote: treatment.generalNote ?? null,
        imageNum,
        priceInCents: 3_500_000,
        sortOrder: index,
      },
    });

    await prisma.treatmentIngredient.deleteMany({ where: { treatmentId: treatment.id } });
    await prisma.treatmentBenefit.deleteMany({ where: { treatmentId: treatment.id } });
    await prisma.treatmentSymptom.deleteMany({ where: { treatmentId: treatment.id } });
    await prisma.afroBenefit.deleteMany({ where: { treatmentId: treatment.id } });

    if (treatment.ingredients.length > 0) {
      await prisma.treatmentIngredient.createMany({
        data: treatment.ingredients.map((text, sortOrder) => ({
          treatmentId: treatment.id,
          text,
          sortOrder,
        })),
      });
    }

    if (treatment.benefits.length > 0) {
      await prisma.treatmentBenefit.createMany({
        data: treatment.benefits.map((text, sortOrder) => ({
          treatmentId: treatment.id,
          text,
          sortOrder,
        })),
      });
    }

    if (treatment.symptoms.length > 0) {
      await prisma.treatmentSymptom.createMany({
        data: treatment.symptoms.map((text, sortOrder) => ({
          treatmentId: treatment.id,
          text,
          sortOrder,
        })),
      });
    }

    if (treatment.afroBenefitByType) {
      const afroRows = Object.entries(treatment.afroBenefitByType)
        .filter(([, description]) => description?.trim())
        .map(([subType, description]) => ({
          treatmentId: treatment.id,
          subType,
          description: description!.trim(),
        }));

      if (afroRows.length > 0) {
        await prisma.afroBenefit.createMany({ data: afroRows });
      }
    }
  }
}

async function main() {
  await seedTaxonomies();
  await seedTreatments();
  await seedObservatory(prisma);
  console.log(`Seed completado: ${TREATMENTS.length} tratamientos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
