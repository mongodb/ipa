import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

import { Workflow } from "./index";
import { Guideline } from "../Guideline";
import type { Guideline as GuidelineData } from "../../../types/guideline";

vi.mock("@docusaurus/plugin-content-docs/client", () => ({
  useDoc: () => ({ frontMatter: { id: 1, state: "adopt" } }),
}));

const lintableGuideline = {
  id: "IPA-0001-must-test-a",
  lintable: true,
  informational: false,
  implementation: false,
  effort: "check",
  given: "spec",
} satisfies GuidelineData;

const unlintableGuideline = {
  ...lintableGuideline,
  lintable: false,
} satisfies GuidelineData;

describe("<Workflow>", () => {
  it("renders a collapsed accordion titled 'Evaluation workflow'", () => {
    render(
      <Workflow>
        <Workflow.Step>Scan every user-facing string.</Workflow.Step>
      </Workflow>,
    );
    const toggle = screen.getByRole("button", {
      name: /evaluation workflow/i,
    });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("renders each step as a list item of an ordered list", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );
    const list = screen.getByTestId("workflow-steps");

    expect(list.tagName).toBe("OL");
    expect(list.children).toHaveLength(2);
    expect(list.children[0].tagName).toBe("LI");
    expect(screen.getByText("first step").closest("li")).toBeInTheDocument();
  });

  it("throws when a step is rendered outside a <Workflow>", () => {
    // React logs render-phase throws to console.error; keep test output clean.
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Workflow.Step>orphan</Workflow.Step>)).toThrow(
      /<Workflow.Step> must be rendered inside a <Workflow>/,
    );

    error.mockRestore();
  });

  it("renders a custom title instead of the default", () => {
    render(
      <Workflow title="Implementation steps">
        <Workflow.Step>only step</Workflow.Step>
      </Workflow>,
    );

    expect(
      screen.getByRole("button", { name: /implementation steps/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/evaluation workflow/i)).toBeNull();
  });
});

describe("<Workflow> reading list", () => {
  it("renders no interactive controls besides the accordion toggle", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByText(/progress is kept/i)).toBeNull();
  });

  it("numbers each step with a decorative counter", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );
    const list = screen.getByTestId("workflow-steps");

    // Numbering follows the <Guidelines> pattern: an empty aria-hidden
    // element whose number comes from a CSS counter, not injected props.
    const counters = list.querySelectorAll("[class*='stepNum']");
    expect(counters).toHaveLength(2);
    counters.forEach((counter) => {
      expect(counter).toHaveAttribute("aria-hidden", "true");
      expect(counter).toBeEmptyDOMElement();
    });
  });

  it("renders steps nested inside wrapper elements", () => {
    render(
      <Workflow>
        <Workflow.Step>direct step</Workflow.Step>
        <div>
          <Workflow.Step>wrapped step</Workflow.Step>
        </div>
      </Workflow>,
    );

    expect(screen.getByText("direct step")).toBeInTheDocument();
    expect(screen.getByText("wrapped step")).toBeInTheDocument();
  });
});

describe("<Guideline> workflow cross-field check", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns in development when an unlintable, non-informational guideline lacks a <Workflow>", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Guideline {...unlintableGuideline}>body</Guideline>);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("IPA-0001-must-test-a"),
    );
  });

  it("does not warn when the guideline contains a <Workflow>", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Guideline {...unlintableGuideline}>
        <Workflow>
          <Workflow.Step>only step</Workflow.Step>
        </Workflow>
      </Guideline>,
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn for lintable or informational guidelines", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Guideline {...lintableGuideline}>body</Guideline>);
    render(
      <Guideline {...unlintableGuideline} informational>
        body
      </Guideline>,
    );

    expect(warn).not.toHaveBeenCalled();
  });
});
