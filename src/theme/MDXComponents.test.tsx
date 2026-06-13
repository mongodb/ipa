import { describe, it, expect, vi } from "vitest";

// The IPA components transitively import Docusaurus client modules (the docs
// client via usePrinciple, the site context via Workflow); stub both so the
// barrel resolves under vitest.
vi.mock("@docusaurus/plugin-content-docs/client", () => ({
  useDoc: () => ({ frontMatter: { id: 1, state: "adopt" } }),
}));

vi.mock("@docusaurus/useDocusaurusContext", () => ({
  default: () => ({ siteConfig: { customFields: {} } }),
}));

import MDXComponents from "./MDXComponents";
import {
  Guidelines,
  Guideline,
  Example,
  Workflow,
} from "@site/src/components/ipa";

describe("theme/MDXComponents", () => {
  it("registers the IPA authoring components in global MDX scope", () => {
    expect(MDXComponents.Guidelines).toBe(Guidelines);
    expect(MDXComponents.Guideline).toBe(Guideline);
    expect(MDXComponents.Example).toBe(Example);
    expect(MDXComponents.Workflow).toBe(Workflow);
  });

  it("preserves the original theme MDX components", () => {
    expect(MDXComponents.code).toBeDefined();
    expect(MDXComponents.a).toBeDefined();
  });
});
