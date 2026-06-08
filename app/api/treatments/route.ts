import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { findAllTreatments } from "@/services/repositories/treatmentRepository";

export async function GET() {
  try {
    const treatments = await findAllTreatments();
    return NextResponse.json({ treatments });
  } catch (error) {
    console.error("[api/treatments]", error);
    return NextResponse.json(
      { error: "No se pudo cargar el catálogo.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
