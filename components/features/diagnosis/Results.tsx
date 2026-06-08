"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";
import type { AfroSubType, TreatmentRecord } from "@/data/treatments";
import { brandImageSrcForTreatmentId } from "@/lib/brandProductImage";
import { cn } from "@/lib/utils";

/** Modelo mostrado en lista (API; el detalle vive en `/mascarillas/[id]`). */
export type ResultsTreatment = TreatmentRecord & {
  howToApply?: readonly string[];
};

export type ResultsProps = {
  treatments: ResultsTreatment[];
  explanation?: string;
  userSymptoms?: string[];
  hairTypeLabel?: string;
  afroSubType?: AfroSubType;
  onRetry: () => void;
  className?: string;
};

const MAX_SUGGESTIONS = 3;

function TreatmentBrandImage({
  treatmentId,
  alt,
  className,
}: {
  treatmentId: string;
  alt: string;
  className?: string;
}) {
  const src = brandImageSrcForTreatmentId(treatmentId);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "aspect-[4/3] w-full rounded-xl bg-slate-100 ring-1 ring-slate-200/60",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100/80",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain p-2"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="17" cy="20" r="1.25" />
      <path d="M3 4h2l.6 3m0 0 .76 3.78a1 1 0 0 01 .82H19a1 1 0 0 0 .95-.68l1.6-5.34H6.16" />
    </svg>
  );
}

function ProductCard({
  treatment,
  afroSubType,
  index,
  onOpen,
}: {
  treatment: ResultsTreatment;
  afroSubType?: AfroSubType;
  index: number;
  onOpen: () => void;
}) {
  const benefits = treatment.benefits.filter(Boolean).slice(0, 6);
  const afroLine =
    afroSubType && treatment.afroBenefitByType?.[afroSubType]
      ? treatment.afroBenefitByType[afroSubType]
      : null;

  return (
    <li className="flex w-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-100/80 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Producto {index + 1}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">
        {treatment.name}
      </h3>
      <TreatmentBrandImage
        treatmentId={treatment.id}
        alt={treatment.name}
        className="mt-3"
      />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Beneficios
      </p>
      <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-700 [word-break:break-word]">
        {benefits.map((b, i) => (
          <li key={`${treatment.id}-b-${i}`}>{b}</li>
        ))}
      </ul>
      {afroLine ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          <span className="font-medium text-slate-700">Textura {afroSubType}: </span>
          {afroLine}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onOpen}
        className="mt-4 w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Ver más detalles
      </button>
    </li>
  );
}

function ProductModal({
  treatment,
  afroSubType,
  open,
  onClose,
}: {
  treatment: ResultsTreatment | null;
  afroSubType?: AfroSubType;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!treatment) return null;

  const afroLine =
    afroSubType && treatment.afroBenefitByType?.[afroSubType]
      ? treatment.afroBenefitByType[afroSubType]
      : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Cerrar"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-[1] max-h-[min(88dvh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                id={titleId}
                className="text-xl font-semibold tracking-tight text-slate-900"
              >
                {treatment.name}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Cerrar
              </button>
            </div>

            <TreatmentBrandImage
              treatmentId={treatment.id}
              alt={treatment.name}
              className="mt-4"
            />

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Beneficios
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-700">
              {treatment.benefits.filter(Boolean).map((b, i) => (
                <li key={`${treatment.id}-modal-b-${i}`}>{b}</li>
              ))}
            </ul>

            {treatment.ingredients.length > 0 ? (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ingredientes clave
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {treatment.ingredients.join(", ")}
                </p>
              </>
            ) : null}

            {afroLine ? (
              <p className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-700">
                <span className="font-medium text-slate-900">Textura {afroSubType}: </span>
                {afroLine}
              </p>
            ) : null}

            {treatment.generalNote ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {treatment.generalNote}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-auto"
                aria-label="Realiza tu pedido (disponible próximamente)"
              >
                <CartIcon className="size-5 shrink-0 opacity-95" />
                Realiza tu pedido
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Results({
  treatments,
  hairTypeLabel,
  afroSubType,
  onRetry,
  className = "",
}: ResultsProps) {
  const displayed = treatments.slice(0, MAX_SUGGESTIONS);
  const hasTreatments = displayed.length > 0;
  const [modalTreatment, setModalTreatment] = useState<ResultsTreatment | null>(
    null,
  );

  const openModal = useCallback((t: ResultsTreatment) => {
    setModalTreatment(t);
  }, []);

  const closeModal = useCallback(() => setModalTreatment(null), []);

  return (
    <section
      className={`space-y-6 ${className}`}
      aria-labelledby="results-heading"
    >
      <div className="flex flex-col gap-3">
        <h2
          id="results-heading"
          className="w-full text-balance text-lg font-semibold leading-snug text-slate-900 sm:text-xl"
        >
          Sugerencias para ti
        </h2>
        {hairTypeLabel ? (
          <p className="text-sm leading-snug text-slate-600">
            Tipo de cabello:{" "}
            <span className="font-medium text-slate-800">{hairTypeLabel}</span>
          </p>
        ) : null}
        {hasTreatments ? (
          <p className="mt-2 w-full text-justify text-base leading-relaxed text-slate-700 sm:mt-3">
            Te recomendamos alguno de estos 3 productos.
          </p>
        ) : null}
      </div>

      {hasTreatments ? (
        <>
          <ul className="mx-auto flex w-full max-w-xl flex-col gap-5 list-none sm:max-w-2xl">
            {displayed.map((t, index) => (
              <ProductCard
                key={t.id}
                treatment={t}
                afroSubType={afroSubType}
                index={index}
                onOpen={() => openModal(t)}
              />
            ))}
          </ul>
          <div className="mx-auto w-full max-w-xl sm:max-w-2xl">
            <button
              type="button"
              onClick={onRetry}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 sm:mx-auto sm:block sm:max-w-xs"
            >
              Reintentar diagnóstico
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-4 text-sm text-amber-950 shadow-sm sm:px-5 sm:py-4">
            <p className="font-medium">Sin coincidencias por ahora</p>
            <p className="mt-1 leading-relaxed text-amber-900/90">
              No hay tratamientos que encajen con esa combinación según las reglas
              actuales. Prueba otros síntomas o vuelve a empezar con el botón de
              abajo.
            </p>
          </div>
          <div className="mx-auto w-full max-w-xl sm:max-w-2xl">
            <button
              type="button"
              onClick={onRetry}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 sm:mx-auto sm:block sm:max-w-xs"
            >
              Reintentar diagnóstico
            </button>
          </div>
        </>
      )}

      <ProductModal
        treatment={modalTreatment}
        afroSubType={afroSubType}
        open={modalTreatment !== null}
        onClose={closeModal}
      />
    </section>
  );
}
