import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearSessionCookieOptions } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  cookies().set(clearSessionCookieOptions());
  return NextResponse.json({ ok: true });
}
