import { NextResponse } from "next/server";
import type { ObservatoryWizardData } from "@/lib/observatory/types";
import { createObservatorySurvey } from "@/services/observatory/observatoryService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ObservatoryWizardData;
    if (!body.name?.trim() || !body.city?.trim() || !body.hairType || body.symptoms.length === 0) {
      return NextResponse.json(
        { error: "Datos incompletos.", code: "VALIDATION" },
        { status: 400 },
      );
    }

    const payload = await createObservatorySurvey(body);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[api/observatory/survey]", error);
    return NextResponse.json(
      { error: "No se pudo guardar la participación.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
