import React from "react";
import Accordion from "../../ui/Accordion";

/** Collapsible accordion containing numbered evaluation steps for the rule. */
export default function Workflow({ children }: { children: React.ReactNode }) {
  return <Accordion label="Evaluation workflow">{children}</Accordion>;
}
