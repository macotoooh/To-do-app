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
    ".storybook",
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
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // _で始まる引数は、意図的に未使用として扱う
          caughtErrorsIgnorePattern: "^_", // catchのエラー変数で、_で始まるものは未使用でも警告しない
          varsIgnorePattern: "^_", // _で始まる通常の変数（const / let / import など）は未使用でも警告しない
        },
      ],
      "no-var": "error", // var禁止
      "prefer-const": "error", // constのみ許容
      eqeqeq: "error", // ===, !== のみ許容
      "react/self-closing-comp": "warn", // 小要素がないタグの対応
      "react/jsx-key": "error", // mapのkeyを必須にする
      "no-duplicate-imports": "error", // 同じモジュールからの import の重複を禁止
      "react/react-in-jsx-scope": "off", // JSX 利用時に React を明示的に import しない (不要)
      "@typescript-eslint/no-floating-promises": "error", // await / return / void / catch されていない Promise を禁止
    },
  },
]);
