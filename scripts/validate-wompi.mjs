import { readFileSync } from "fs";
import { createHash } from "crypto";

const envText = readFileSync(".env", "utf8");
for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq);
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const pub = process.env.WOMPI_PUBLIC_KEY?.trim() ?? "";
const secret = process.env.WOMPI_INTEGRITY_SECRET?.trim() ?? "";
const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "";

function mask(value, keepStart = 12, keepEnd = 4) {
  if (value.length <= keepStart + keepEnd) return "***";
  return `${value.slice(0, keepStart)}...${value.slice(-keepEnd)}`;
}

const checks = [
  ["WOMPI_PUBLIC_KEY definida", !!pub],
  ["Prefijo pub_test_ (sandbox)", pub.startsWith("pub_test_")],
  ["WOMPI_INTEGRITY_SECRET definida", !!secret],
  ["Prefijo test_integrity_ (sandbox)", secret.startsWith("test_integrity_")],
  ["Mismo entorno (sandbox)", pub.startsWith("pub_test_") && secret.startsWith("test_integrity_")],
  ["NEXT_PUBLIC_APP_URL definida", !!appUrl],
  ["URL local http", appUrl.startsWith("http://localhost")],
];

console.log("=== Validación Wompi (.env) ===\n");
for (const [label, ok] of checks) {
  console.log(`${ok ? "OK" : "FAIL"} - ${label}`);
}

console.log("\nValores (enmascarados):");
console.log(`  WOMPI_PUBLIC_KEY: ${mask(pub)}`);
console.log(`  WOMPI_INTEGRITY_SECRET: ${mask(secret)}`);
console.log(`  NEXT_PUBLIC_APP_URL: ${appUrl}`);

const ref = "ellas-validacion-test";
const amount = 10500000;
const currency = "COP";
const raw = `${ref}${amount}${currency}${secret}`;
const sig = createHash("sha256").update(raw).digest("hex");
const redirect = `${appUrl}/pago/resultado?ref=${encodeURIComponent(ref)}`;
const isLocalRedirect = (() => {
  try {
    const host = new URL(redirect).hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return true;
  }
})();

const queryParts = [
  `public-key=${encodeURIComponent(pub)}`,
  `currency=${currency}`,
  `amount-in-cents=${amount}`,
  `reference=${encodeURIComponent(ref)}`,
  `signature:integrity=${sig}`,
  `customer-data:email=${encodeURIComponent("test@example.com")}`,
];
if (!isLocalRedirect) {
  queryParts.push(`redirect-url=${encodeURIComponent(redirect)}`);
}
const checkoutUrl = `https://checkout.wompi.co/p/?${queryParts.join("&")}`;

console.log("\nURL de checkout:");
console.log(`  signature:integrity literal: ${checkoutUrl.includes("signature:integrity=")}`);
console.log(`  sin signature%3Aintegrity: ${!checkoutUrl.includes("signature%3Aintegrity=")}`);
console.log(`  redirect-url omitida (localhost): ${isLocalRedirect}`);
console.log(`  Firma ejemplo: ${sig.slice(0, 16)}...`);

console.log("\nConsultando API sandbox de Wompi...");
const merchantRes = await fetch(`https://sandbox.wompi.co/v1/merchants/${pub}`);
const merchantJson = await merchantRes.json().catch(() => ({}));
if (merchantRes.ok && merchantJson?.data?.id) {
  console.log(`OK - Llave pública válida. Comercio: ${merchantJson.data.name ?? merchantJson.data.id}`);
} else {
  console.log(`FAIL - Llave pública no reconocida por Wompi (${merchantRes.status})`);
  if (merchantJson?.error) {
    console.log(`  Error: ${merchantJson.error.type ?? ""} ${merchantJson.error.reason ?? ""}`);
  }
}

console.log("\nProbando checkout URL...");
const checkoutRes = await fetch(checkoutUrl, { redirect: "manual" });
console.log(`HTTP ${checkoutRes.status}`);
if (checkoutRes.status === 403) {
  console.log("FAIL - Wompi rechazó la petición (403). Revisa que el SECRETO DE INTEGRIDAD sea el correcto en el dashboard.");
} else if (checkoutRes.status >= 200 && checkoutRes.status < 400) {
  console.log("OK - Checkout accesible.");
} else {
  console.log(`Estado inesperado: ${checkoutRes.status}`);
}
