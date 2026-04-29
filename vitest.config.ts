import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Docusaurus' tsconfig uses `jsx: preserve` because its build pipeline
// transforms JSX downstream. Vitest doesn't run through that pipeline,
// so it needs the canonical React + Vite plugin to transform JSX in
// `.tsx` test files.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Docusaurus CSS modules don't carry meaning in unit tests; skip
    // CSS processing so tests stay fast and focus on behaviour.
    css: false,
  },
});
