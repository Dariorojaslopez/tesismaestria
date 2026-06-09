import type { AfroSubType } from "@/data/treatments";
import type { ScoredTreatment } from "@/lib/recommendation";

export type ObservatoryWizardData = {
  name: string;
  ageRange: string;
  city: string;
  email: string;
  hairType: string;
  afroSubType: AfroSubType | "";
  symptoms: string[];
  washFrequency: string;
  usesHeat: boolean;
  usesChemicals: boolean;
  careRoutine: string;
  naturalProductsInterest: string;
  wantsRecommendations: boolean;
  wantsNewsletter: boolean;
  purchaseIntent: string;
};

export const EMPTY_WIZARD_DATA: ObservatoryWizardData = {
  name: "",
  ageRange: "",
  city: "",
  email: "",
  hairType: "",
  afroSubType: "",
  symptoms: [],
  washFrequency: "",
  usesHeat: false,
  usesChemicals: false,
  careRoutine: "",
  naturalProductsInterest: "",
  wantsRecommendations: true,
  wantsNewsletter: false,
  purchaseIntent: "",
};

export type ObservatoryResult = {
  profileLabel: string;
  diagnosisSummary: string;
  compatibilityPercent: number;
  scoredTreatments: ScoredTreatment[];
  topIngredients: string[];
  habitInsights: string[];
};
