"use client";

import { useCallback, useEffect, useState } from "react";
import type { ObservatoryAnalyticsPayload } from "@/lib/observatory/analyticsTypes";
import {
  DIAGNOSIS_GROWTH,
  GEO_DISTRIBUTION,
  INGREDIENT_RANKING,
  MONTHLY_PLATFORM_USAGE,
  OBSERVATORY_KPIS,
  RECOMMENDATION_ACCEPTANCE,
  SYMPTOM_FREQUENCY,
} from "@/data/observatory/analytics";

const FALLBACK: ObservatoryAnalyticsPayload = {
  kpis: OBSERVATORY_KPIS.map((kpi) => ({ ...kpi })),
  diagnosisGrowth: [...DIAGNOSIS_GROWTH],
  geoDistribution: [...GEO_DISTRIBUTION],
  symptomFrequency: [...SYMPTOM_FREQUENCY],
  ingredientRanking: [...INGREDIENT_RANKING],
  monthlyPlatformUsage: [...MONTHLY_PLATFORM_USAGE],
  recommendationAcceptance: [...RECOMMENDATION_ACCEPTANCE],
};

export function useObservatoryAnalytics() {
  const [data, setData] = useState<ObservatoryAnalyticsPayload>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/observatory/analytics", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as ObservatoryAnalyticsPayload;
      setData(json);
    } catch {
      // Mantiene fallback si la API no responde.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
