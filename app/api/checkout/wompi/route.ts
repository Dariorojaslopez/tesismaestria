import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  CheckoutError,
  createWompiCheckout,
} from "@/services/checkout/checkoutService";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const checkout = await createWompiCheckout(session.userId);
    return NextResponse.json(checkout);
  } catch (error) {
    if (error instanceof CheckoutError) {
      const status =
        error.code === "NOT_CONFIGURED"
          ? 503
          : error.code === "EMPTY_CART"
            ? 400
            : 404;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status },
      );
    }
    console.error("[api/checkout/wompi]", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago.", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
