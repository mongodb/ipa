import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const mdxComponentStub = fileURLToPath(
  new URL("./test/stubs/mdx-component.ts", import.meta.url),
);

// Docusaurus' tsconfig uses `jsx: preserve` because its build pipeline
// transforms JSX downstream. Vitest doesn't run through that pipeline,
// so it needs the canonical React + Vite plugin to transform JSX in
// `.tsx` test files.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Docusaurus aliases @site to the repo root; tests must match.
    alias: {
      "@site": fileURLToPath(new URL(".", import.meta.url)),
      "@docusaurus/useDocusaurusContext":
        "@docusaurus/core/lib/client/exports/useDocusaurusContext",
      // Docusaurus theme aliases are generated during a Docusaurus build and
      // don't resolve under vitest; stub the theme components imported by swizzles.
      "@docusaurus/Head": mdxComponentStub,
      "@theme/Admonition": mdxComponentStub,
      "@theme/Mermaid": mdxComponentStub,
      "@theme-original/MDXComponents/A": mdxComponentStub,
      "@theme-original/MDXComponents/Code": mdxComponentStub,
      "@theme-original/MDXComponents/Details": mdxComponentStub,
      "@theme-original/MDXComponents/Heading": mdxComponentStub,
      "@theme-original/MDXComponents/Img": mdxComponentStub,
      "@theme-original/MDXComponents/Li": mdxComponentStub,
      "@theme-original/MDXComponents/Pre": mdxComponentStub,
      "@theme-original/MDXComponents/Ul": mdxComponentStub,
    },
  },
  test: {
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
    environment: "jsdom",
    // Enables vitest's `afterEach` global so React Testing Library's
    // automatic DOM cleanup between tests fires.
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Docusaurus CSS modules don't carry meaning in unit tests; skip
    // CSS processing so tests stay fast and focus on behaviour.
    css: false,
  },
});
