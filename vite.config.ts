import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
  optimizeDeps: {
    include: ["pixi.js"],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
