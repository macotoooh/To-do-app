import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
      stories: path.resolve(__dirname, "stories"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./app/setup-tests.ts",
  },
});
