"use client";

import { useState } from "react";
import { CartIcon } from "@/components/cart/CartIcon";
import { useAppStore } from "@/components/store/AppStoreProvider";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  treatmentId: string;
  treatmentName?: string;
  className?: string;
};

export function AddToCartButton({
  treatmentId,
  treatmentName,
  className,
}: AddToCartButtonProps) {
  const { addToCart } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setLoading(true);
    const ok = await addToCart(treatmentId, treatmentName);
    if (ok) setAdded(true);
    setLoading(false);
    if (ok) {
      window.setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleClick()}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60 sm:w-auto",
        className,
      )}
      aria-label={`Añadir ${treatmentName ?? "producto"} al carrito`}
    >
      <CartIcon className="size-5 shrink-0 opacity-95" />
      {loading ? "Añadiendo…" : added ? "Añadido ✓" : "Añadir al carrito"}
    </button>
  );
}
