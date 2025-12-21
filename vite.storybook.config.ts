import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vite configuration for Storybook only.
 *
 * This file isolates Storybook from the Remix-specific Vite config
 * to avoid plugin conflicts during build/preview.
 *
 * Uses `vite-tsconfig-paths` to resolve imports like "@/components/..."
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };
  return {
    plugins: [tsconfigPaths()],
  };
});
