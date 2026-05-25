import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "framer-motion";
          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }
          if (id.includes("react-router")) return "router-vendor";
          if (id.includes("axios")) return "http-vendor";
          if (id.includes("lucide-react")) return "icons-vendor";
          if (id.includes("@dnd-kit")) return "dnd-vendor";
          return "vendor";
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
