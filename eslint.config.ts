import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    ".react-router",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tseslint.plugin, // typescript用のeslintのブラグイン
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // _ついている変数の場合は許容
          caughtErrorsIgnorePattern: "^_", // _ついている引数の場合は許容
        },
      ],
      "no-var": "error", // var禁止
      "prefer-const": "error", // constのみ許容
      eqeqeq: "error", // ===, !== のみ許容
      "react/self-closing-comp": "warn", // 小要素がないタグの対応
      "react/jsx-key": "error", // mapのkeyを必須にする
    },
  },
]);
