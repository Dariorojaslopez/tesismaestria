import { createHash } from "crypto";

export type WompiTransactionPayload = {
  id: string;
  status: string;
  reference: string;
  amount_in_cents?: number;
};

export type WompiEventPayload = {
  event: string;
  data: {
    transaction: WompiTransactionPayload;
  };
  environment?: string;
  signature?: {
    properties: string[];
    checksum: string;
  };
  timestamp: number;
  sent_at?: string;
};

function readNestedValue(
  source: Record<string, unknown>,
  path: string,
): string {
  const parts = path.split(".");
  let current: unknown = source;

  for (const part of parts) {
    if (current == null || typeof current !== "object") {
      return "";
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (current == null) {
    return "";
  }

  return String(current);
}

export function verifyWompiEventChecksum(body: WompiEventPayload): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET?.trim();
  const skipVerify = process.env.WOMPI_WEBHOOK_SKIP_VERIFY === "true";

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("WOMPI_EVENTS_SECRET no configurado en producción.");
      return false;
    }
    if (skipVerify) {
      return true;
    }
    console.warn(
      "Webhook Wompi sin WOMPI_EVENTS_SECRET; define WOMPI_WEBHOOK_SKIP_VERIFY=true solo en desarrollo.",
    );
    return false;
  }

  const signature = body.signature;
  if (!signature?.properties?.length || !signature.checksum) {
    return false;
  }

  let concatenated = "";
  for (const property of signature.properties) {
    concatenated += readNestedValue(
      body.data as unknown as Record<string, unknown>,
      property,
    );
  }
  concatenated += String(body.timestamp);
  concatenated += secret;

  const expected = createHash("sha256").update(concatenated).digest("hex");
  return expected === signature.checksum;
}
