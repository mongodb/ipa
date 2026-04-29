// Vitest test setup.
//
// - Adds @testing-library/jest-dom matchers (`toBeInTheDocument`,
//   `toHaveTextContent`, etc.) to Vitest's `expect`.
// - Future home for Docusaurus module mocks (e.g. `@docusaurus/Link`,
//   `useDocusaurusContext`) when components start importing from
//   `@docusaurus/*` and need stubs at unit-test time.

import "@testing-library/jest-dom/vitest";
