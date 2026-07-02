import { type ReactNode, type ReactElement } from "react";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import clsx from "clsx";
import type { Guideline as GuidelineData } from "../../../types/guideline";
import { GuidelineContext } from "../../../hooks/useGuideline";
import { useIsInsideGuidelines } from "../Guidelines/GuidelinesContext";
import { NumberCircle } from "../shared/NumberCircle";
import { GuidelineHeader } from "./GuidelineHeader";
import { GuidelineFooter } from "./GuidelineFooter";
import { Details } from "./GuidelineDetails";
import styles from "./Guideline.module.css";

interface GuidelineProps extends GuidelineData {
  children: ReactNode;
}

function GuidelineBase({
  children,
  ...guideline
}: GuidelineProps): ReactElement {
  const isInsideGuidelines = useIsInsideGuidelines();
  useBrokenLinks().collectAnchor(guideline.id);
  const Root = isInsideGuidelines ? "li" : "div";

  return (
    <GuidelineContext.Provider value={{ guideline }}>
      <Root
        className={clsx(styles.root, isInsideGuidelines && styles.numbered)}
        id={guideline.id}
        data-guideline-id={guideline.id}
      >
        {isInsideGuidelines && <NumberCircle />}
        <div className={styles.content}>
          <GuidelineHeader />
          {/* `markdown` makes children inherit Docusaurus' markdown vertical
              rhythm (heading/paragraph/list/admonition spacing), since the
              `.markdown > *` rules only match direct children of a markdown
              container. */}
          <div className={clsx(styles.body, "markdown")}>{children}</div>
          <GuidelineFooter />
        </div>
      </Root>
    </GuidelineContext.Provider>
  );
}

export const Guideline = Object.assign(GuidelineBase, { Details });
