import Link from "next/link";
import { formatCopFromCents } from "@/lib/money";
import { getOrderByReference } from "@/services/checkout/checkoutService";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function PagoResultadoPage({ searchParams }: PageProps) {
  const refRaw = searchParams.ref ?? searchParams.reference;
  const reference = Array.isArray(refRaw) ? refRaw[0] : refRaw;
  const order = reference ? await getOrderByReference(reference) : null;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white px-4 py-16">
      <main className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Resultado del pago
        </h1>

        {order ? (
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p>
              Referencia:{" "}
              <span className="font-medium text-slate-900">{order.reference}</span>
            </p>
            <p>
              Total:{" "}
              <span className="font-medium text-slate-900">
                {formatCopFromCents(order.totalInCents)}
              </span>
            </p>
            <p>
              Estado del pedido:{" "}
              <span className="font-medium text-emerald-800">{order.status}</span>
            </p>
            <p className="leading-relaxed text-slate-600">
              Si Wompi aprobó el pago, recibirás la confirmación en tu correo.
              Gracias por comprar con Ellas.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            No encontramos la referencia del pedido. Si completaste el pago,
            revisa tu correo o contacta soporte.
          </p>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
