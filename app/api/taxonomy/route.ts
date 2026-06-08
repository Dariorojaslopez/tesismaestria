import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { findTaxonomy } from "@/services/repositories/taxonomyRepository";

export async function GET() {
  try {
    const taxonomy = await findTaxonomy();
    return NextResponse.json(taxonomy);
  } catch (error) {
    console.error("[api/taxonomy]", error);
    return NextResponse.json(
      { error: "No se pudo cargar la taxonomía.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
