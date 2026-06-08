import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ellas · Diagnóstico capilar con IA",
    short_name: "Ellas IA",
    description:
      "Asistente inteligente para recomendaciones de tratamientos capilares naturales, con enfoque en texturas afro y gestión de datos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f7",
    theme_color: "#f5f5f7",
    orientation: "portrait-primary",
    categories: ["health", "lifestyle", "medical"],
    icons: [
      {
        src: "/brand/logo.ico",
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
  };
}
