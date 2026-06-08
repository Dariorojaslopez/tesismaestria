"use client";

import { motion } from "framer-motion";

type IngredientCard = {
  name: string;
  benefit: string;
  body: string;
};

const INGREDIENTS: IngredientCard[] = [
  {
    name: "Plátano y miel",
    benefit: "Hidratación y brillo",
    body:
      "Humectan el tallo capilar, suavizan la cutícula y ayudan a que el cabello se vea más luminoso y manejable, ideal cuando hay sequedad o encrespamiento.",
  },
  {
    name: "Coco",
    benefit: "Nutrición y cuero cabelludo",
    body:
      "Aporta lípidos ligeros que refuerzan la barrera del pelo y del cuero cabelludo; muy útil en rutinas de hidratación profunda en texturas gruesas o porosas.",
  },
  {
    name: "Aguacate",
    benefit: "Suavidad y elasticidad",
    body:
      "Rico en ácidos grasos naturales; ayuda a mejorar la sensación de elasticidad y a reducir el aspecto áspero en puntas resecas o tratadas.",
  },
  {
    name: "Guayaba",
    benefit: "Fortalecimiento",
    body:
      "Aporta antioxidantes y micronutrientes asociados a fibras capilares más resistentes; encaja bien en cabellos que se sienten débiles o con quiebre.",
  },
  {
    name: "Cebolla",
    benefit: "Estímulo y caída",
    body:
      "Tradicionalmente vinculada al cuidado del cuero cabelludo y al apoyo en fases de mayor caída o densidad reducida; conviene usar con precaución si hay sensibilidad.",
  },
  {
    name: "Chontaduro",
    benefit: "Reparación y crecimiento",
    body:
      "Ingredientes de origen amazónico orientados a nutrir y acompañar procesos de fortalecimiento cuando el cabello está dañado o con crecimiento lento.",
  },
];

export function NaturalTreatmentsSection() {
  return (
    <section
      id="ingredientes"
      className="flex w-full flex-col scroll-mt-4 border-t border-black/[0.06] bg-[#f5f5f7] px-6 py-12 sm:px-10 sm:py-14 md:px-16 lg:px-24"
      aria-labelledby="ingredientes-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.h2
          id="ingredientes-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-center text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl md:text-5xl md:leading-[1.08]"
        >
          Ingredientes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-apple-label sm:text-lg"
        >
          Activos naturales presentes en el catálogo Ellas y sus beneficios
          orientativos para el cuidado capilar, con especial atención a texturas
          afro y mixtas.
        </motion.p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {INGREDIENTS.map((item, i) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="group flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition-all duration-300 hover:border-gold-500/35 hover:shadow-[0_12px_36px_-18px_rgba(212,175,55,0.35)] sm:p-6">
                <div
                  className="mb-3 h-0.5 w-10 rounded-full bg-gradient-to-r from-gold-500 to-gold-600"
                  aria-hidden
                />
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#1d1d1f] transition-colors group-hover:text-gold-800 sm:text-xl">
                    {item.name}
                  </h3>
                  <span className="rounded-full bg-gold-200/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold-800">
                    {item.benefit}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-apple-label">
                  {item.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
