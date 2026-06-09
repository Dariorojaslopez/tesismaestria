"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { AfroSubType } from "@/data/treatments";
import { computeObservatoryResult } from "@/lib/observatory/computeResults";
import {
  EMPTY_WIZARD_DATA,
  type ObservatoryResult,
  type ObservatoryWizardData,
} from "@/lib/observatory/types";
import { ObservatoryResults } from "./ObservatoryResults";

const STEPS = [
  "Información general",
  "Tipo de cabello",
  "Síntomas",
  "Hábitos de cuidado",
  "Interés en recomendaciones",
] as const;

const HAIR_TYPES = [
  { value: "straight", label: "Liso" },
  { value: "wavy", label: "Ondulado" },
  { value: "curly", label: "Rizado" },
  { value: "coily", label: "Crespo / afro" },
] as const;

const AFRO_TYPES: { value: AfroSubType; label: string }[] = [
  { value: "4A", label: "4A — Rizos en S" },
  { value: "4B", label: "4B — Rizos en Z" },
  { value: "4C", label: "4C — Rizo apretado" },
];

const SYMPTOM_OPTIONS = [
  "Caída o debilitamiento",
  "Sequedad",
  "Rotura o puntas abiertas",
  "Crecimiento lento",
  "Encrespamiento",
  "Caspa o picor leve",
  "Falta de brillo",
  "Pelo rebelde o con electricidad estática",
];

const inputClass =
  "w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-apple-label outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/25";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-apple-label";

const optionSelectedClass =
  "border-gold-500/50 bg-gold-500/10 text-gold-800";

const optionIdleClass =
  "border-black/[0.08] bg-white text-[#1d1d1f] hover:border-gold-500/30";

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i <= current ? "w-8 bg-gold-500" : "w-3 bg-black/10"
          }`}
        />
      ))}
    </div>
  );
}

type ObservatoryWizardProps = {
  onSurveyComplete?: () => void;
};

export function ObservatoryWizard({ onSurveyComplete }: ObservatoryWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ObservatoryWizardData>(EMPTY_WIZARD_DATA);
  const [result, setResult] = useState<ObservatoryResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canNext = useMemo(() => {
    if (step === 0) return data.name.trim().length >= 2 && data.city.trim().length >= 2;
    if (step === 1) {
      if (!data.hairType) return false;
      if (data.hairType === "coily") return !!data.afroSubType;
      return true;
    }
    if (step === 2) return data.symptoms.length > 0;
    if (step === 3) return !!data.washFrequency && !!data.careRoutine;
    if (step === 4) return !!data.purchaseIntent;
    return true;
  }, [step, data]);

  function patch(partial: Partial<ObservatoryWizardData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function toggleSymptom(symptom: string) {
    setData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  }

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/observatory/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await res.json()) as {
        result?: ObservatoryResult;
        error?: string;
      };

      if (res.ok && payload.result) {
        setResult(payload.result);
        onSurveyComplete?.();
        return;
      }

      setResult(computeObservatoryResult(data));
      setSubmitError(
        payload.error ??
          "No se pudo guardar en la base de datos; mostramos tu resultado local.",
      );
    } catch {
      setResult(computeObservatoryResult(data));
      setSubmitError("Error de conexión; mostramos tu resultado local.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleReset() {
    setData(EMPTY_WIZARD_DATA);
    setStep(0);
    setResult(null);
  }

  if (result) {
    return (
      <ObservatoryResults
        result={result}
        userName={data.name}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
            Participa y aporta tus resultados
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-[#1d1d1f]">
            {STEPS[step]}
          </h3>
          <p className="mt-1 text-sm text-apple-label">
            Paso {step + 1} de {STEPS.length}
          </p>
        </div>
        <StepDots current={step} total={STEPS.length} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {step === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nombre</label>
                <input
                  className={inputClass}
                  value={data.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className={labelClass}>Rango de edad</label>
                <select
                  className={inputClass}
                  value={data.ageRange}
                  onChange={(e) => patch({ ageRange: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="18-24">18 – 24</option>
                  <option value="25-34">25 – 34</option>
                  <option value="35-44">35 – 44</option>
                  <option value="45+">45+</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Ciudad</label>
                <input
                  className={inputClass}
                  value={data.city}
                  onChange={(e) => patch({ city: e.target.value })}
                  placeholder="Ej. Cartagena"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Correo (opcional)</label>
                <input
                  type="email"
                  className={inputClass}
                  value={data.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  placeholder="tu@correo.com"
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {HAIR_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      patch({
                        hairType: opt.value,
                        afroSubType: opt.value === "coily" ? data.afroSubType : "",
                      })
                    }
                    className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition ${
                      data.hairType === opt.value
                        ? optionSelectedClass
                        : optionIdleClass
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {data.hairType === "coily" ? (
                <div>
                  <p className={labelClass}>Subtipo afro</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {AFRO_TYPES.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => patch({ afroSubType: opt.value })}
                        className={`rounded-xl border px-3 py-3 text-left text-xs font-medium transition ${
                          data.afroSubType === opt.value
                            ? optionSelectedClass
                            : optionIdleClass
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {SYMPTOM_OPTIONS.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    data.symptoms.includes(symptom)
                      ? optionSelectedClass
                      : optionIdleClass
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Frecuencia de lavado</label>
                <select
                  className={inputClass}
                  value={data.washFrequency}
                  onChange={(e) => patch({ washFrequency: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Diario">Diario</option>
                  <option value="2-3 veces por semana">2–3 veces por semana</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quincenal">Quincenal</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Rutina actual</label>
                <select
                  className={inputClass}
                  value={data.careRoutine}
                  onChange={(e) => patch({ careRoutine: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Mínima (shampoo + acondicionador)">
                    Mínima (shampoo + acondicionador)
                  </option>
                  <option value="Intermedia (mascarillas ocasionales)">
                    Intermedia (mascarillas ocasionales)
                  </option>
                  <option value="Avanzada (LOC + protección térmica)">
                    Avanzada (LOC + protección térmica)
                  </option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.08] bg-apple-gray/60 px-4 py-3 text-sm text-[#1d1d1f]">
                <input
                  type="checkbox"
                  checked={data.usesHeat}
                  onChange={(e) => patch({ usesHeat: e.target.checked })}
                  className="accent-gold-500"
                />
                Uso plancha o secador con frecuencia
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.08] bg-apple-gray/60 px-4 py-3 text-sm text-[#1d1d1f]">
                <input
                  type="checkbox"
                  checked={data.usesChemicals}
                  onChange={(e) => patch({ usesChemicals: e.target.checked })}
                  className="accent-gold-500"
                />
                Procesos químicos (tinte, alisado, etc.)
              </label>
              <div className="sm:col-span-2">
                <label className={labelClass}>Interés en productos naturales</label>
                <select
                  className={inputClass}
                  value={data.naturalProductsInterest}
                  onChange={(e) => patch({ naturalProductsInterest: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Alto — prefiero ingredientes botánicos">
                    Alto — prefiero ingredientes botánicos
                  </option>
                  <option value="Medio — combino natural y convencional">
                    Medio — combino natural y convencional
                  </option>
                  <option value="Explorando opciones naturales">
                    Explorando opciones naturales
                  </option>
                </select>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Intención de compra</label>
                <select
                  className={inputClass}
                  value={data.purchaseIntent}
                  onChange={(e) => patch({ purchaseIntent: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Lista para comprar en las próximas 2 semanas">
                    Lista para comprar en las próximas 2 semanas
                  </option>
                  <option value="Evaluando opciones este mes">
                    Evaluando opciones este mes
                  </option>
                  <option value="Solo busco orientación por ahora">
                    Solo busco orientación por ahora
                  </option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.08] bg-apple-gray/60 px-4 py-3 text-sm text-[#1d1d1f]">
                <input
                  type="checkbox"
                  checked={data.wantsRecommendations}
                  onChange={(e) => patch({ wantsRecommendations: e.target.checked })}
                  className="accent-gold-500"
                />
                Deseo recibir recomendaciones personalizadas con IA
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.08] bg-apple-gray/60 px-4 py-3 text-sm text-[#1d1d1f]">
                <input
                  type="checkbox"
                  checked={data.wantsNewsletter}
                  onChange={(e) => patch({ wantsNewsletter: e.target.checked })}
                  className="accent-gold-500"
                />
                Recibir insights de resultados por correo
              </label>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl border border-black/[0.12] px-5 py-3 text-sm font-medium text-[#1d1d1f] transition hover:border-gold-500/40"
          >
            Atrás
          </button>
        ) : null}
        <button
          type="button"
          disabled={!canNext || submitting}
          onClick={() => void handleNext()}
          className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting
            ? "Guardando y analizando…"
            : step === STEPS.length - 1
              ? "Generar diagnóstico IA"
              : "Continuar"}
        </button>
      </div>
      {submitError ? (
        <p className="mt-3 text-xs text-amber-700">{submitError}</p>
      ) : null}
    </div>
  );
}
