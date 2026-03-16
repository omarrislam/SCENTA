import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query"],
          i18n: ["i18next", "react-i18next"],
          stripe: ["@stripe/react-stripe-js", "@stripe/stripe-js"]
        }
      }
    }
  },
  server: {
    port: 5173,
    open: false
  }
});
