import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Guideline } from "./index";
import type { Guideline as GuidelineData } from "../../../types/guideline";

vi.mock("@docusaurus/plugin-content-docs/client", () => ({
  useDoc: () => ({ frontMatter: { id: 1, state: "adopt" } }),
}));

const minimalGuideline = {
  id: "IPA-001-must-test-a",
  informational: true,
  lintable: false,
  implementation: false,
  effort: "check",
} satisfies GuidelineData;

describe("<Guideline> standalone", () => {
  it("renders as a standalone block without a numbering circle", () => {
    render(<Guideline {...minimalGuideline}>content</Guideline>);
    const guideline = document.querySelector("[data-guideline-id]");

    expect(guideline?.tagName).toBe("DIV");
    expect(
      document.querySelector("[data-guideline-id] [aria-hidden='true']"),
    ).toBeNull();
  });
});
