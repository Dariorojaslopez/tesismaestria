"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "IA y gestión de datos",
    text: "Las respuestas se cruzan con un catálogo estructurado (síntomas, beneficios, notas 4A–4C). La trazabilidad del criterio apoya la gestión del conocimiento y la replicabilidad en otros contextos de salud/beauty tech.",
  },
  {
    title: "Personalización responsable",
    text: "No sustituye diagnóstico médico: orienta con reglas explícitas y texto explicativo. Encaja con buenas prácticas de sistemas de recomendación en entornos sensibles.",
  },
  {
    title: "Enfoque cultural",
    text: "El subtipo 4A/4B/4C y el lenguaje cercano reconocen la diversidad capilar afro. La tecnología aquí es inclusión operativa, no un extra cosmético.",
  },
] as const;

export function TechnologyBehindSection() {
  return (
    <section
      className="border-y border-zinc-200/70 bg-white/40 py-16 backdrop-blur-[2px] sm:py-20"
      aria-labelledby="tech-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="tech-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
          >
            Tecnología detrás
          </h2>
          <p className="mt-3 text-pretty text-base text-zinc-600 sm:text-lg">
            Puente entre tu maestría en gestión de tecnología de la información,
            biotecnología aplicada al cuidado capilar y un producto en mercado.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-zinc-200/80 bg-white/95 p-6 shadow-soft sm:p-7"
            >
              <h3 className="text-base font-semibold text-zinc-900">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                {p.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
