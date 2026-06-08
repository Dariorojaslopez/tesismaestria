"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TechAvatarIcon } from "@/components/ui/TechAvatarIcon";
import type { TaxonomyData } from "@/lib/db/mappers";
import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import {
  cancelBotSpeech,
  enqueueBotSpeech,
  primeSpeechVoices,
} from "@/lib/speech/botSpeech";
import { cn } from "@/lib/utils";
import { Results } from "./Results";

const FALLBACK_HAIR_TYPES = [
  { value: "straight", label: "Liso" },
  { value: "wavy", label: "Ondulado" },
  { value: "curly", label: "Rizado" },
  { value: "coily", label: "Crespo / afro" },
] as const;

const FALLBACK_AFRO_TYPES = [
  { value: "4A" as AfroSubType, label: "4A", description: "Rizos definidos en forma de S." },
  { value: "4B" as AfroSubType, label: "4B", description: "Rizos en forma de Z." },
  { value: "4C" as AfroSubType, label: "4C", description: "Rizo muy apretado." },
] as const;

const FALLBACK_SYMPTOM_OPTIONS = [
  { value: "Caída o debilitamiento", label: "Caída o debilitamiento" },
  { value: "Sequedad", label: "Sequedad" },
  { value: "Rotura o puntas abiertas", label: "Rotura o puntas abiertas" },
  { value: "Crecimiento lento", label: "Crece muy lento" },
  {
    value: "Encrespamiento",
    label: "Encrespamiento o pelo muy esponjoso",
  },
  {
    value: "Caspa o picor leve",
    label: "Caspa o picor leve",
  },
  {
    value: "Falta de brillo",
    label: "Falta de brillo",
  },
  {
    value: "Pelo rebelde o con electricidad estática",
    label: "Pelo rebelde o electricidad estática",
  },
] as const;

type Phase = "hair" | "afro" | "symptoms" | "results";

type DiagnosisApiOk = {
  sessionId?: string;
  treatments: TreatmentRecord[];
  explanation: string;
};

type DiagnosisApiErr = {
  error: string;
  code?: string;
};

export type HairDiagnosisLayout = "page" | "drawer";

export type HairDiagnosisFormProps = {
  className?: string;
  /** `drawer`: altura flexible, sin cabecera duplicada (el panel ya tiene título). */
  layout?: HairDiagnosisLayout;
};

function ChatBubble({
  role,
  children,
  speechKey,
}: {
  role: "bot" | "user";
  children: React.ReactNode;
  /** Identificador estable para TTS del asistente (solo rol bot). */
  speechKey?: string;
}) {
  const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };
  const botContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (role !== "bot" || !speechKey) return;
    const el = botContentRef.current;
    if (!el) return;
    const text = el.innerText.replace(/\s+/g, " ").trim();
    if (!text) return;
    enqueueBotSpeech(text, speechKey);
  }, [role, speechKey]);

  if (role === "bot") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="flex gap-2.5 sm:gap-3"
      >
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-white sm:size-10"
          aria-hidden
        >
          <TechAvatarIcon className="size-6 sm:size-7" />
        </div>
        <div
          ref={botContentRef}
          className="min-w-0 max-w-[min(88%,26rem)] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[15px] leading-relaxed text-zinc-800 shadow-sm ring-1 ring-black/[0.05] sm:px-4 sm:py-3"
        >
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="flex justify-end"
    >
      <div className="min-w-0 max-w-[min(88%,26rem)] rounded-2xl rounded-br-md bg-gradient-to-br from-forest-600 to-emerald-700 px-3.5 py-2.5 text-[15px] leading-relaxed text-white shadow-md sm:px-4 sm:py-3">
        {children}
      </div>
    </motion.div>
  );
}

function StepIndicator({ phase }: { phase: Phase }) {
  const step =
    phase === "hair" || phase === "afro"
      ? 1
      : phase === "symptoms"
        ? 2
        : 3;
  const lines = [step > 1, step > 2] as const;

  return (
    <div
      className="rounded-2xl border border-white/60 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4"
      aria-label="Progreso del asistente"
    >
      <ol className="flex items-center gap-0" role="list">
        <li className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8",
              step >= 1
                ? step === 1
                  ? "bg-zinc-900 text-white ring-2 ring-emerald-400/70"
                  : "bg-forest-600 text-white"
                : "bg-zinc-200 text-zinc-600",
            )}
            aria-current={step === 1 ? "step" : undefined}
          >
            {step > 1 ? "✓" : "1"}
          </span>
          <span
            className={cn(
              "hidden truncate text-[10px] font-medium uppercase tracking-wide sm:block",
              step === 1 ? "text-zinc-900" : "text-zinc-500",
            )}
          >
            Tipo
          </span>
        </li>
        <li
          className={cn(
            "mx-0.5 h-0.5 flex-1 max-w-[40px] rounded-full sm:max-w-none",
            lines[0] ? "bg-forest-500" : "bg-zinc-200",
          )}
          aria-hidden
        />
        <li className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8",
              step >= 2
                ? step === 2
                  ? "bg-zinc-900 text-white ring-2 ring-emerald-400/70"
                  : "bg-forest-600 text-white"
                : "bg-zinc-200 text-zinc-500",
            )}
            aria-current={step === 2 ? "step" : undefined}
          >
            {step > 2 ? "✓" : "2"}
          </span>
          <span
            className={cn(
              "hidden truncate text-[10px] font-medium uppercase tracking-wide sm:block",
              step === 2 ? "text-zinc-900" : "text-zinc-500",
            )}
          >
            Síntomas
          </span>
        </li>
        <li
          className={cn(
            "mx-0.5 h-0.5 flex-1 max-w-[40px] rounded-full sm:max-w-none",
            lines[1] ? "bg-forest-500" : "bg-zinc-200",
          )}
          aria-hidden
        />
        <li className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8",
              step === 3
                ? "bg-zinc-900 text-white ring-2 ring-emerald-400/70"
                : "bg-zinc-200 text-zinc-500",
            )}
            aria-current={step === 3 ? "step" : undefined}
          >
            3
          </span>
          <span
            className={cn(
              "hidden truncate text-[10px] font-medium uppercase tracking-wide sm:block",
              step === 3 ? "text-zinc-900" : "text-zinc-500",
            )}
          >
            Resultados
          </span>
        </li>
      </ol>
    </div>
  );
}

export function HairDiagnosisForm({
  className,
  layout = "page",
}: HairDiagnosisFormProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("hair");
  const [hairType, setHairType] = useState("");
  const [afroSubType, setAfroSubType] = useState<AfroSubType | null>(null);
  const [symptoms, setSymptoms] = useState<Set<string>>(() => new Set());
  const [results, setResults] = useState<TreatmentRecord[] | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [symptomHint, setSymptomHint] = useState(false);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const [taxonomy, setTaxonomy] = useState<TaxonomyData | null>(null);

  useEffect(() => {
    primeSpeechVoices();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/taxonomy");
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as TaxonomyData;
        if (!cancelled) setTaxonomy(data);
      } catch {
        // Fallback local si la API no está disponible.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hairTypes = taxonomy?.hairTypes ?? FALLBACK_HAIR_TYPES;
  const afroTypeOptions = taxonomy?.afroSubTypes ?? FALLBACK_AFRO_TYPES;
  const symptomOptions = taxonomy?.symptoms ?? FALLBACK_SYMPTOM_OPTIONS;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [
    phase,
    hairType,
    afroSubType,
    results,
    symptoms.size,
    diagnosisLoading,
    diagnosisError,
  ]);

  const baseHairLabel =
    hairTypes.find((h) => h.value === hairType)?.label ?? hairType;
  const hairTypeLabel =
    hairType === "coily" && afroSubType
      ? `${baseHairLabel} · ${afroSubType}`
      : baseHairLabel;

  const symptomLabelsJoined = Array.from(symptoms)
    .map(
      (v) => symptomOptions.find((o) => o.value === v)?.label ?? v,
    )
    .join(", ");

  const handleHairPick = useCallback((value: string) => {
    setHairType(value);
    setAfroSubType(null);
    setSymptomHint(false);
    setDiagnosisError(null);
    if (value === "coily") {
      setPhase("afro");
    } else {
      setPhase("symptoms");
    }
  }, []);

  const handleAfroPick = useCallback((value: AfroSubType) => {
    setAfroSubType(value);
    setPhase("symptoms");
    setSymptomHint(false);
    setDiagnosisError(null);
  }, []);

  const toggleSymptom = useCallback((value: string) => {
    setSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setSymptomHint(false);
    setDiagnosisError(null);
  }, []);

  const handleShowRecommendations = useCallback(async () => {
    if (symptoms.size === 0) {
      setSymptomHint(true);
      return;
    }
    setSymptomHint(false);
    setDiagnosisError(null);
    setDiagnosisLoading(true);

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: Array.from(symptoms),
          hairType,
          hairTypeLabel,
          afroSubType: hairType === "coily" ? afroSubType : undefined,
        }),
      });

      const data = (await res.json()) as DiagnosisApiOk & DiagnosisApiErr;

      if (!res.ok) {
        setDiagnosisError(
          typeof data.error === "string"
            ? data.error
            : "No se pudieron obtener recomendaciones.",
        );
        return;
      }

      setResults(Array.isArray(data.treatments) ? data.treatments : []);
      setExplanation(
        typeof data.explanation === "string" ? data.explanation : "",
      );
      setPhase("results");
    } catch {
      setDiagnosisError(
        "No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setDiagnosisLoading(false);
    }
  }, [symptoms, hairType, hairTypeLabel, afroSubType]);

  const handleRetry = useCallback(() => {
    cancelBotSpeech();
    setHairType("");
    setAfroSubType(null);
    setSymptoms(new Set());
    setResults(null);
    setExplanation("");
    setPhase("hair");
    setSymptomHint(false);
    setDiagnosisError(null);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const headerHint =
    phase === "hair"
      ? "Paso 1 de 3 · Elige tu tipo de cabello"
      : phase === "afro"
        ? "Paso 1 de 3 · Subtipo 4A / 4B / 4C"
        : phase === "symptoms"
          ? "Paso 2 de 3 · Marca lo que te ocurre"
          : "Paso 3 de 3 · Recomendaciones listas";

  const chipBase =
    "min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 active:scale-[0.99] sm:min-h-0 sm:rounded-full sm:py-2.5";

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex w-full flex-col overflow-hidden",
        layout === "page" &&
          "max-w-xl rounded-3xl border border-zinc-200/90 bg-[var(--chat-drawer-surface)] shadow-card ring-1 ring-black/[0.04]",
        layout === "drawer" &&
          "h-full min-h-0 rounded-2xl border border-zinc-200/50 bg-[var(--chat-bg)]/90",
        className,
      )}
    >
      {layout === "page" ? (
        <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-sm ring-1 ring-emerald-200/50"
            aria-hidden
          >
            <TechAvatarIcon className="size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-900">Asistente capilar</p>
            <p className="text-xs leading-snug text-zinc-500">{headerHint}</p>
          </div>
        </header>
      ) : (
        <p className="sr-only">{headerHint}</p>
      )}

      <div
        className={cn(
          "space-y-4 overflow-y-auto scroll-smooth px-3 py-4 [scrollbar-width:thin] sm:px-5 sm:py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300/90",
          layout === "page" && "max-h-[min(70vh,560px)]",
          layout === "drawer" && "min-h-0 flex-1",
        )}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <StepIndicator phase={phase} />

        <section className="space-y-4" aria-labelledby="chat-step-1-title">
          <h2 id="chat-step-1-title" className="sr-only">
            Paso 1: tipo de cabello
          </h2>

          <ChatBubble role="bot" speechKey="bot-saludo">
            <p className="font-semibold text-zinc-900">¡Hola!</p>
            <p className="mt-1.5 text-zinc-600">
              Vamos en tres pasos: primero tu tipo de cabello, luego lo que te
              preocupa, y al final ideas concretas. Empecemos.
            </p>
          </ChatBubble>

          <ChatBubble role="bot" speechKey="bot-paso1-tipo">
            <p className="font-semibold text-zinc-900">Paso 1 de 3</p>
            <p className="mt-1">¿Cuál es tu tipo de cabello?</p>
          </ChatBubble>

          {!hairType && phase === "hair" ? (
            <div
              className="ml-[2.75rem] rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm ring-1 ring-black/[0.04] sm:ml-[3.25rem] sm:p-4"
              role="group"
              aria-label="Opciones de tipo de cabello"
            >
              <p className="mb-3 text-xs font-medium text-zinc-500">
                Toca una opción para continuar
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {hairTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleHairPick(t.value)}
                    className={cn(
                      chipBase,
                      "border-zinc-200 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50/90",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {hairType ? (
          <section
            className={cn(
              "space-y-4",
              phase !== "hair" && "border-t border-zinc-300/50 pt-4",
            )}
            aria-labelledby="chat-step-2-title"
          >
            <h2 id="chat-step-2-title" className="sr-only">
              Paso 2: síntomas
            </h2>

            <ChatBubble role="user">
              <p>{hairTypeLabel}</p>
            </ChatBubble>

            {phase === "afro" ? (
              <>
                <ChatBubble role="bot" speechKey="bot-paso1-afro">
                  <p className="font-semibold text-zinc-900">Paso 1 de 3</p>
                  <p className="mt-1">
                    En cabello crespo / afro usamos la clasificación 4A, 4B y
                    4C. ¿Cuál se acerca más al tuyo?
                  </p>
                </ChatBubble>
                <div
                  className="ml-[2.75rem] space-y-3 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm ring-1 ring-black/[0.04] sm:ml-[3.25rem] sm:p-4"
                  role="group"
                  aria-label="Subtipo de cabello afro 4A a 4C"
                >
                  <p className="text-xs font-medium text-zinc-500">
                    Elige una opción para continuar al paso de síntomas
                  </p>
                  <div className="flex flex-col gap-2">
                    {afroTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAfroPick(opt.value)}
                        className="min-h-[48px] rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 active:scale-[0.99]"
                      >
                        <span className="text-forest-800">{opt.label}</span>
                        <span className="mt-1 block text-xs font-normal text-zinc-600">
                          {opt.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {phase === "symptoms" ? (
              <ChatBubble role="bot" speechKey="bot-paso2-sintomas">
                <p className="font-semibold text-zinc-900">Paso 2 de 3</p>
                <p className="mt-1">¿Qué problema presentas?</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Puedes marcar varios a la vez. Luego pediremos las
                  recomendaciones.
                </p>
              </ChatBubble>
            ) : null}

            {hairType && phase === "symptoms" ? (
              <div
                className="ml-[2.75rem] space-y-3 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm sm:ml-[3.25rem] sm:p-4"
                role="group"
                aria-label="Opciones de síntomas"
              >
                <p className="text-xs font-medium text-zinc-500">
                  Selecciona y pulsa «Ver recomendaciones»
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {symptomOptions.map((opt) => {
                    const on = symptoms.has(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={on}
                        disabled={diagnosisLoading}
                        onClick={() => toggleSymptom(opt.value)}
                        className={cn(
                          chipBase,
                          on
                            ? "border-forest-600 bg-forest-600 text-white hover:bg-forest-700"
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50",
                          diagnosisLoading && "opacity-50",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {symptomHint ? (
                  <p className="text-sm text-amber-800" role="alert">
                    Elige al menos una opción para seguir.
                  </p>
                ) : null}
                {diagnosisError ? (
                  <p className="text-sm text-red-600" role="alert">
                    {diagnosisError}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={diagnosisLoading}
                  onClick={() => void handleShowRecommendations()}
                  className="min-h-[48px] w-full rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
                >
                  {diagnosisLoading ? "Consultando…" : "Ver recomendaciones"}
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {phase === "results" &&
        results !== null &&
        hairType &&
        (hairType !== "coily" || afroSubType) ? (
          <section
            className="space-y-3 border-t border-zinc-300/50 pt-4"
            aria-labelledby="chat-step-3-title"
          >
            <h2 id="chat-step-3-title" className="sr-only">
              Paso 3: recomendaciones
            </h2>

            <ChatBubble role="user">
              <p>{symptomLabelsJoined}</p>
            </ChatBubble>

            <ChatBubble role="bot" speechKey="bot-paso3-resultados">
              <p className="font-semibold text-zinc-900">Paso 3 de 3</p>
              <p className="mt-1">
                Con lo que me cuentas, esto encaja bien contigo
              </p>
              <p className="mt-1.5 text-sm text-zinc-600">
                Son sugerencias generales con ingredientes naturales. Si hay
                enrojecimiento fuerte, dolor o caída muy rápida, consulta a un
                especialista.
              </p>
            </ChatBubble>

            <div className="sm:ml-[3.25rem]">
              <Results
                treatments={results}
                explanation={explanation}
                userSymptoms={Array.from(symptoms)}
                hairTypeLabel={hairTypeLabel}
                afroSubType={afroSubType ?? undefined}
                onRetry={handleRetry}
                className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-sm ring-1 ring-black/[0.04] sm:p-5"
              />
            </div>
          </section>
        ) : null}

        <div ref={endRef} className="h-1 w-full shrink-0" aria-hidden />
      </div>
    </div>
  );
}
