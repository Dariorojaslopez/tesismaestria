import { prisma } from "@/lib/prisma";
import { sendPurchaseNotificationEmail } from "@/services/integrations/email";
import { fetchWompiTransaction } from "@/services/integrations/wompiApi";

export async function fulfillApprovedOrder(params: {
  reference: string;
  wompiTxId?: string;
}): Promise<{ fulfilled: boolean; alreadyFulfilled: boolean }> {
  const order = await prisma.order.findUnique({
    where: { reference: params.reference },
    include: {
      items: { orderBy: { treatmentName: "asc" } },
      user: true,
    },
  });

  if (!order) {
    return { fulfilled: false, alreadyFulfilled: false };
  }

  if (order.purchaseNotifiedAt) {
    return { fulfilled: true, alreadyFulfilled: true };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "APPROVED",
        wompiTxId: params.wompiTxId ?? order.wompiTxId,
      },
    });
    await tx.cartItem.deleteMany({ where: { userId: order.userId } });
  });

  try {
    await sendPurchaseNotificationEmail({
      reference: order.reference,
      wompiTxId: params.wompiTxId ?? order.wompiTxId,
      totalInCents: order.totalInCents,
      currency: order.currency,
      createdAt: order.createdAt,
      customer: {
        id: order.user.id,
        names: order.user.names,
        email: order.user.email,
        address: order.user.address,
        department: order.user.department,
        city: order.user.city,
      },
      items: order.items.map((item) => ({
        treatmentName: item.treatmentName,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      })),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { purchaseNotifiedAt: new Date() },
    });
  } catch (error) {
    console.error("No se pudo enviar la notificación de compra:", error);
  }

  return { fulfilled: true, alreadyFulfilled: false };
}

/** Respaldo al volver de Wompi si el webhook aún no llegó (requiere WOMPI_PRIVATE_KEY). */
export async function syncOrderPaymentIfNeeded(
  reference: string,
  wompiTransactionId?: string,
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { reference },
    select: { purchaseNotifiedAt: true, status: true },
  });

  if (!order || order.purchaseNotifiedAt) {
    return;
  }

  if (order.status === "APPROVED") {
    await fulfillApprovedOrder({
      reference,
      wompiTxId: wompiTransactionId,
    });
    return;
  }

  if (!wompiTransactionId) {
    return;
  }

  const transaction = await fetchWompiTransaction(wompiTransactionId);
  if (!transaction) {
    return;
  }

  if (transaction.status !== "APPROVED" || transaction.reference !== reference) {
    return;
  }

  await fulfillApprovedOrder({
    reference,
    wompiTxId: transaction.id,
  });
}
