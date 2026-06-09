import { createHash } from "crypto";

const CHECKOUT_BASE_URL = "https://checkout.wompi.co/p/";

export class WompiConfigError extends Error {
  constructor() {
    super("Wompi no está configurado. Revisa WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_SECRET.");
    this.name = "WompiConfigError";
  }
}

function getPublicKey(): string {
  const key = process.env.WOMPI_PUBLIC_KEY?.trim();
  if (!key) throw new WompiConfigError();
  return key;
}

function getIntegritySecret(): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET?.trim();
  if (!secret) throw new WompiConfigError();
  return secret;
}

export function buildIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
): string {
  const raw = `${reference}${amountInCents}${currency}${getIntegritySecret()}`;
  return createHash("sha256").update(raw).digest("hex");
}

export type WompiCheckoutInput = {
  reference: string;
  amountInCents: number;
  currency?: string;
  customerEmail: string;
  /** Wompi rechaza localhost/127.0.0.1 en redirect-url (403 de CloudFront). */
  redirectUrl?: string;
};

/** Wompi bloquea redirect-url hacia localhost; en desarrollo se omite ese parámetro. */
export function isWompiAllowedRedirectUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    const host = hostname.toLowerCase();
    return host !== "localhost" && host !== "127.0.0.1" && !host.endsWith(".local");
  } catch {
    return false;
  }
}

function wompiParam(name: string, value: string): string {
  // Wompi exige ":" literal en nombres como signature:integrity; URLSearchParams los codifica a %3A.
  return `${name}=${encodeURIComponent(value)}`;
}

export function buildWompiCheckoutUrl(input: WompiCheckoutInput): string {
  const currency = input.currency ?? "COP";
  const signature = buildIntegritySignature(
    input.reference,
    input.amountInCents,
    currency,
  );

  const queryParts = [
    wompiParam("public-key", getPublicKey()),
    wompiParam("currency", currency),
    wompiParam("amount-in-cents", String(input.amountInCents)),
    wompiParam("reference", input.reference),
    wompiParam("signature:integrity", signature),
    wompiParam("customer-data:email", input.customerEmail),
  ];

  if (input.redirectUrl && isWompiAllowedRedirectUrl(input.redirectUrl)) {
    queryParts.push(wompiParam("redirect-url", input.redirectUrl));
  }

  const query = queryParts.join("&");

  return `${CHECKOUT_BASE_URL}?${query}`;
}
