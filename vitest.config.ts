import { defineConfig } from "vitest/config";

export default defineConfig({
  // The repo's tsconfig uses `jsx: preserve` for Docusaurus, so vitest /
  // oxc needs to be told how to transform JSX in `.tsx` test files.
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
