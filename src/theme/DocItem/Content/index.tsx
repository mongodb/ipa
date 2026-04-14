import React from "react";
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
