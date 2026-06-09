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

loadEnv();
const pub = process.env.WOMPI_PUBLIC_KEY.trim();
const secret = process.env.WOMPI_INTEGRITY_SECRET.trim();
const ref = "probe-ref-003";
const amount = 3500000;
const sig = createHash("sha256").update(`${ref}${amount}COP${secret}`).digest("hex");
const base = [
  `public-key=${encodeURIComponent(pub)}`,
  "currency=COP",
  `amount-in-cents=${amount}`,
  `reference=${ref}`,
  `signature:integrity=${sig}`,
];

const redirects = [
  "http://localhost/pago/resultado",
  "http://localhost:3000/pago/resultado",
  "https://localhost:3000/pago/resultado",
  "https://transaction-redirect.wompi.co/check",
  "http://127.0.0.1:3000/pago/resultado",
  "https://example.com/pago/resultado",
];

console.log("=== redirect-url permitidas por Wompi ===\n");
for (const r of redirects) {
  const url = `https://checkout.wompi.co/p/?${[...base, `redirect-url=${encodeURIComponent(r)}`].join("&")}`;
  const res = await fetch(url, { redirect: "manual" });
  console.log(`${res.status === 200 ? "OK" : "FAIL"} (${res.status}) - ${r}`);
}
