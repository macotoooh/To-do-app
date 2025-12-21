import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        /**
         * Uses a separate Vite config file (vite.storybook.config.ts) to isolate Storybook behavior.
         */
        viteConfigPath: "vite.storybook.config.ts",
      },
    },
  },
  /**
   * Customize the final Vite config used by Storybook.
   * This is a built-in Storybook hook for overriding Vite settings.
   */
  async viteFinal(baseConfig) {
    /**
     * Excludes Remix and React Router Vite plugins from Storybook to prevent runtime conflicts.
     * Remove Remix/React Router plugins to prevent Storybook errors like:
     * "The React Router Vite plugin requires the use of a Vite"
     */
    const plugins = (baseConfig.plugins ?? []).filter((p: any) => {
      const name = p?.name ?? "";
      return !/remix|react-router/i.test(name);
    });

    return {
      ...baseConfig,
      // Add Tailwind plugin to apply styles in Storybook
      plugins: [tailwindcss(), ...plugins],
    };
  },
};
export default config;
