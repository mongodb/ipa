import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useBrokenLinks from "@docusaurus/useBrokenLinks";

import { Guideline } from "./index";
import type { Guideline as GuidelineData } from "../../../types/guideline";

vi.mock("@docusaurus/plugin-content-docs/client", () => ({
  useDoc: () => ({ frontMatter: { id: 1, state: "adopt" } }),
}));

const minimalGuideline = {
  id: "IPA-001-must-test-a",
  enforcement: "advisory",
  implementation: false,
  effort: "check",
} satisfies GuidelineData;

describe("<Guideline> standalone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders as a standalone block without a numbering circle", () => {
    render(<Guideline {...minimalGuideline}>content</Guideline>);
    const guideline = document.querySelector("[data-guideline-id]");

    expect(guideline?.tagName).toBe("DIV");
    expect(guideline).toHaveAttribute("id", "IPA-001-must-test-a");
    expect(
      document.querySelector("[data-guideline-id] [aria-hidden='true']"),
    ).toBeNull();
  });

  it("registers the guideline anchor with the Docusaurus broken-link checker", () => {
    const { collectAnchor } = vi.mocked(useBrokenLinks)();
    render(<Guideline {...minimalGuideline}>content</Guideline>);
    expect(collectAnchor).toHaveBeenCalledWith("IPA-001-must-test-a");
  });
});
