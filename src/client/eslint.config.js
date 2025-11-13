import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react"; // ← 追加！
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // JS向け推奨設定
  js.configs.recommended,

  // TypeScript向け設定
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.app.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, React: "readonly", JSX: "readonly" }, // ← JSX を追加
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "arrow-body-style": ["off"],
      "react/function-component-definition": [
        2,
        {
          namedComponents: "function-declaration",
          unnamedComponents: "function-expression",
        },
      ],
      "react/jsx-no-useless-fragment": [
        2,
        {
          allowExpressions: true,
        },
      ],
      "react/jsx-props-no-spreading": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens",
        },
      ],
      "react/require-default-props": "off",
      "react/prop-types": "off",
      "no-throw-literal": "off",
      // "@typescript-eslint/no-throw-literal": "warn",
      // "typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      // "prettier/prettier": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // "@react/prop-types": "off",
    },
  },

  // React用設定
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/display-name": "off",
      "react/jsx-props-no-spreading": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // 無視設定
  {
    ignores: ["build", "dist", "node_modules"],
  },
];
