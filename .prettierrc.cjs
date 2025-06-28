module.exports = {
  plugins: [
    require.resolve("prettier-plugin-astro"),
    require.resolve("prettier-plugin-svelte"),
  ],
  overrides: [
    {
      files: "**/*.astro",
      options: { parser: "astro" },
    },
    {
      files: "**/*.svelte",
      options: { parser: "svelte" },
    },
  ],
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  useTabs: false,
};
