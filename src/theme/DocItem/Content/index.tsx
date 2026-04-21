/**
 * Swizzle wrapper for @theme/DocItem/Content (wrap mode).
 *
 * Injects <IpaPageMeta> above the page title for any doc that declares
 * a `state` key in its frontmatter. The component reads frontmatter itself
 * via useDoc(), so individual doc files need no JSX imports.
 *
 * DOM position: inside the <article>, before the <div class="markdown"> wrapper,
 * which places it visually above the h1.
 */
import React from "react"; // required for JSX transform in this Docusaurus version
import Content from "@theme-original/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import IpaMetadata from "@site/src/components/ipa/IpaMetadata";

type Props = WrapperProps<typeof Content>;

export default function ContentWrapper(props: Props): React.ReactElement {
  return (
    <>
      <IpaMetadata />
      <Content {...props} />
    </>
  );
}
