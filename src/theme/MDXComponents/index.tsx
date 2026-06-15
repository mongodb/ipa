import MDXComponents from "@theme-original/MDXComponents";
import {
  Guidelines,
  Guideline,
  Example,
  Workflow,
} from "@site/src/components/ipa";

// Register the IPA authoring components in Docusaurus' global MDX scope so
// guideline documents can use <Guidelines>, <Guideline>, <Example.*>, and
// <Workflow> without an import in every file. PrincipleHeader is intentionally
// omitted — it is auto-injected from frontmatter by the DocItem/Content
// swizzle, not authored inline.
export default {
  ...MDXComponents,
  Guidelines,
  Guideline,
  Example,
  Workflow,
};
