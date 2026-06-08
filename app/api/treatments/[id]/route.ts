import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { findTreatmentById } from "@/services/repositories/treatmentRepository";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const treatment = await findTreatmentById(params.id);
    if (!treatment) {
      return NextResponse.json(
        { error: "Tratamiento no encontrado.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    return NextResponse.json({ treatment });
  } catch (error) {
    console.error("[api/treatments/[id]]", error);
    return NextResponse.json(
      { error: "No se pudo cargar el tratamiento.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
