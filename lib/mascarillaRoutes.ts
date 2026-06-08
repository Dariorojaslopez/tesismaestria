import type { AfroSubType } from "@/data/treatments";

export const MASCARILLA_BASE = "/mascarillas";

export function mascarillaPath(id: string, afro?: AfroSubType): string {
  const base = `${MASCARILLA_BASE}/${encodeURIComponent(id)}`;
  if (!afro) return base;
  return `${base}?afro=${afro}`;
}
