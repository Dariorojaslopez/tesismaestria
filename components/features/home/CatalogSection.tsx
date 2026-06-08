"use client";

import { motion } from "framer-motion";
import { CatalogCarousel } from "./CatalogCarousel";

export function CatalogSection() {
  return (
    <section
      id="catalogo"
      className="flex w-full flex-col scroll-mt-24 border-t border-black/[0.06] bg-white px-6 py-12 sm:px-10 sm:py-14 md:px-16 lg:px-24"
      aria-labelledby="catalogo-heading"
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <motion.h2
          id="catalogo-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl md:text-6xl md:leading-[1.05]"
        >
          Catálogo
        </motion.h2>
        <CatalogCarousel />
      </div>
    </section>
  );
}
