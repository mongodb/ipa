import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// The repo's tsconfig uses `jsx: preserve` for Docusaurus' build pipeline.
// Vitest doesn't go through that pipeline, so it needs the canonical
// React + Vite plugin to transform JSX in `.tsx` test files.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
