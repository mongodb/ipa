import React from "react";
import Accordion from "../../ui/Accordion";

/** Collapsible accordion containing Correct and Incorrect example blocks. */
export default function Examples({ children }: { children: React.ReactNode }) {
  return <Accordion label="Examples">{children}</Accordion>;
}
