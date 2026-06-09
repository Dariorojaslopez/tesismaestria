import type { WompiTransactionPayload } from "@/services/integrations/wompiEvents";

function wompiApiBaseUrl(): string {
  const publicKey = process.env.WOMPI_PUBLIC_KEY?.trim() ?? "";
  return publicKey.includes("_test_")
    ? "https://sandbox.wompi.co/v1"
    : "https://production.wompi.co/v1";
}

export async function fetchWompiTransaction(
  transactionId: string,
): Promise<WompiTransactionPayload | null> {
  const privateKey = process.env.WOMPI_PRIVATE_KEY?.trim();
  if (!privateKey) {
    return null;
  }

  const response = await fetch(
    `${wompiApiBaseUrl()}/transactions/${encodeURIComponent(transactionId)}`,
    {
      headers: {
        Authorization: `Bearer ${privateKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error("Wompi transaction fetch failed", response.status);
    return null;
  }

  const json = (await response.json()) as {
    data?: WompiTransactionPayload;
  };

  return json.data ?? null;
}
