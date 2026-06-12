import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Reason } from "./index";

describe("<Reason>", () => {
  it("renders the explanation prose", () => {
    render(<Reason>Merge-patch is simpler for clients.</Reason>);

    expect(
      screen.getByText(/merge-patch is simpler for clients/i),
    ).toBeInTheDocument();
  });

  it("renders a 'Why:' lead-in", () => {
    render(<Reason>Some explanation.</Reason>);

    expect(screen.getByText("Why:")).toBeInTheDocument();
  });

  it("accepts paragraph children without invalid DOM nesting", () => {
    // MDX wraps indented multi-line children in <p>, so the component's
    // container must not itself be a <p> (React warns via console.error).
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Reason>
        <p>First sentence of the reason.</p>
      </Reason>,
    );

    expect(
      screen.getByText(/first sentence of the reason/i),
    ).toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();

    error.mockRestore();
  });
});
