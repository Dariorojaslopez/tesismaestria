import { toTreatmentRecord } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";

export type CartItemView = {
  id: string;
  treatmentId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

const cartInclude = {
  treatment: {
    include: {
      ingredients: true,
      benefits: true,
      symptoms: true,
      afroBenefits: true,
    },
  },
} as const;

export async function findCartItems(userId: string): Promise<CartItemView[]> {
  const rows = await prisma.cartItem.findMany({
    where: { userId },
    include: cartInclude,
    orderBy: { createdAt: "asc" },
  });

  return rows.map((row) => {
    const record = toTreatmentRecord(row.treatment);
    const unitPriceCents = row.treatment.priceInCents;
    return {
      id: row.id,
      treatmentId: row.treatmentId,
      name: record.name,
      quantity: row.quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * row.quantity,
    };
  });
}

export async function addCartItem(
  userId: string,
  treatmentId: string,
): Promise<CartItemView[]> {
  const treatment = await prisma.treatment.findUnique({
    where: { id: treatmentId },
    select: { id: true },
  });
  if (!treatment) {
    throw new Error("NOT_FOUND");
  }

  await prisma.cartItem.upsert({
    where: {
      userId_treatmentId: { userId, treatmentId },
    },
    update: {
      quantity: { increment: 1 },
    },
    create: {
      userId,
      treatmentId,
      quantity: 1,
    },
  });

  return findCartItems(userId);
}

export async function updateCartItemQuantity(
  userId: string,
  treatmentId: string,
  delta: number,
): Promise<CartItemView[]> {
  const row = await prisma.cartItem.findUnique({
    where: { userId_treatmentId: { userId, treatmentId } },
  });
  if (!row) {
    throw new Error("NOT_FOUND");
  }

  const nextQuantity = row.quantity + delta;
  if (nextQuantity < 1) {
    return findCartItems(userId);
  }

  await prisma.cartItem.update({
    where: { userId_treatmentId: { userId, treatmentId } },
    data: { quantity: nextQuantity },
  });

  return findCartItems(userId);
}

export async function removeCartItem(
  userId: string,
  treatmentId: string,
): Promise<CartItemView[]> {
  await prisma.cartItem.deleteMany({
    where: { userId, treatmentId },
  });
  return findCartItems(userId);
}

export function cartSummary(items: CartItemView[]) {
  const count = items.reduce((n, item) => n + item.quantity, 0);
  const totalInCents = items.reduce((n, item) => n + item.lineTotalCents, 0);
  return { count, totalInCents };
}
