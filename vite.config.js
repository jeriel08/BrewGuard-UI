import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7125",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "vendor";
            }
            if (id.includes("@radix-ui") || id.includes("lucide")) {
              return "ui";
            }
            if (id.includes("recharts")) {
              return "chart";
            }
            if (id.includes("jspdf") || id.includes("html2canvas")) {
              return "pdf";
            }
            if (id.includes("@tanstack")) {
              return "query";
            }
            return "vendor-others";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
