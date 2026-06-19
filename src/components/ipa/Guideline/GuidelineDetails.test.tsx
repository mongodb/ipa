import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Details } from "./GuidelineDetails";

describe("<Guideline.Details>", () => {
  it("renders a collapsed accordion titled 'Details' with its children", () => {
    render(<Details>body</Details>);
    const toggle = screen.getByRole("button", { name: "Details" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("uses an explicit title prop over the default", () => {
    render(<Details title="Schema examples">body</Details>);

    expect(
      screen.getByRole("button", { name: "Schema examples" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Details" })).toBeNull();
  });
});
