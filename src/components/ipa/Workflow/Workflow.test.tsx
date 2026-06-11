import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Workflow } from "./index";

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
