import { NextResponse } from "next/server";
import { AuthError, requestPasswordReset } from "@/services/auth/authService";

export const dynamic = "force-dynamic";

const SUCCESS_MESSAGE =
  "Si el correo está registrado, recibirás una contraseña temporal en unos minutos.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    await requestPasswordReset(String(body.email ?? ""));
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.code === "EMAIL" ? 503 : 400 },
      );
    }
    console.error("[api/auth/forgot-password]", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
