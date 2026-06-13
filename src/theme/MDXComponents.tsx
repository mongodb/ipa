import React, { type ComponentProps } from "react";
import Head from "@docusaurus/Head";
import Admonition from "@theme/Admonition";
import Mermaid from "@theme/Mermaid";
import MDXA from "@theme-original/MDXComponents/A";
import MDXCode from "@theme-original/MDXComponents/Code";
import MDXDetails from "@theme-original/MDXComponents/Details";
import MDXHeading from "@theme-original/MDXComponents/Heading";
import MDXImg from "@theme-original/MDXComponents/Img";
import MDXLi from "@theme-original/MDXComponents/Li";
import MDXPre from "@theme-original/MDXComponents/Pre";
import MDXUl from "@theme-original/MDXComponents/Ul";
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
  Head,
  details: MDXDetails,
  Details: MDXDetails,
  code: MDXCode,
  a: MDXA,
  pre: MDXPre,
  ul: MDXUl,
  li: MDXLi,
  img: MDXImg,
  h1: (props: ComponentProps<"h1">) => <MDXHeading as="h1" {...props} />,
  h2: (props: ComponentProps<"h2">) => <MDXHeading as="h2" {...props} />,
  h3: (props: ComponentProps<"h3">) => <MDXHeading as="h3" {...props} />,
  h4: (props: ComponentProps<"h4">) => <MDXHeading as="h4" {...props} />,
  h5: (props: ComponentProps<"h5">) => <MDXHeading as="h5" {...props} />,
  h6: (props: ComponentProps<"h6">) => <MDXHeading as="h6" {...props} />,
  admonition: Admonition,
  mermaid: Mermaid,
  Guidelines,
  Guideline,
  Example,
  Workflow,
};
