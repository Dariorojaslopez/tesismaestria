export function formatCopFromCents(amountInCents: number): string {
  const pesos = amountInCents / 100;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(pesos);
}
