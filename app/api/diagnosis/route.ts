import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import {
  DiagnosisValidationError,
  processDiagnosis,
} from "@/services/diagnosisService";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "La solicitud no tiene un formato válido.", code: "INVALID_BODY" },
      { status: 400 },
    );
  }

  const symptoms =
    body !== null && typeof body === "object" && "symptoms" in body
      ? (body as { symptoms: unknown }).symptoms
      : undefined;

  const hairType =
    body !== null && typeof body === "object" && "hairType" in body
      ? (body as { hairType: unknown }).hairType
      : undefined;

  const hairTypeLabel =
    body !== null && typeof body === "object" && "hairTypeLabel" in body
      ? (body as { hairTypeLabel: unknown }).hairTypeLabel
      : undefined;

  const afroSubType =
    body !== null && typeof body === "object" && "afroSubType" in body
      ? (body as { afroSubType: unknown }).afroSubType
      : undefined;

  try {
    const result = await processDiagnosis({
      symptoms: symptoms as string[],
      hairType: typeof hairType === "string" ? hairType : undefined,
      hairTypeLabel:
        typeof hairTypeLabel === "string" ? hairTypeLabel : undefined,
      afroSubType:
        typeof afroSubType === "string" || afroSubType === null
          ? afroSubType
          : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DiagnosisValidationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
    }
    console.error("[api/diagnosis]", error);
    return NextResponse.json(
      { error: "No se pudo completar el diagnóstico.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
