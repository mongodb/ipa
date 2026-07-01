// Vitest test setup.
//
// - Adds @testing-library/jest-dom matchers (`toBeInTheDocument`,
//   `toHaveTextContent`, etc.) to Vitest's `expect`.
// - Future home for Docusaurus module mocks (e.g. `@docusaurus/Link`,
//   `useDocusaurusContext`) when components start importing from
//   `@docusaurus/*` and need stubs at unit-test time.

import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

vi.mock("@docusaurus/Link", () => ({
  default: ({ to, href, children, ...props }: any) =>
    createElement("a", { href: to ?? href, ...props }, children),
}));

const _brokenLinksMock = { collectAnchor: vi.fn(), collectLink: vi.fn() };
vi.mock("@docusaurus/useBrokenLinks", () => ({
  default: vi.fn(() => _brokenLinksMock),
}));
