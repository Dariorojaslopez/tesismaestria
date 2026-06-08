"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Tipo de cabello",
    body: "Liso, ondulado, rizado o crespo/afro. Si aplica, afinamos con 4A, 4B o 4C.",
  },
  {
    n: "02",
    title: "Síntomas",
    body: "Marcas lo que notas: sequedad, caída, encrespamiento y más. Varios a la vez.",
  },
  {
    n: "03",
    title: "Recomendación",
    body: "Recibes sugerencias del catálogo Ellas ordenadas y explicadas para ti.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="flex w-full flex-col scroll-mt-4 border-t border-black/[0.06] bg-white px-6 py-12 sm:px-10 sm:py-14 md:px-16 lg:px-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.h2
          id="how-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-center text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl md:text-6xl md:leading-[1.05]"
        >
          Cómo funciona
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-xl text-center text-lg text-apple-label sm:text-xl"
        >
          Tres pasos. Abre el asistente cuando quieras desde el botón flotante.
        </motion.p>

        <ol className="mt-10 grid gap-10 md:mt-12 md:grid-cols-3 md:gap-8 lg:gap-10">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center md:text-left"
            >
              <span className="text-5xl font-semibold tabular-nums text-[#d2d2d7] sm:text-6xl md:text-7xl">
                {s.n}
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
                {s.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-apple-label sm:text-lg">
                {s.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
