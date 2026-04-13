export { default as RulesSection } from "./RulesSection";
export { default as Rule } from "./Rule";
export { default as Examples } from "./Examples";
export { default as Correct } from "./Correct";
export { default as Incorrect } from "./Incorrect";
export { default as Reason } from "./Reason";
export { default as Workflow } from "./Workflow";
// IpaMetadata is consumed by the DocItem/Content swizzle automatically;
// exported here for direct use if ever needed.
export { default as IpaMetadata } from "./IpaMetadata";

// Badge lives in ui/ since it is a generic primitive, not IPA-specific.
export { default as Badge } from "../ui/Badge";
