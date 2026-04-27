import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect } from "vitest";

import Guidelines from "./index";

describe("<Guidelines>", () => {
  it("renders its children unchanged", () => {
    const html = renderToStaticMarkup(
      <Guidelines>
        <p data-testid="child">hello</p>
      </Guidelines>,
    );

    expect(html).toContain('data-testid="child"');
    expect(html).toContain("hello");
  });

  it("wraps children in a section element", () => {
    const html = renderToStaticMarkup(
      <Guidelines>
        <p>one</p>
        <p>two</p>
      </Guidelines>,
    );

    expect(html).toMatch(/^<section /);
    expect(html).toContain("one");
    expect(html).toContain("two");
  });
});
