import Link from "next/link";

export default function MascarillaNotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-slate-900">
        Mascarilla no encontrada
      </h1>
      <p className="mt-2 text-slate-600">
        Esa referencia no está en el catálogo. Vuelve al inicio o al listado de
        mascarillas.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Inicio
        </Link>
        <Link
          href="/mascarillas"
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800"
        >
          Catálogo
        </Link>
      </div>
    </div>
  );
}
