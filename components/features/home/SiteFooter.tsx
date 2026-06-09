import Link from "next/link";
import { EllasLogo } from "@/components/brand";

const FOOTER_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#ingredientes", label: "Ingredientes" },
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/resultados", label: "Resultados" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-16 md:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <EllasLogo className="w-28 sm:w-32 md:w-36" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/55 sm:text-base">
              Mascarillas capilares premium, naturales y artesanales. Orientación
              personalizada con IA para el cuidado de tu cabello.
            </p>
          </div>

          <nav
            className="flex flex-col items-center justify-center gap-1"
            aria-label="Enlaces del pie"
          >
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-[15px] font-normal text-white/80 transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center text-center md:items-end md:text-right">
            <p className="text-[13px] tabular-nums text-white/50">
              © {new Date().getFullYear()} Ellas · Tratamientos Capilares
            </p>
            <div className="mt-8 w-full max-w-sm border-t border-white/10 pt-8 md:mt-10 md:max-w-none">
              <p className="text-xs leading-relaxed text-white/45 sm:text-[13px]">
                Las recomendaciones son orientativas y no sustituyen valoración
                profesional de salud o estética.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
