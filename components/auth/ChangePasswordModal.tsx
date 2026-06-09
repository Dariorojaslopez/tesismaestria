"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const titleId = useId();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccessMessage(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo cambiar la contraseña.");
        return;
      }

      setSuccessMessage(data.message ?? "Contraseña actualizada.");
      window.setTimeout(() => onClose(), 1400);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
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
          className="fixed inset-0 z-[250] flex items-end justify-center p-4 sm:items-center"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Cerrar"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="relative z-[1] w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="text-xl font-semibold text-slate-900">
                  Cambiar contraseña
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Usa la contraseña temporal que recibiste por correo como
                  «contraseña actual».
                </p>
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

            <form className="mt-5 space-y-3" onSubmit={(e) => void handleSubmit(e)}>
              <label className="block text-sm font-medium text-slate-700">
                Contraseña actual
                <input
                  type="password"
                  className={`${inputClass} mt-1`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Nueva contraseña
                <input
                  type="password"
                  className={`${inputClass} mt-1`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Confirmar nueva contraseña
                <input
                  type="password"
                  className={`${inputClass} mt-1`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </label>

              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              {successMessage ? (
                <p className="text-sm text-emerald-700" role="status">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Guardando…" : "Guardar nueva contraseña"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
