import { createContext, useContext } from "react";
import type { Guideline } from "../types/guideline";

interface GuidelineContextValue {
  guideline: Guideline;
  // Lets a <Workflow> child report its presence so <Guideline> can flag
  // unlintable, non-informational guidelines that lack review steps.
  reportWorkflow?: () => void;
}

export const GuidelineContext = createContext<GuidelineContextValue | null>(
  null,
);

// Must be called within a <Guideline> component tree.
export function useGuideline(): Guideline {
  const ctx = useContext(GuidelineContext);
  if (!ctx) throw new Error("useGuideline must be called within a <Guideline>");
  return ctx.guideline;
}
