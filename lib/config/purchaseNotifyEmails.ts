const DEFAULT_PURCHASE_NOTIFY_EMAILS = "ellasafro89@gmail.com";

/** Correos que reciben alerta de cada compra (separados por coma en PURCHASE_NOTIFY_EMAILS). */
export function getPurchaseNotifyEmails(): string[] {
  const raw =
    process.env.PURCHASE_NOTIFY_EMAILS?.trim() || DEFAULT_PURCHASE_NOTIFY_EMAILS;

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.includes("@"));
}
