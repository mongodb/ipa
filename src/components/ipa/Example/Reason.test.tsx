import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Example } from "./index";

describe("<Example.Reason>", () => {
  it("renders the explanation prose", () => {
    render(
      <Example.Reason>Merge-patch is simpler for clients.</Example.Reason>,
    );

    expect(
      screen.getByText(/merge-patch is simpler for clients/i),
    ).toBeInTheDocument();
  });

  it("renders a 'Why:' lead-in", () => {
    render(<Example.Reason>Some explanation.</Example.Reason>);

    expect(screen.getByText("Why:")).toBeInTheDocument();
  });

  it("accepts paragraph children without invalid DOM nesting", () => {
    // MDX wraps indented multi-line children in <p>, so the component's
    // container must not itself be a <p> (React warns via console.error).
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Example.Reason>
        <p>First sentence of the reason.</p>
      </Example.Reason>,
    );

    expect(
      screen.getByText(/first sentence of the reason/i),
    ).toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();

    error.mockRestore();
  });

  it("renders inside an example beneath its code block", () => {
    render(
      <Example.Correct>
        <pre>
          <code>name: list-resources</code>
        </pre>
        <Example.Reason>The name field is required.</Example.Reason>
      </Example.Correct>,
    );

    expect(screen.getByText(/the name field is required/i)).toBeInTheDocument();
    expect(screen.getByText("Why:")).toBeInTheDocument();
  });
});
