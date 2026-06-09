"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import type { PublicUser } from "@/services/auth/types";

type AuthMode = "login" | "register";
type AuthView = AuthMode | "forgot";

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (user: PublicUser) => void;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export function AuthModal({
  open,
  mode,
  onClose,
  onModeChange,
  onSuccess,
}: AuthModalProps) {
  const titleId = useId();
  const [view, setView] = useState<AuthView>(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [names, setNames] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (open) setView(mode);
  }, [open, mode]);

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
      setError(null);
      setSuccessMessage(null);
    }
  }, [open, view]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const endpoint = view === "register" ? "/api/auth/register" : "/api/auth/login";
      const body =
        view === "register"
          ? { email, password, names, address, department, city }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as {
        user?: PublicUser;
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (res.status === 409 && view === "register") {
          setView("login");
          onModeChange("login");
        }
        if (res.status === 401 && view === "login") {
          setError(
            "Correo o contraseña incorrectos. Si te registraste y viste un error en pantalla, usa «¿Olvidaste tu contraseña?» para recibir una nueva.",
          );
          return;
        }
        setError(data.error ?? "No se pudo completar la solicitud.");
        return;
      }

      if (data.user) onSuccess(data.user);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar el correo.");
        return;
      }

      setSuccessMessage(
        data.message ??
          "Si el correo está registrado, recibirás una contraseña temporal.",
      );
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const title =
    view === "register"
      ? "Crear cuenta"
      : view === "forgot"
        ? "Recuperar contraseña"
        : "Iniciar sesión";

  const subtitle =
    view === "register"
      ? "Registro corto para guardar tu carrito y pedido."
      : view === "forgot"
        ? "Te enviaremos una contraseña temporal a tu correo."
        : "Inicia sesión para añadir productos al carrito.";

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
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
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

            {view !== "forgot" ? (
              <div className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    onModeChange("login");
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    view === "login"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    onModeChange("register");
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    view === "register"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Registrarse
                </button>
              </div>
            ) : null}

            {view === "forgot" ? (
              <form className="mt-5 space-y-3" onSubmit={(e) => void handleForgotSubmit(e)}>
                <label className="block text-sm font-medium text-slate-700">
                  Correo electrónico
                  <input
                    type="email"
                    className={`${inputClass} mt-1`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
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
                  {loading ? "Enviando…" : "Enviar contraseña al correo"}
                </button>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  ← Volver a iniciar sesión
                </button>
              </form>
            ) : (
              <form className="mt-5 space-y-3" onSubmit={(e) => void handleSubmit(e)}>
                {view === "register" ? (
                  <>
                    <label className="block text-sm font-medium text-slate-700">
                      Nombres
                      <input
                        className={`${inputClass} mt-1`}
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Dirección
                      <input
                        className={`${inputClass} mt-1`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        autoComplete="street-address"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Departamento
                        <input
                          className={`${inputClass} mt-1`}
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                        />
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        Ciudad
                        <input
                          className={`${inputClass} mt-1`}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          autoComplete="address-level2"
                        />
                      </label>
                    </div>
                  </>
                ) : null}

                <label className="block text-sm font-medium text-slate-700">
                  Correo electrónico
                  <input
                    type="email"
                    className={`${inputClass} mt-1`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Contraseña
                  <input
                    type="password"
                    className={`${inputClass} mt-1`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={view === "register" ? "new-password" : "current-password"}
                  />
                </label>

                {view === "login" ? (
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                ) : null}

                {error ? (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading
                    ? "Procesando…"
                    : view === "register"
                      ? "Crear cuenta"
                      : "Entrar"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
