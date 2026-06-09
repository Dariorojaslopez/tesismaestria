export type ObservatoryKpi = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  trend: string;
};

export type ObservatoryAnalyticsPayload = {
  kpis: ObservatoryKpi[];
  diagnosisGrowth: { month: string; diagnosticos: number; ia: number }[];
  geoDistribution: { city: string; usuarias: number }[];
  symptomFrequency: { symptom: string; casos: number }[];
  ingredientRanking: { ingredient: string; recomendaciones: number }[];
  monthlyPlatformUsage: {
    month: string;
    sesiones: number;
    diagnosticos: number;
    compras: number;
  }[];
  recommendationAcceptance: {
    month: string;
    aceptacion: number;
    conversion: number;
  }[];
};
