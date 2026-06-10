import { fireEvent, render, screen } from "@testing-library/react";
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

describe("<Workflow> review checklist", () => {
  it("renders an unchecked checkbox for each step", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(2);
    checkboxes.forEach((box) => expect(box).not.toBeChecked());
  });

  it("updates the progress chip when a step is verified", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );

    expect(screen.getByText("0 of 2 verified")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    expect(screen.getByText("1 of 2 verified")).toBeInTheDocument();
  });

  it("turns the progress chip green only when all steps are verified", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );
    const chip = () => screen.getByTestId("workflow-progress");

    expect(chip().querySelector("[data-color='muted']")).not.toBeNull();

    screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box));

    expect(screen.getByText("2 of 2 verified")).toBeInTheDocument();
    expect(chip().querySelector("[data-color='green']")).not.toBeNull();
  });

  it("resets all verified steps", () => {
    render(
      <Workflow>
        <Workflow.Step>first step</Workflow.Step>
        <Workflow.Step>second step</Workflow.Step>
      </Workflow>,
    );
    const reset = screen.getByRole("button", { name: /reset/i });

    expect(reset).toBeDisabled();

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(reset).toBeEnabled();

    fireEvent.click(reset);

    expect(screen.getByText("0 of 2 verified")).toBeInTheDocument();
    screen
      .getAllByRole("checkbox")
      .forEach((box) => expect(box).not.toBeChecked());
  });
});

describe("<Workflow> inside a lintable guideline", () => {
  it("shows a reference-only marker when the parent guideline is lintable", () => {
    render(
      <Guideline {...lintableGuideline}>
        <Workflow>
          <Workflow.Step>only step</Workflow.Step>
        </Workflow>
      </Guideline>,
    );

    expect(
      screen.getByText(/reference only — agent skips/i),
    ).toBeInTheDocument();
  });

  it("shows no marker when the parent guideline is unlintable", () => {
    render(
      <Guideline {...unlintableGuideline}>
        <Workflow>
          <Workflow.Step>only step</Workflow.Step>
        </Workflow>
      </Guideline>,
    );

    expect(screen.queryByText(/reference only/i)).toBeNull();
  });

  it("shows no marker when rendered outside a guideline", () => {
    render(
      <Workflow>
        <Workflow.Step>only step</Workflow.Step>
      </Workflow>,
    );

    expect(screen.queryByText(/reference only/i)).toBeNull();
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
