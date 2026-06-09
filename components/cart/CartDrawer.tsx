"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { CartIcon } from "@/components/cart/CartIcon";
import { formatCopFromCents } from "@/lib/money";
import type { CartItemView } from "@/services/repositories/cartRepository";

type CartDrawerProps = {
  open: boolean;
  items: CartItemView[];
  totalInCents: number;
  onClose: () => void;
  onRemove: (treatmentId: string) => void;
  onUpdateQuantity: (treatmentId: string, action: "increment" | "decrement") => void;
  onCheckout: () => Promise<void>;
};

export function CartDrawer({
  open,
  items,
  totalInCents,
  onClose,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}: CartDrawerProps) {
  const titleId = useId();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const totalItems = items.reduce((n, item) => n + item.quantity, 0);

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

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      await onCheckout();
    } finally {
      setCheckoutLoading(false);
    }
  }

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
          className="fixed inset-0 z-[240] flex justify-end"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            aria-label="Cerrar carrito"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative z-[1] flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <CartIcon className="size-5 text-slate-800" />
                <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                  Tu carrito
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Aún no has añadido productos. Usa «Añadir al carrito» en las
                  recomendaciones.
                </p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {formatCopFromCents(item.unitPriceCents)} c/u
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void onRemove(item.treatmentId)}
                          className="shrink-0 text-xs font-medium text-red-600 hover:underline"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                          <button
                            type="button"
                            aria-label="Disminuir cantidad"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              onUpdateQuantity(item.treatmentId, "decrement")
                            }
                            className="flex h-9 w-9 items-center justify-center text-lg text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Aumentar cantidad"
                            onClick={() =>
                              onUpdateQuantity(item.treatmentId, "increment")
                            }
                            className="flex h-9 w-9 items-center justify-center text-lg text-slate-700 transition hover:bg-slate-50"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCopFromCents(item.lineTotalCents)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>Productos ({totalItems})</span>
                <span className="text-base font-semibold text-slate-900">
                  {formatCopFromCents(totalInCents)}
                </span>
              </div>
              <button
                type="button"
                disabled={items.length === 0 || checkoutLoading}
                onClick={() => void handleCheckout()}
                className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutLoading ? "Redirigiendo a Wompi…" : "Proceder a pagar"}
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Pago seguro con Wompi (tarjeta, PSE, Nequi y más).
              </p>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
