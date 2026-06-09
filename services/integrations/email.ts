import nodemailer from "nodemailer";

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
