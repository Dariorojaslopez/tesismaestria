/**
 * Capa de servicios: integración con sistemas externos y orquestación en red.
 * Lógica de dominio pura: `lib/application/`. Datos locales: `data/catalog/`.
 */

export { healthCheck } from "./core/health";
export {
  processDiagnosis,
  DiagnosisValidationError,
  type DiagnosisInput,
  type DiagnosisResult,
} from "./diagnosisService";