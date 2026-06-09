import { NextResponse } from "next/server";
import { getObservatoryAnalytics } from "@/services/observatory/observatoryService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const analytics = await getObservatoryAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("[api/observatory/analytics]", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las métricas.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
