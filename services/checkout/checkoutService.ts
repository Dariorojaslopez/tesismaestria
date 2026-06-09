import { prisma } from "@/lib/prisma";
import {
  buildWompiCheckoutUrl,
  WompiConfigError,
} from "@/services/integrations/wompi";
import { findUserById } from "@/services/auth/authService";

export class CheckoutError extends Error {
  constructor(
    message: string,
    public code: "EMPTY_CART" | "NOT_CONFIGURED" | "USER_NOT_FOUND",
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "http://localhost:3000"
  );
}

export async function createWompiCheckout(userId: string): Promise<{
  checkoutUrl: string;
  orderId: string;
  reference: string;
  totalInCents: number;
}> {
  const user = await findUserById(userId);
  if (!user) {
    throw new CheckoutError("Usuario no encontrado.", "USER_NOT_FOUND");
  }

  const cartRows = await prisma.cartItem.findMany({
    where: { userId },
    include: { treatment: { select: { id: true, name: true, priceInCents: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (cartRows.length === 0) {
    throw new CheckoutError("Tu carrito está vacío.", "EMPTY_CART");
  }

  const orderItems = cartRows.map((row) => ({
    treatmentId: row.treatment.id,
    treatmentName: row.treatment.name,
    quantity: row.quantity,
    unitPriceCents: row.treatment.priceInCents,
  }));

  const totalInCents = orderItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );

  const reference = `ellas-${Date.now()}-${userId.slice(0, 8)}`;

  const order = await prisma.order.create({
    data: {
      userId,
      reference,
      totalInCents,
      currency: "COP",
      status: "PENDING",
      items: {
        create: orderItems,
      },
    },
  });

  try {
    const checkoutUrl = buildWompiCheckoutUrl({
      reference,
      amountInCents: totalInCents,
      customerEmail: user.email,
      redirectUrl: `${appBaseUrl()}/pago/resultado?ref=${encodeURIComponent(reference)}`,
    });

    return {
      checkoutUrl,
      orderId: order.id,
      reference,
      totalInCents,
    };
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "ERROR" },
    });
    if (error instanceof WompiConfigError) {
      throw new CheckoutError(error.message, "NOT_CONFIGURED");
    }
    throw error;
  }
}

export async function getOrderByReference(reference: string) {
  return prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
}
