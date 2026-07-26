import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",

      // Históricos conservados temporalmente fuera del tooling activo.
      "BACKUP_PRODUCT_DETAIL_BLOCK_0_20260725_205950/**",
      "BACKUP_PRODUCT_STATUS_20260725_193549/**",
      "BACKUP_PRODUCT_STATUS_20260725_194057/**",
      "BACKUP_PRODUCT_STATUS_CHANNELS_20260725_200316/**",
      "BACKUP_PRODUCT_STATUS_UI_CART_20260725_194842/**",
      "BlueprintBackups/**",
      "TierDesignSystemBackup_20260721_090122/**",
      "TierDesignSystemBackup_20260721_092019/**",
    ],
  },
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
);
