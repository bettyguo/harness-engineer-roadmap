import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "Inter Display",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // canvas + ink (dark)
        canvas: "#0a0a0f",
        canvasGrid: "#1a1a22",
        ink: "#f5f5f7",
        inkDim: "#a0a0a8",
        inkMuted: "#6b6b75",

        // canvas + ink (light)
        canvasLight: "#fafaf7",
        canvasGridLight: "#e8e8e2",
        inkLight: "#0a0a0f",
        inkDimLight: "#48484f",

        // signature accent — used sparingly (active node, focus, links)
        accent: "#5EEAD4",
        accentSoft: "#5EEAD420",

        // area palette (desaturated, adjacent-cluster contrast)
        area: {
          violet:    "#a78bfa",
          teal:      "#5eead4",
          amber:     "#fbbf24",
          rose:      "#fb7185",
          indigo:    "#818cf8",
          emerald:   "#6ee7b7",
          fuchsia:   "#e879f9",
          sky:       "#7dd3fc",
          orange:    "#fb923c",
          lime:      "#bef264",
          red:       "#f87171",
          cyan:      "#67e8f9",
        },
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(245,245,247,0.08), 0 12px 48px -16px rgba(0,0,0,0.6)",
        nodeHover: "0 0 0 4px rgba(94,234,212,0.12)",
        nodeActive: "0 0 0 2px #5EEAD4, 0 0 0 6px rgba(94,234,212,0.16)",
      },
      backgroundImage: {
        dotGrid: "radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
