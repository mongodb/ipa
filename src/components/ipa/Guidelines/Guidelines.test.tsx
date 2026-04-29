import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Guidelines } from "./index";

describe("<Guidelines>", () => {
  it("renders its children unchanged", () => {
    render(
      <Guidelines>
        <p data-testid="child">hello</p>
      </Guidelines>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("wraps children in a styled container", () => {
    render(
      <Guidelines>
        <p data-testid="first">one</p>
        <p data-testid="second">two</p>
      </Guidelines>,
    );

    const wrapper = screen.getByTestId("guidelines");
    expect(wrapper).toContainElement(screen.getByTestId("first"));
    expect(wrapper).toContainElement(screen.getByTestId("second"));
  });
});
