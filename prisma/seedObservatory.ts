import { PrismaClient } from "@prisma/client";

const SYMPTOMS = [
  "Sequedad",
  "Encrespamiento",
  "Rotura o puntas abiertas",
  "Caída o debilitamiento",
  "Falta de brillo",
  "Crecimiento lento",
  "Caspa o picor leve",
];

const OTHER_CITIES = [
  { city: "Bogotá", weight: 12 },
  { city: "Medellín", weight: 8 },
  { city: "Barranquilla", weight: 7 },
  { city: "Cali", weight: 6 },
  { city: "Bucaramanga", weight: 4 },
  { city: "Santa Marta", weight: 3 },
];

const TOP_TREATMENTS = [
  { id: "chontahair", name: "CHONTAHAIR", weight: 42 },
  { id: "onion-boost", name: "ONION BOOST", weight: 36 },
  { id: "coco-glow", name: "COCO GLOW", weight: 6 },
  { id: "avosilk", name: "AVOSILK", weight: 5 },
  { id: "papayasmooth", name: "PAPAYASMOOTH", weight: 4 },
  { id: "botanihair-blend", name: "BOTANIHAIR BLEND", weight: 4 },
  { id: "tropical-repair", name: "TROPICAL REPAIR", weight: 3 },
];

const FIRST_NAMES = [
  "María",
  "Laura",
  "Daniela",
  "Camila",
  "Valentina",
  "Andrea",
  "Yolanda",
  "Esther",
  "Natalia",
  "Sofía",
];

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function pickCity(): string {
  if (Math.random() < 0.62) return "Cartagena";
  return pickWeighted(OTHER_CITIES).city;
}

function randomDateWithinMonths(monthsBack: number): Date {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - monthsBack);
  const span = now.getTime() - past.getTime();
  return new Date(past.getTime() + Math.random() * span);
}

export async function seedObservatory(prisma: PrismaClient, total = 1480) {
  const existing = await prisma.observatorySurvey.count();
  if (existing > 0) {
    console.log(
      `Observatorio: ya hay ${existing} registros; se conservan (no se reemplazan).`,
    );
    return;
  }

  const batchSize = 50;
  let created = 0;

  while (created < total) {
    const batch = Math.min(batchSize, total - created);
    const operations = Array.from({ length: batch }, (_, index) => {
      const city = pickCity();
      const createdAt = randomDateWithinMonths(11);
      const symptomCount = 1 + Math.floor(Math.random() * 3);
      const chosenSymptoms = [...SYMPTOMS]
        .sort(() => Math.random() - 0.5)
        .slice(0, symptomCount);
      const top = pickWeighted(TOP_TREATMENTS);
      const secondary = TOP_TREATMENTS.filter((t) => t.id !== top.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const recommendations = [
        { ...top, score: 18 + Math.floor(Math.random() * 6), rank: 1 },
        ...secondary.map((item, i) => ({
          ...item,
          score: 10 - i * 2,
          rank: i + 2,
        })),
      ];

      const name = `${FIRST_NAMES[(created + index) % FIRST_NAMES.length]} ${city === "Cartagena" ? "de la Rosa" : "Gómez"}`;

      return prisma.observatorySurvey.create({
        data: {
          name,
          ageRange: ["18-24", "25-34", "35-44", "45+"][Math.floor(Math.random() * 4)],
          city,
          email: Math.random() > 0.35 ? `usuaria${created + index}@example.com` : null,
          hairType: Math.random() > 0.55 ? "coily" : "curly",
          afroSubType: Math.random() > 0.4 ? "4B" : "4C",
          washFrequency: "2-3 veces por semana",
          usesHeat: Math.random() > 0.6,
          usesChemicals: Math.random() > 0.7,
          careRoutine: "Intermedia (mascarillas ocasionales)",
          naturalProductsInterest: "Alto — prefiero ingredientes botánicos",
          wantsRecommendations: true,
          wantsNewsletter: Math.random() > 0.75,
          purchaseIntent: "Evaluando opciones este mes",
          compatibilityPercent: 78 + Math.floor(Math.random() * 18),
          acceptedRecommendation: Math.random() > 0.18,
          createdAt,
          symptoms: {
            create: chosenSymptoms.map((text) => ({ text })),
          },
          recommendations: {
            create: recommendations.map((row) => ({
              treatmentId: row.id,
              treatmentName: row.name,
              score: row.score,
              rank: row.rank,
            })),
          },
        },
      });
    });

    await prisma.$transaction(operations);
    created += batch;
  }

  console.log(`Observatorio: ${total} participaciones sembradas (mayoría Cartagena).`);
}
