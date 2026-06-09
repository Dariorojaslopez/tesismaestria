export const OBSERVATORY_KPIS = [
  {
    id: "diagnostics",
    label: "Diagnósticos digitales",
    value: 15000,
    suffix: "+",
    trend: "+18% vs trimestre anterior",
  },
  {
    id: "users",
    label: "Usuarias registradas",
    value: 8500,
    suffix: "+",
    trend: "+12% crecimiento anual",
  },
  {
    id: "recommendations",
    label: "Recomendaciones generadas",
    value: 45000,
    suffix: "+",
    trend: "Motor IA Ellas v2",
  },
  {
    id: "ai-interactions",
    label: "Interacciones con IA",
    value: 120000,
    suffix: "+",
    trend: "Asistente capilar 24/7",
  },
  {
    id: "satisfaction",
    label: "Satisfacción de usuarias",
    value: 94,
    suffix: "%",
    trend: "Encuesta NPS 2025",
  },
  {
    id: "natural-interest",
    label: "Interés en tratamientos naturales",
    value: 87,
    suffix: "%",
    trend: "Preferencia por ingredientes botánicos",
  },
] as const;

export const DIAGNOSIS_GROWTH = [
  { month: "Ene", diagnosticos: 820, ia: 2100 },
  { month: "Feb", diagnosticos: 940, ia: 2450 },
  { month: "Mar", diagnosticos: 1100, ia: 2890 },
  { month: "Abr", diagnosticos: 1280, ia: 3200 },
  { month: "May", diagnosticos: 1450, ia: 3580 },
  { month: "Jun", diagnosticos: 1620, ia: 3920 },
  { month: "Jul", diagnosticos: 1780, ia: 4210 },
  { month: "Ago", diagnosticos: 1950, ia: 4580 },
  { month: "Sep", diagnosticos: 2140, ia: 4890 },
  { month: "Oct", diagnosticos: 2320, ia: 5120 },
  { month: "Nov", diagnosticos: 2510, ia: 5480 },
  { month: "Dic", diagnosticos: 2680, ia: 5760 },
];

export const GEO_DISTRIBUTION = [
  { city: "Cartagena", usuarias: 5420 },
  { city: "Bogotá", usuarias: 1180 },
  { city: "Barranquilla", usuarias: 920 },
  { city: "Medellín", usuarias: 780 },
  { city: "Cali", usuarias: 540 },
  { city: "Otras", usuarias: 960 },
];

export const SYMPTOM_FREQUENCY = [
  { symptom: "Sequedad", casos: 4200 },
  { symptom: "Encrespamiento", casos: 3850 },
  { symptom: "Rotura / puntas", casos: 3120 },
  { symptom: "Caída", casos: 2780 },
  { symptom: "Falta de brillo", casos: 2540 },
  { symptom: "Crecimiento lento", casos: 1980 },
  { symptom: "Caspa / picor", casos: 1420 },
];

export const INGREDIENT_RANKING = [
  { ingredient: "Chontaduro", recomendaciones: 5820 },
  { ingredient: "Cebolla", recomendaciones: 5140 },
  { ingredient: "Coco", recomendaciones: 3280 },
  { ingredient: "Aguacate", recomendaciones: 2890 },
  { ingredient: "Romero", recomendaciones: 2410 },
  { ingredient: "Papaya", recomendaciones: 1980 },
  { ingredient: "Aloe", recomendaciones: 1620 },
];

export const MONTHLY_PLATFORM_USAGE = [
  { month: "Ene", sesiones: 4200, diagnosticos: 820, compras: 180 },
  { month: "Feb", sesiones: 4580, diagnosticos: 940, compras: 210 },
  { month: "Mar", sesiones: 5120, diagnosticos: 1100, compras: 245 },
  { month: "Abr", sesiones: 5480, diagnosticos: 1280, compras: 280 },
  { month: "May", sesiones: 5890, diagnosticos: 1450, compras: 310 },
  { month: "Jun", sesiones: 6320, diagnosticos: 1620, compras: 340 },
];

export const RECOMMENDATION_ACCEPTANCE = [
  { month: "Ene", aceptacion: 72, conversion: 18 },
  { month: "Feb", aceptacion: 74, conversion: 19 },
  { month: "Mar", aceptacion: 76, conversion: 21 },
  { month: "Abr", aceptacion: 78, conversion: 22 },
  { month: "May", aceptacion: 81, conversion: 24 },
  { month: "Jun", aceptacion: 83, conversion: 26 },
];
