import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  addCartItem,
  cartSummary,
  findCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/repositories/cartRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const items = await findCartItems(session.userId);
  const summary = cartSummary(items);
  return NextResponse.json({ items, ...summary });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para añadir al carrito.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { treatmentId?: string };
  if (!body.treatmentId) {
    return NextResponse.json(
      { error: "Producto no indicado.", code: "VALIDATION" },
      { status: 400 },
    );
  }

  try {
    const items = await addCartItem(session.userId, body.treatmentId);
    return NextResponse.json({ items, ...cartSummary(items) });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Producto no encontrado.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    console.error("[api/cart POST]", error);
    return NextResponse.json(
      { error: "No se pudo añadir al carrito.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { treatmentId?: string };
  if (!body.treatmentId) {
    return NextResponse.json(
      { error: "Producto no indicado.", code: "VALIDATION" },
      { status: 400 },
    );
  }

  const items = await removeCartItem(session.userId, body.treatmentId);
  return NextResponse.json({ items, ...cartSummary(items) });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    treatmentId?: string;
    action?: "increment" | "decrement";
  };

  if (!body.treatmentId || !body.action) {
    return NextResponse.json(
      { error: "Solicitud inválida.", code: "VALIDATION" },
      { status: 400 },
    );
  }

  const delta = body.action === "increment" ? 1 : -1;

  try {
    const items = await updateCartItemQuantity(
      session.userId,
      body.treatmentId,
      delta,
    );
    return NextResponse.json({ items, ...cartSummary(items) });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Producto no encontrado en el carrito.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    console.error("[api/cart PATCH]", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la cantidad.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
