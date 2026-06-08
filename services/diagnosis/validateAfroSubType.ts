import type { AfroSubType } from "@/data/treatments";

const ALLOWED = new Set<AfroSubType>(["4A", "4B", "4C"]);

/**
 * Acepta solo 4A / 4B / 4C o ausencia; ignora otros valores.
 */
export function parseAfroSubType(raw: unknown): AfroSubType | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  if (typeof raw !== "string") return undefined;
  const t = raw.trim().toUpperCase();
  if (t === "4A" || t === "4B" || t === "4C") {
    return t as AfroSubType;
  }
  return undefined;
}

export function isAfroSubType(s: string): s is AfroSubType {
  return ALLOWED.has(s as AfroSubType);
}
