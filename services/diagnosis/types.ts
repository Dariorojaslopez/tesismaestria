import type { TreatmentRecord } from "@/data/treatments";
import type { CareHabits } from "@/lib/diagnosis/careHabits";

export type DiagnosisInput = {
  symptoms: string[];
  /** p. ej. straight | wavy | curly | coily */
  hairType?: string;
  /** Etiqueta ya traducida para el texto explicativo */
  hairTypeLabel?: string;
  /** Valor crudo del cliente; se normaliza en `processDiagnosis`. */
  afroSubType?: string | null;
  habits?: CareHabits;
};

export type DiagnosisResult = {
  sessionId: string;
  treatments: TreatmentRecord[];
  explanation: string;
};
