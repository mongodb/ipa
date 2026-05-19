import React from "react";
import Content from "@theme-original/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { PrincipleHeader } from "@site/src/components/ipa";
import { principleSchema } from "@site/src/types/ipa";

type Props = WrapperProps<typeof Content>;

export default function ContentWrapper(props: Props): React.ReactElement {
  const { frontMatter } = useDoc();
  const parsed = principleSchema.safeParse(frontMatter);

  return (
    <>
      {parsed.success && <PrincipleHeader principle={parsed.data} />}
      <Content {...props} />
    </>
  );
}
