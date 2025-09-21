import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "react-you-might-not-need-an-effect": reactYouMightNotNeedAnEffect,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactYouMightNotNeedAnEffect.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },
];

export default eslintConfig;
