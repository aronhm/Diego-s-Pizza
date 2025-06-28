/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  extends: ["plugin:astro/recommended", "plugin:svelte/recommended"],
  rules: {
    "no-unused-vars": "error",
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        "astro/no-unused-css-selector": "error",
      },
    },
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
};
