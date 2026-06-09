import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearSessionCookieOptions,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { AuthError, registerUser } from "@/services/auth/authService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const user = await registerUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      names: String(body.names ?? ""),
      address: String(body.address ?? ""),
      department: String(body.department ?? ""),
      city: String(body.city ?? ""),
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
      const status = error.code === "CONFLICT" ? 409 : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    if (
      error instanceof Error &&
      error.message.includes("AUTH_SECRET")
    ) {
      console.error("[api/auth/register] AUTH_SECRET no configurado");
      return NextResponse.json(
        {
          error: "El servidor no está configurado para sesiones. Contacta soporte.",
          code: "CONFIG",
        },
        { status: 503 },
      );
    }
    console.error("[api/auth/register]", error);
    cookies().set(clearSessionCookieOptions());
    return NextResponse.json(
      { error: "No se pudo completar el registro.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
