export const CHART_COLORS = {
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  goldDim: "#8a7030",
  grid: "rgba(0,0,0,0.06)",
  axis: "#86868b",
  tooltipBg: "#1d1d1f",
};

/** Paleta premium con buen contraste sobre fondo claro */
export const CHART_PALETTE = [
  "#d4af37",
  "#38bdf8",
  "#34d399",
  "#a78bfa",
  "#fb7185",
  "#f97316",
  "#94a3b8",
  "#facc15",
  "#2dd4bf",
  "#c084fc",
] as const;

const CITY_COLOR: Record<string, string> = {
  Cartagena: "#d4af37",
  Bogotá: "#38bdf8",
  Medellín: "#a78bfa",
  Cali: "#34d399",
  Barranquilla: "#fb7185",
  Bucaramanga: "#f97316",
  Otras: "#94a3b8",
};

export function chartColorAt(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}

export function chartColorForCity(city: string): string {
  return CITY_COLOR[city] ?? chartColorAt(city.length + city.charCodeAt(0));
}

export const chartTooltipStyle = {
  backgroundColor: CHART_COLORS.tooltipBg,
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "12px",
};

export const chartLegendStyle = {
  fontSize: 12,
  color: "#1d1d1f",
};
