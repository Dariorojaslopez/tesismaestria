import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearSessionCookieOptions,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { AuthError, loginUser, registerUser } from "@/services/auth/authService";

export const dynamic = "force-dynamic";

async function startSession(user: {
  id: string;
  email: string;
  names: string;
}) {
  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    names: user.names,
  });
  cookies().set(sessionCookieOptions(token));
  return user;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "La solicitud no tiene un formato válido.", code: "INVALID_BODY" },
      { status: 400 },
    );
  }

  const credentials = {
    email: String(body.email ?? ""),
    password: String(body.password ?? ""),
  };

  try {
    const user = await registerUser({
      ...credentials,
      names: String(body.names ?? ""),
      address: String(body.address ?? ""),
      department: String(body.department ?? ""),
      city: String(body.city ?? ""),
    });

    await startSession(user);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.code === "CONFLICT") {
        try {
          const user = await loginUser(credentials);
          await startSession(user);
          return NextResponse.json({ user });
        } catch {
          return NextResponse.json(
            {
              error:
                "Este correo ya está registrado. Inicia sesión con tu contraseña o usa «¿Olvidaste tu contraseña?».",
              code: "CONFLICT",
            },
            { status: 409 },
          );
        }
      }

      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
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
