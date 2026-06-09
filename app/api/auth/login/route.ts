import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { AuthError, loginUser } from "@/services/auth/authService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const user = await loginUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      names: user.names,
    });
    cookies().set(sessionCookieOptions(token));

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      const status = error.code === "INVALID_CREDENTIALS" ? 401 : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    console.error("[api/auth/login]", error);
    return NextResponse.json(
      { error: "No se pudo iniciar sesión.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
