"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { NavSparkleBurst } from "./NavSparkleBurst";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#ingredientes", label: "Ingredientes" },
  { href: "/#catalogo", label: "Catálogo" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const menuId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );

  const addSparkle = useCallback((clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x: clientX, y: clientY }]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 650);
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      addSparkle(e.clientX, e.clientY);
      setMobileOpen(false);
    },
    [addSparkle],
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkClass =
    "text-[13px] font-normal text-[#1d1d1f] transition-colors hover:text-[#424245]";

  return (
    <>
      <header className="sticky top-0 z-[110] bg-white md:bg-[#f5f5f7]/85 md:backdrop-blur-md">
        <nav
          className="relative mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8"
          aria-label="Principal"
        >
          <div className="flex justify-start">
            <Link
              href="/"
              className="font-display text-lg font-semibold tracking-tight text-gradient-gold"
              onClick={handleLinkClick}
            >
              Ellas
            </Link>
          </div>

          <ul className="hidden items-center justify-center gap-7 lg:gap-9 md:flex">
            {LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-transparent text-[#1d1d1f] transition hover:bg-black/[0.04] md:hidden"
              aria-expanded={mobileOpen}
              aria-controls={menuId}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <motion.span
                className="block h-0.5 w-[22px] origin-center rounded-full bg-[#1d1d1f]"
                animate={
                  mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.22 }}
              />
              <motion.span
                className="block h-0.5 w-[22px] rounded-full bg-[#1d1d1f]"
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block h-0.5 w-[22px] origin-center rounded-full bg-[#1d1d1f]"
                animate={
                  mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.22 }}
              />
            </button>
          </div>
        </nav>

        <div
          className="pointer-events-none mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-hidden
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/55 to-transparent" />
          <div className="mt-0.5 h-px w-full bg-gradient-to-r from-transparent via-gold-600/35 to-transparent" />
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-14 z-[115] bg-black/20 md:hidden"
                aria-label="Cerrar menú"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-full z-[120] overflow-hidden border-b border-black/[0.08] bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] md:hidden"
              >
                <ul className="flex flex-col px-6 py-5">
                  {LINKS.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        className="block border-b border-black/[0.06] py-3.5 text-base font-medium text-[#1d1d1f]"
                        onClick={handleLinkClick}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/45 to-transparent" />
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </header>

      {bursts.map((b) => (
        <NavSparkleBurst key={b.id} x={b.x} y={b.y} />
      ))}
    </>
  );
}
