export type WashRhythm = "often" | "weekly" | "rare";
export type ConcernZone = "scalp" | "lengths" | "both";

export type CareHabits = {
  washRhythm?: WashRhythm;
  usesHeat?: boolean;
  usesChemicals?: boolean;
  concernZone?: ConcernZone;
};

export const WASH_OPTIONS: readonly { value: WashRhythm; label: string }[] = [
  { value: "often", label: "Varias veces por semana" },
  { value: "weekly", label: "Una vez por semana" },
  { value: "rare", label: "Cada dos semanas o menos" },
];

export const ZONE_OPTIONS: readonly { value: ConcernZone; label: string }[] = [
  { value: "lengths", label: "En las puntas y el largo" },
  { value: "scalp", label: "En el cuero cabelludo" },
  { value: "both", label: "En los dos" },
];

const WASH_RHYTHMS = new Set<WashRhythm>(["often", "weekly", "rare"]);
const ZONES = new Set<ConcernZone>(["scalp", "lengths", "both"]);

export function parseCareHabits(raw: unknown): CareHabits | undefined {
  if (raw === null || typeof raw !== "object") return undefined;
  const body = raw as Record<string, unknown>;
  const habits: CareHabits = {};

  if (typeof body.washRhythm === "string" && WASH_RHYTHMS.has(body.washRhythm as WashRhythm)) {
    habits.washRhythm = body.washRhythm as WashRhythm;
  }
  if (typeof body.usesHeat === "boolean") habits.usesHeat = body.usesHeat;
  if (typeof body.usesChemicals === "boolean") habits.usesChemicals = body.usesChemicals;
  if (typeof body.concernZone === "string" && ZONES.has(body.concernZone as ConcernZone)) {
    habits.concernZone = body.concernZone as ConcernZone;
  }

  return Object.keys(habits).length > 0 ? habits : undefined;
}

export function describeHabits(habits?: CareHabits): string {
  if (!habits) return "";
  const bits: string[] = [];

  if (habits.concernZone === "lengths") bits.push("lo notas en las puntas y el largo");
  else if (habits.concernZone === "scalp") bits.push("lo notas en el cuero cabelludo");
  else if (habits.concernZone === "both") {
    bits.push("lo notas en el cuero cabelludo y en el largo");
  }

  if (habits.washRhythm === "often") bits.push("lavas varias veces por semana");
  else if (habits.washRhythm === "weekly") bits.push("lavas una vez por semana");
  else if (habits.washRhythm === "rare") bits.push("lavas cada dos semanas o menos");

  if (habits.usesHeat === true) bits.push("usas calor con frecuencia");
  else if (habits.usesHeat === false) bits.push("no usas calor con frecuencia");

  if (habits.usesChemicals === true) bits.push("has usado tinte o alisado");
  else if (habits.usesChemicals === false) bits.push("no has usado químicos");

  return bits.join(", ");
}
