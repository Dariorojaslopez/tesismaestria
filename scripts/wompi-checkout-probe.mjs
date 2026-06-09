import { readFileSync } from "fs";
import { createHash } from "crypto";

function loadEnv() {
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
}

function sign(ref, amount, currency, secret) {
  return createHash("sha256")
    .update(`${ref}${amount}${currency}${secret}`)
    .digest("hex");
}

async function probe(label, url) {
  const res = await fetch(url, { redirect: "manual" });
  console.log(`${label}: HTTP ${res.status}`);
}

loadEnv();
const pub = process.env.WOMPI_PUBLIC_KEY.trim();
const secret = process.env.WOMPI_INTEGRITY_SECRET.trim();

// Ejemplo oficial de la documentación (debe funcionar si Wompi está bien)
const docRef = "sk8-438k4-xmxm392-sn2m";
const docAmount = 2490000;
const docSecret = "prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6";
const docPub = "pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH";
const docSig = sign(docRef, docAmount, "COP", docSecret);
const docUrl = `https://checkout.wompi.co/p/?public-key=${encodeURIComponent(docPub)}&currency=COP&amount-in-cents=${docAmount}&reference=${encodeURIComponent(docRef)}&signature:integrity=${docSig}`;

console.log("=== Pruebas checkout Wompi ===\n");
await probe("1) Ejemplo documentación Wompi", docUrl);

const ref = "testref001";
const amount = 3500000;
const sig = sign(ref, amount, "COP", secret);
const minimal = `https://checkout.wompi.co/p/?public-key=${encodeURIComponent(pub)}&currency=COP&amount-in-cents=${amount}&reference=${ref}&signature:integrity=${sig}`;
await probe("2) Tu comercio — solo parámetros obligatorios", minimal);

const sig2 = sign("ellas-1730973338778-cmq5xkr3", 10500000, "COP", secret);
const realLike = `https://checkout.wompi.co/p/?public-key=${encodeURIComponent(pub)}&currency=COP&amount-in-cents=10500000&reference=ellas-1730973338778-cmq5xkr3&signature:integrity=${sig2}&redirect-url=${encodeURIComponent("http://localhost:3000/pago/resultado?ref=ellas-1730973338778-cmq5xkr3")}&customer-data:email=test%40example.com`;
await probe("3) Tu comercio — URL completa como en la app", realLike);

console.log("\nFirma doc esperada: 37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5");
console.log("Firma doc calculada: ", docSig);
