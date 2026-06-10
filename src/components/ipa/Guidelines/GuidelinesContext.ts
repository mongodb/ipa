import { createContext, useContext } from "react";

const GuidelinesContext = createContext(false);

export const GuidelinesProvider = GuidelinesContext.Provider;

export function useIsInsideGuidelines(): boolean {
  return useContext(GuidelinesContext);
}
