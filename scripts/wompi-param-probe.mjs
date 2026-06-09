import { readFileSync } from "fs";
import { createHash } from "crypto";

function loadEnv() {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[trimmed.slice(0, eq)] = value;
  }
}

function sign(ref, amount, currency, secret) {
  return createHash("sha256").update(`${ref}${amount}${currency}${secret}`).digest("hex");
}

async function probe(label, parts) {
  const url = `https://checkout.wompi.co/p/?${parts.join("&")}`;
  const res = await fetch(url, { redirect: "manual" });
  console.log(`${res.status === 200 ? "OK" : "FAIL"} (${res.status}) - ${label}`);
}

loadEnv();
const pub = process.env.WOMPI_PUBLIC_KEY.trim();
const secret = process.env.WOMPI_INTEGRITY_SECRET.trim();
const ref = "probe-ref-001";
const amount = 3500000;
const sig = sign(ref, amount, "COP", secret);
const base = [
  `public-key=${encodeURIComponent(pub)}`,
  "currency=COP",
  `amount-in-cents=${amount}`,
  `reference=${ref}`,
  `signature:integrity=${sig}`,
];

console.log("=== Qué parámetro opcional causa 403 ===\n");
await probe("solo obligatorios", base);
await probe("+ redirect-url simple", [...base, `redirect-url=${encodeURIComponent("http://localhost:3000/pago/resultado")}`]);
await probe("+ redirect-url con ?ref=", [...base, `redirect-url=${encodeURIComponent("http://localhost:3000/pago/resultado?ref=probe-ref-001")}`]);
await probe("+ customer-data:email", [...base, "customer-data:email=test%40example.com"]);
await probe("+ ambos (redirect simple + email)", [
  ...base,
  `redirect-url=${encodeURIComponent("http://localhost:3000/pago/resultado")}`,
  "customer-data:email=test%40example.com",
]);
await probe("+ ambos (redirect con ?ref= + email)", [
  ...base,
  `redirect-url=${encodeURIComponent("http://localhost:3000/pago/resultado?ref=probe-ref-001")}`,
  "customer-data:email=test%40example.com",
]);
