export type HairTreatment = {
  name: string;
  ingredients: string[];
  benefits: string[];
  /** Síntomas o problemas capilares que el tratamiento ayuda a aliviar */
  symptomsItSolves: string[];
  /** Pasos sugeridos de aplicación (mascarilla / enjuague, etc.) */
  howToApply?: readonly string[];
};

export const HAIR_TREATMENTS: readonly HairTreatment[] = [
  {
    name: "Chontaduro",
    ingredients: [
      "Pulpa de chontaduro (pejibaye)",
      "Aceite o extracto de chontaduro (cuando aplica)",
    ],
    benefits: [
      "Crecimiento",
      "Reparación",
      "Hidratación",
      "Prevención de la caída del cabello",
    ],
    symptomsItSolves: [
      "Crecimiento lento o estancado",
      "Cabello dañado o quebradizo",
      "Sequedad",
      "Caída o debilitamiento capilar",
    ],
    howToApply: [
      "Licúa o tritura la pulpa hasta obtener una pasta homogénea.",
      "Aplica de raíces a puntas sobre cabello húmedo y cuero cabelludo limpio.",
      "Deja actuar 20–30 minutos con gorro o toalla.",
      "Enjuaga bien con agua tibia y lava con tu champú habitual si lo deseas.",
    ],
  },
  {
    name: "Plátano y miel",
    ingredients: ["Plátano maduro", "Miel natural"],
    benefits: [
      "Hidratación",
      "Brillo",
      "Control del encrespamiento",
      "Fortalecimiento",
    ],
    symptomsItSolves: [
      "Cabello seco",
      "Falta de brillo o aspecto opaco",
      "Encrespamiento",
      "Cabello débil",
    ],
    howToApply: [
      "Machaca el plátano y mezcla con una cucharada de miel hasta integrar.",
      "Extiende sobre el largo del cabello húmedo; evita enredar mechones frágiles.",
      "Deja 15–25 minutos y enjuaga con abundante agua.",
    ],
  },
  {
    name: "Cebolla",
    ingredients: ["Jugo o extracto de cebolla morada o blanca"],
    benefits: [
      "Estimula el crecimiento",
      "Mejora la circulación del cuero cabelludo",
      "Ayuda a prevenir la caída del cabello",
    ],
    symptomsItSolves: [
      "Crecimiento reducido",
      "Cuero cabelludo con baja microcirculación (sensación pesada o poco vitalidad)",
      "Caída o adelgazamiento del cabello",
    ],
    howToApply: [
      "Exprime el jugo de media cebolla (o licuar y colar).",
      "Aplica solo en cuero cabelludo con un hisopo o brocha; masajea suavemente.",
      "Deja 10–15 minutos; enjuaga muy bien. Si hay irritación, suspende su uso.",
    ],
  },
  {
    name: "Guayaba",
    ingredients: ["Hojas de guayaba", "Pulpa de guayaba (opcional)"],
    benefits: [
      "Aporta vitaminas al cabello y cuero cabelludo",
      "Efecto anti-caída",
      "Brillo",
    ],
    symptomsItSolves: [
      "Caída del cabello",
      "Cabello sin brillo",
      "Cabello que se ve sin vitalidad o nutrido",
    ],
  },
  {
    name: "Coco",
    ingredients: ["Aceite de coco virgen", "Leche de coco (según preparación)"],
    benefits: ["Hidratación", "Reparación del cabello seco"],
    symptomsItSolves: [
      "Sequedad",
      "Cabello reseco, áspero o poroso",
    ],
  },
] as const;
