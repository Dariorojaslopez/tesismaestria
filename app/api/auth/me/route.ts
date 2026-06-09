import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findUserById } from "@/services/auth/authService";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
