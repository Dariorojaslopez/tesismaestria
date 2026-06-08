import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["var(--font-ellas-display)", "Georgia", "serif"],
      },
      colors: {
        apple: {
          gray: "#f5f5f7",
          blue: "#0071e3",
          "blue-hover": "#0077ed",
          label: "#86868b",
          headline: "#1d1d1f",
        },
        void: "#0a0a0a",
        charcoal: "#141414",
        gold: {
          200: "#f4e4bc",
          300: "#e8d48a",
          400: "#e8c547",
          500: "#d4af37",
          600: "#b8962e",
          700: "#8a7030",
          800: "#5c4a1f",
        },
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        sand: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#e8dfd0",
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-gold": "pulse-gold 2.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "0.35", boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.35)" },
          "50%": { opacity: "0.65", boxShadow: "0 0 24px 4px rgba(212, 175, 55, 0.2)" },
        },
      },
      boxShadow: {
        soft: "0 2px 24px -8px rgba(0, 0, 0, 0.5)",
        gold: "0 8px 32px -8px rgba(212, 175, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.12)",
        card: "0 12px 40px -16px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
