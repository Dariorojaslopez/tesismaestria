/**
 * Imágenes en `public/brand/{n}.png` alineadas al catálogo de tratamientos (por `id`).
 * Números 11–15 corresponden a BOTANIHAIR BLEND (un solo producto en datos: `botanihair-blend`).
 */
export const TREATMENT_BRAND_IMAGE_NUM: Readonly<Record<string, number>> = {
  "coco-glow": 1,
  avosilk: 2,
  banaglow: 3,
  "onion-boost": 4,
  chontahair: 5,
  yukaress: 6,
  guavamask: 7,
  "gunaba-luxe": 8,
  papayasmooth: 9,
  "botanihair-blend": 11,
  "vigor-coffe": 16,
  "chocohair-glow": 17,
  beetrootradiance: 18,
  "caro-tress-elixir": 19,
  rosvitalhair: 20,
  "aloe-fresh-hair": 21,
  "mango-glow-hair": 22,
  afroglow: 23,
  "herbal-roots": 24,
  "tropical-repair": 25,
};

export function brandImageSrcForTreatmentId(id: string): string | null {
  const n = TREATMENT_BRAND_IMAGE_NUM[id];
  if (typeof n !== "number") return null;
  return `/brand/${n}.png`;
}
