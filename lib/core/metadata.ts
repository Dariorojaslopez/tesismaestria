import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  title: {
    default: "Ellas · Diagnóstico capilar con IA",
    template: "%s · Ellas IA",
  },
  description:
    "Prototipo académico y producto real: asistente con IA y gestión de datos para recomendar tratamientos capilares naturales a mujeres afrodescendientes. Tratamientos Capilares Ellas.",
  applicationName: "Ellas IA Capilar",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ellas IA",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/brand/logo.ico", type: "image/x-icon", sizes: "48x48" }],
    shortcut: "/brand/logo.ico",
    apple: [{ url: "/brand/logo.ico" }],
  },
};
