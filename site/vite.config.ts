import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/harness-engineer-roadmap/",
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2022",
    chunkSizeWarningLimit: 800,
  },
});
