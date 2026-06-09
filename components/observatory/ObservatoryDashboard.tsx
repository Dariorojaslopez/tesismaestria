"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ObservatoryAnalyticsPayload } from "@/lib/observatory/analyticsTypes";
import { ChartPanel } from "./ChartPanel";
import {
  CHART_COLORS,
  CHART_PALETTE,
  chartColorAt,
  chartColorForCity,
  chartLegendStyle,
  chartTooltipStyle,
} from "./chartTheme";

const axisTick = { fill: CHART_COLORS.axis, fontSize: 11 };

type ObservatoryDashboardProps = {
  analytics: ObservatoryAnalyticsPayload;
  loading?: boolean;
};

export function ObservatoryDashboard({
  analytics,
  loading = false,
}: ObservatoryDashboardProps) {
  const {
    diagnosisGrowth,
    geoDistribution,
    symptomFrequency,
    ingredientRanking,
    monthlyPlatformUsage,
    recommendationAcceptance,
  } = analytics;
  return (
    <section className="bg-apple-gray px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
              Panel de resultados
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
              Inteligencia en tiempo real
            </h2>
          </div>
          <p className="text-sm text-apple-label">
            Datos agregados · Comunidad Ellas · Actualización continua
          </p>
        </div>

        <div
          className={`grid gap-5 transition-opacity lg:grid-cols-2 ${loading ? "opacity-60" : "opacity-100"}`}
        >
          <ChartPanel
            title="Crecimiento de diagnósticos"
            subtitle="Diagnósticos digitales e interacciones IA por mes"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={diagnosisGrowth}>
                <defs>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={chartLegendStyle} />
                <Area
                  type="monotone"
                  dataKey="diagnosticos"
                  name="Diagnósticos"
                  stroke={CHART_PALETTE[0]}
                  fill="url(#goldArea)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="ia"
                  name="Interacciones IA"
                  stroke={CHART_PALETTE[1]}
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Distribución geográfica"
            subtitle="Usuarias activas por ciudad"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={geoDistribution}
                  dataKey="usuarias"
                  nameKey="city"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {geoDistribution.map((row) => (
                    <Cell
                      key={row.city}
                      fill={chartColorForCity(row.city)}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={chartLegendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Problemas capilares frecuentes"
            subtitle="Top síntomas reportados en diagnósticos"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomFrequency} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
                <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="symptom"
                  width={108}
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="casos" name="Casos" radius={[0, 6, 6, 0]}>
                  {symptomFrequency.map((row, index) => (
                    <Cell key={row.symptom} fill={chartColorAt(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Ingredientes más recomendados"
            subtitle="Frecuencia en motor de recomendaciones IA"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingredientRanking}>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="ingredient" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="recomendaciones" name="Recomendaciones" radius={[6, 6, 0, 0]}>
                  {ingredientRanking.map((row, index) => (
                    <Cell key={row.ingredient} fill={chartColorAt(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Evolución mensual de la plataforma"
            subtitle="Sesiones, diagnósticos y compras"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPlatformUsage}>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={chartLegendStyle} />
                <Line type="monotone" dataKey="sesiones" stroke={CHART_PALETTE[1]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diagnosticos" stroke={CHART_PALETTE[0]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="compras" stroke={CHART_PALETTE[4]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Aceptación de recomendaciones"
            subtitle="Tasa de aceptación y conversión a compra"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recommendationAcceptance}>
                <defs>
                  <linearGradient id="acceptArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_PALETTE[2]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART_PALETTE[2]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={chartLegendStyle} />
                <Area
                  type="monotone"
                  dataKey="aceptacion"
                  name="Aceptación %"
                  stroke={CHART_PALETTE[2]}
                  fill="url(#acceptArea)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  name="Conversión %"
                  stroke={CHART_PALETTE[5]}
                  strokeWidth={2}
                  dot={{ fill: CHART_PALETTE[5], r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </div>
    </section>
  );
}
