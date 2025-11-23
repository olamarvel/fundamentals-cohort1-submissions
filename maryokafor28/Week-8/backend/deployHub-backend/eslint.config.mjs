// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Ignore patterns first
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.js"],
  },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Apply to all TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Turn off base rule for TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Special config for test files (no strict type checking)
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Don't use project for test files
        project: false,
      },
    },
  },
];
