import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { principleSchema, type Principle } from "../types/ipa";

// Must be called within a Docusaurus doc page context (useDoc throws otherwise).
// Throws if the current page is not a valid IPA principle document.
export function usePrinciple(): Principle {
  const { frontMatter } = useDoc();
  const parsed = principleSchema.safeParse(frontMatter);
  if (!parsed.success) {
    throw new Error("usePrinciple must be called on an IPA principle page");
  }
  return parsed.data;
}
