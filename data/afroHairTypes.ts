import type { AfroSubType } from "@/data/treatments";

/** Textos de la hoja «tipos de cabello Afro» del catálogo Ellas. */
export const AFRO_TYPE_OPTIONS: readonly {
  value: AfroSubType;
  label: string;
  description: string;
}[] = [
  {
    value: "4A",
    label: "4A",
    description:
      "Rizos definidos en forma de S y textura más fina; suele tender a la sequedad.",
  },
  {
    value: "4B",
    label: "4B",
    description:
      "Rizos en forma de Z, más apretados; la hebra suele ser más frágil.",
  },
  {
    value: "4C",
    label: "4C",
    description:
      "Rizo muy apretado, a veces sin forma definida; suele ser el más seco y frágil.",
  },
] as const;
