import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    // Cloudflare/quick tunnels send a public Host header; Vite 5.4+ would
    // otherwise reject those requests (DNS rebinding protection).
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
  optimizeDeps: {
    include: ["phaser"],
  },
  test: {
    environment: "node",
  },
});
