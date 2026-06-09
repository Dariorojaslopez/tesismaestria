import {
  verifyWompiEventChecksum,
  type WompiEventPayload,
} from "@/services/integrations/wompiEvents";
import { fulfillApprovedOrder } from "@/services/checkout/orderFulfillment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: WompiEventPayload;

  try {
    body = (await request.json()) as WompiEventPayload;
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  if (!verifyWompiEventChecksum(body)) {
    return new Response("Firma inválida", { status: 401 });
  }

  if (body.event !== "transaction.updated") {
    return Response.json({ ok: true, ignored: true });
  }

  const transaction = body.data?.transaction;
  if (!transaction?.reference) {
    return new Response("Transacción incompleta", { status: 400 });
  }

  if (transaction.status !== "APPROVED") {
    return Response.json({ ok: true, status: transaction.status });
  }

  await fulfillApprovedOrder({
    reference: transaction.reference,
    wompiTxId: transaction.id,
  });

  return Response.json({ ok: true });
}
