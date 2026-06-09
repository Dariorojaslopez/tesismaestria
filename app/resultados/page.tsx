import type { Metadata } from "next";
import { ObservatoryPage } from "@/components/observatory";

export const metadata: Metadata = {
  title: "Resultados Capilares Afro | Ellas",
  description:
    "Resultados e inteligencia capilar afro: KPIs, datos de la comunidad, IA y recomendaciones personalizadas.",
};

export default function ResultadosPage() {
  return <ObservatoryPage />;
}
