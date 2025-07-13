import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "out/**",
      ".next/**",
      "dist/**",
      "build/**",
      "node_modules/**",
      "ios/**",
      "android/**",
      "public/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "jest.config.js",
      "jest.setup.js",
      "postcss.config.js",
      "postcss.config.mjs",
      "tailwind.config.js",
      "next.config.ts",
      "capacitor.config.ts",
      "firestore.rules"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "no-underscore-dangle": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "camelcase": "off"
    }
  }
];

export default eslintConfig;
