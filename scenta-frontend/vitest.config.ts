import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    include: [
      "tests/unit/**/*.{test,spec}.ts",
      "tests/unit/**/*.{test,spec}.tsx",
      "tests/integration/**/*.{test,spec}.ts",
      "tests/integration/**/*.{test,spec}.tsx"
    ]
  }
});
