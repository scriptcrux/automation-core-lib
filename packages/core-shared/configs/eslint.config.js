import tseslint from 'typescript-eslint';

export const companyAutomationRules = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "semi": ["error", "always"],
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "error"
    }
  }
];
