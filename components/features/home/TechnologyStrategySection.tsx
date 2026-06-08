export function TechnologyStrategySection() {
  return (
    <section
      className="mb-12 w-full max-w-2xl border-t border-slate-200 pt-16"
      aria-labelledby="strategy-heading"
    >
      <h2
        id="strategy-heading"
        className="text-center text-2xl font-semibold tracking-tight text-slate-900"
      >
        Cómo encaja con una estrategia de gestión tecnológica
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
        Este asistente organiza la información y la manera de actuar frente al
        usuario: la tecnología sirve para estructurar el servicio, no para
        sustituir el criterio clínico cuando haga falta.
      </p>

      <div className="mt-10 space-y-10">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <h3 className="text-lg font-semibold text-slate-900">
            Recogida de datos
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            La información llega de forma guiada: el usuario indica su tipo de
            cabello y los problemas que percibe (caída, sequedad, encrespamiento,
            etc.).
            Esos datos son explícitos y acotados al flujo del chat, lo que
            facilita registrar necesidades sin formularios largos ni campos
            ambiguos.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <h3 className="text-lg font-semibold text-slate-900">
            Toma de decisiones
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Las decisiones siguen reglas claras definidas por el equipo: se
            prioriza qué tratamientos encajan mejor según los síntomas
            declarados y el catálogo de beneficios de cada opción. Así la
            gestión del conocimiento es transparente y revisable, en lugar de
            depender de criterios opacos.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <h3 className="text-lg font-semibold text-slate-900">
            Generación de recomendaciones
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Las recomendaciones se obtienen al contrastar lo que cuenta el
            usuario con el perfil de cada tratamiento natural (ingredientes,
            beneficios, uso sugerido). Lo más relevante aparece primero, para que
            la experiencia sea útil y coherente con la estrategia del servicio:
            orientar, no diagnosticar en sentido médico.
          </p>
        </div>
      </div>
    </section>
  );
}
