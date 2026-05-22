import React from "react";
import type { Guideline } from "../types/guideline";

interface GuidelineContextValue {
  guideline: Guideline;
}

export const GuidelineContext =
  React.createContext<GuidelineContextValue | null>(null);

// Must be called within a <Guideline> component tree.
export function useGuideline(): Guideline {
  const ctx = React.useContext(GuidelineContext);
  if (!ctx) throw new Error("useGuideline must be called within a <Guideline>");
  return ctx.guideline;
}
