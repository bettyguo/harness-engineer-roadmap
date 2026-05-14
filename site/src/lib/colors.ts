import type { AreaColor } from "../types";

// Single source of truth for area palette. Mirrors tailwind.config.ts
// so colors are usable both in Tailwind utilities (compile-time) and
// in inline-style overrides (runtime — React Flow inline color props).
//
// Each area's color comes in three intensities:
//   solid   — node fill for core nodes (full saturation)
//   border  — node border for recommended/optional nodes
//   tint    — soft cluster-background tint
//   text    — readable text color on top of solid fill

export const AREA_COLORS: Record<AreaColor, {
  solid: string;
  border: string;
  tint: string;
  text: string;
}> = {
  violet:  { solid: "#a78bfa", border: "#a78bfa", tint: "#a78bfa10", text: "#0a0a0f" },
  teal:    { solid: "#5eead4", border: "#5eead4", tint: "#5eead410", text: "#0a0a0f" },
  amber:   { solid: "#fbbf24", border: "#fbbf24", tint: "#fbbf2410", text: "#0a0a0f" },
  rose:    { solid: "#fb7185", border: "#fb7185", tint: "#fb718510", text: "#0a0a0f" },
  indigo:  { solid: "#818cf8", border: "#818cf8", tint: "#818cf810", text: "#0a0a0f" },
  emerald: { solid: "#6ee7b7", border: "#6ee7b7", tint: "#6ee7b710", text: "#0a0a0f" },
  fuchsia: { solid: "#e879f9", border: "#e879f9", tint: "#e879f910", text: "#0a0a0f" },
  sky:     { solid: "#7dd3fc", border: "#7dd3fc", tint: "#7dd3fc10", text: "#0a0a0f" },
  orange:  { solid: "#fb923c", border: "#fb923c", tint: "#fb923c10", text: "#0a0a0f" },
  lime:    { solid: "#bef264", border: "#bef264", tint: "#bef26410", text: "#0a0a0f" },
  red:     { solid: "#f87171", border: "#f87171", tint: "#f8717110", text: "#0a0a0f" },
  cyan:    { solid: "#67e8f9", border: "#67e8f9", tint: "#67e8f910", text: "#0a0a0f" },
};

export const ACCENT = "#5EEAD4";
export const INK = "#f5f5f7";
export const INK_DIM = "#a0a0a8";
