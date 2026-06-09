/**
 * Imágenes en `public/brand/{n}.png` alineadas al catálogo de tratamientos (por `id`).
 * Números 10–14 corresponden a variantes de BOTANIHAIR BLEND (`botanihair-blend`).
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
  "botanihair-blend": 10,
  "vigor-coffe": 15,
  "chocohair-glow": 16,
  beetrootradiance: 17,
  "caro-tress-elixir": 18,
  rosvitalhair: 19,
  "aloe-fresh-hair": 20,
  "mango-glow-hair": 21,
  afroglow: 22,
  "herbal-roots": 23,
  "tropical-repair": 24,
};

export function brandImageSrcForTreatmentId(id: string): string | null {
  const n = TREATMENT_BRAND_IMAGE_NUM[id];
  if (typeof n !== "number") return null;
  return `/brand/${n}.png`;
}
