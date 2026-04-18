import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // shadcn/ui scaffolding: empty interfaces extending HTML element props are
  // an idiomatic shadcn pattern, and these files mix component exports with
  // helper hooks/variants by design. Silencing rules here keeps app code strict.
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  // i18n module exports both the provider component and the useI18n hook /
  // translations object — splitting would hurt DX. HMR still works for the app.
  {
    files: ["src/lib/i18n.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  // Tailwind config requires CommonJS `require()` for plugins per Tailwind's API.
  {
    files: ["tailwind.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
