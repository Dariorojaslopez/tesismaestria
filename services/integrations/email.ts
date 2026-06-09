import nodemailer from "nodemailer";
import { formatCopFromCents } from "@/lib/money";
import { getPurchaseNotifyEmails } from "@/lib/config/purchaseNotifyEmails";

export class EmailConfigError extends Error {
  constructor() {
    super("El envío de correo no está configurado en el servidor.");
    this.name = "EmailConfigError";
  }
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new EmailConfigError();
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export type PurchaseNotificationInput = {
  reference: string;
  wompiTxId?: string | null;
  totalInCents: number;
  currency: string;
  createdAt: Date;
  customer: {
    id: string;
    names: string;
    email: string;
    address: string;
    department: string;
    city: string;
  };
  items: Array<{
    treatmentName: string;
    quantity: number;
    unitPriceCents: number;
  }>;
};

function formatPurchaseDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function sendPurchaseNotificationEmail(
  input: PurchaseNotificationInput,
): Promise<void> {
  const recipients = getPurchaseNotifyEmails();
  if (recipients.length === 0) {
    console.warn("PURCHASE_NOTIFY_EMAILS vacío; no se envía alerta de compra.");
    return;
  }

  const transport = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@ellas.local";
  const totalFormatted = formatCopFromCents(input.totalInCents);

  const itemLines = input.items.map((item) => {
    const lineTotal = formatCopFromCents(item.unitPriceCents * item.quantity);
    const unitPrice = formatCopFromCents(item.unitPriceCents);
    return `• ${item.treatmentName} × ${item.quantity} (${unitPrice} c/u) = ${lineTotal}`;
  });

  const text = [
    "Nueva compra en Ellas",
    "",
    `Referencia: ${input.reference}`,
    input.wompiTxId ? `Transacción Wompi: ${input.wompiTxId}` : "",
    `Fecha: ${formatPurchaseDate(input.createdAt)}`,
    `Total: ${totalFormatted}`,
    "",
    "Datos del comprador",
    `Nombre: ${input.customer.names}`,
    `Correo: ${input.customer.email}`,
    `Dirección: ${input.customer.address}`,
    `Ciudad: ${input.customer.city}`,
    `Departamento: ${input.customer.department}`,
    `ID de usuario: ${input.customer.id}`,
    "",
    "Productos",
    ...itemLines,
  ]
    .filter(Boolean)
    .join("\n");

  const itemsHtml = input.items
    .map((item) => {
      const lineTotal = formatCopFromCents(item.unitPriceCents * item.quantity);
      const unitPrice = formatCopFromCents(item.unitPriceCents);
      return `<li><strong>${item.treatmentName}</strong> × ${item.quantity} (${unitPrice} c/u) — ${lineTotal}</li>`;
    })
    .join("");

  const html = `
    <h2>Nueva compra en Ellas</h2>
    <p><strong>Referencia:</strong> ${input.reference}</p>
    ${input.wompiTxId ? `<p><strong>Transacción Wompi:</strong> ${input.wompiTxId}</p>` : ""}
    <p><strong>Fecha:</strong> ${formatPurchaseDate(input.createdAt)}</p>
    <p><strong>Total:</strong> ${totalFormatted}</p>
    <h3>Datos del comprador</h3>
    <ul>
      <li><strong>Nombre:</strong> ${input.customer.names}</li>
      <li><strong>Correo:</strong> ${input.customer.email}</li>
      <li><strong>Dirección:</strong> ${input.customer.address}</li>
      <li><strong>Ciudad:</strong> ${input.customer.city}</li>
      <li><strong>Departamento:</strong> ${input.customer.department}</li>
      <li><strong>ID de usuario:</strong> ${input.customer.id}</li>
    </ul>
    <h3>Productos</h3>
    <ul>${itemsHtml}</ul>
  `;

  await transport.sendMail({
    from,
    to: recipients.join(", "),
    subject: `Nueva compra · ${input.customer.names} · ${totalFormatted}`,
    text,
    html,
  });
}

export async function sendTemporaryPasswordEmail(
  to: string,
  names: string,
  temporaryPassword: string,
): Promise<void> {
  const transport = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@ellas.local";

  await transport.sendMail({
    from,
    to,
    subject: "Tu nueva contraseña · Ellas",
    text: [
      `Hola ${names},`,
      "",
      "Recibimos una solicitud para recuperar tu contraseña en Ellas.",
      "",
      `Tu nueva contraseña temporal es: ${temporaryPassword}`,
      "",
      "Te recomendamos iniciar sesión y cambiarla cuando tengamos esa opción disponible.",
      "",
      "Si no solicitaste este cambio, ignora este mensaje.",
    ].join("\n"),
    html: `
      <p>Hola <strong>${names}</strong>,</p>
      <p>Recibimos una solicitud para recuperar tu contraseña en <strong>Ellas</strong>.</p>
      <p>Tu nueva contraseña temporal es:</p>
      <p style="font-size:18px;font-weight:bold;letter-spacing:1px;">${temporaryPassword}</p>
      <p>Inicia sesión con esta contraseña. Si no solicitaste este cambio, ignora este correo.</p>
    `,
  });
}
