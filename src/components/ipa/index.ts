export { default as RulesSection } from "./RulesSection";
export { default as Rule } from "./Rule";
// IpaMetadata is consumed by the DocItem/Content swizzle automatically;
// exported here for direct use if ever needed.
export { default as IpaMetadata } from "./IpaMetadata";

// Badge lives in ui/ since it is a generic primitive, not IPA-specific.
export { default as Badge } from "../ui/Badge";
