import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Guidelines } from "./index";
import { Guideline } from "../Guideline";
import type { Guideline as GuidelineData } from "../../../types/guideline";

vi.mock("@docusaurus/plugin-content-docs/client", () => ({
  useDoc: () => ({ frontMatter: { id: 1, state: "adopt" } }),
}));

const minimalGuideline = {
  id: "IPA-0001-must-test-a",
  informational: true,
  lintable: false,
  implementation: false,
  effort: "check",
} satisfies GuidelineData;

describe("<Guidelines>", () => {
  it("renders as an ordered list", () => {
    render(
      <Guidelines>
        <Guideline {...minimalGuideline}>content</Guideline>
      </Guidelines>,
    );
    const list = screen.getByTestId("guidelines");

    expect(list.tagName).toBe("OL");
    expect(list.children).toHaveLength(1);
    expect(list.children[0].tagName).toBe("LI");
    expect(screen.getByText("content").closest("li")).toBeInTheDocument();
  });

  it("wraps guidelines in a styled container", () => {
    render(
      <Guidelines>
        <Guideline {...minimalGuideline} id="IPA-0001-must-test-a">
          one
        </Guideline>
        <Guideline {...minimalGuideline} id="IPA-0001-must-test-b">
          two
        </Guideline>
      </Guidelines>,
    );

    const wrapper = screen.getByTestId("guidelines");
    expect(
      wrapper.querySelector("[data-guideline-id='IPA-0001-must-test-a']"),
    ).toBeInTheDocument();
    expect(
      wrapper.querySelector("[data-guideline-id='IPA-0001-must-test-b']"),
    ).toBeInTheDocument();
  });

  it("renders a circle for each <Guideline> child", () => {
    render(
      <Guidelines>
        <Guideline {...minimalGuideline} id="IPA-0001-must-test-a">
          first
        </Guideline>
        <Guideline {...minimalGuideline} id="IPA-0001-must-test-b">
          second
        </Guideline>
        <Guideline {...minimalGuideline} id="IPA-0001-must-test-c">
          third
        </Guideline>
      </Guidelines>,
    );

    // One circle per guideline; CSS counter provides the number via ::before.
    const circles = document.querySelectorAll(
      "[data-guideline-id] [aria-hidden='true']",
    );
    expect(circles).toHaveLength(3);
  });

  it("renders as an ordered list", () => {
    render(
      <Guidelines>
        <li data-testid="item">item</li>
      </Guidelines>,
    );

    expect(screen.getByTestId("guidelines").tagName).toBe("OL");
  });
});
