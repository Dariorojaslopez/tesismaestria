export type GeoDistributionRow = {
  city: string;
  usuarias: number;
};

/** Mantiene las ciudades principales y agrupa el resto en «Otras». */
export function foldGeoDistribution(
  items: GeoDistributionRow[],
  topN = 5,
): GeoDistributionRow[] {
  const sorted = [...items].sort((a, b) => b.usuarias - a.usuarias);
  const withoutOtras = sorted.filter((row) => row.city !== "Otras");
  const top = withoutOtras.slice(0, topN);
  const rest = withoutOtras.slice(topN);
  const otrasCount =
    rest.reduce((sum, row) => sum + row.usuarias, 0) +
    (sorted.find((row) => row.city === "Otras")?.usuarias ?? 0);

  if (otrasCount > 0) {
    top.push({ city: "Otras", usuarias: otrasCount });
  }

  return top;
}
