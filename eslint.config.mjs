import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  globalIgnores(["./dist/**"]),
);
