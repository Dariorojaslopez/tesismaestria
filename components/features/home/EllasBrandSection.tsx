/**
 * Presentación de marca alineada al negocio Tratamientos Capilares Ellas
 * (mascarillas artesanales y línea del catálogo en Excel).
 */
export function EllasBrandSection() {
  return (
    <section
      className="mx-auto mt-16 w-full max-w-2xl px-6 pb-16"
      aria-labelledby="ellas-brand-heading"
    >
      <h2
        id="ellas-brand-heading"
        className="text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
      >
        Tratamientos Capilares Ellas
      </h2>
      <div className="mt-6 space-y-4 text-left text-base leading-relaxed text-slate-600">
        <p>
          Somos una marca de{" "}
          <span className="font-medium text-slate-800">
            mascarillas capilares artesanales
          </span>
          , formuladas con frutas, semillas y activos naturales pensados para el
          cuidado del cabello afro y texturas que necesitan hidratación real.
        </p>
        <p>
          Nuestra línea incluye referencias como{" "}
          <span className="text-slate-800">
            banano y miel, chontaduro, remolacha, cebolla con colágeno y miel,
            guayaba, coco, aguacate, papaya, guanábana, y mezclas reparadoras
          </span>{" "}
          (por ejemplo AFROGLOW, HERBAL ROOTS o TROPICAL REPAIR), además de
          opciones para fortalecer raíces, dar brillo y acompañar cabellos
          tratados químicamente cuando el producto lo indica.
        </p>
        <p className="text-sm text-slate-500">
          El asistente de esta página usa el mismo criterio de tu catálogo
          (beneficios por síntoma y notas por tipo 4A, 4B y 4C) para orientar,
          sin sustituir el consejo de un profesional de salud o estética.
        </p>
      </div>
    </section>
  );
}
