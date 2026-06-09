import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { AuthError, changePassword } from "@/services/auth/authService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    await changePassword(
      session.userId,
      String(body.currentPassword ?? ""),
      String(body.newPassword ?? ""),
    );

    return NextResponse.json({
      ok: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const status =
        error.code === "INVALID_CREDENTIALS" ? 401 : 400;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status },
      );
    }
    console.error("[api/auth/change-password]", error);
    return NextResponse.json(
      { error: "No se pudo cambiar la contraseña.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
