import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { healthCheck } from "@/services/core/health";

export async function GET() {
  const status = await healthCheck();
  return NextResponse.json(status, { status: status.ok ? 200 : 503 });
}
