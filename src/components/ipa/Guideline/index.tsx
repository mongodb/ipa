import { type ReactNode, type ReactElement } from "react";
import clsx from "clsx";
import type { Guideline } from "../../../types/guideline";
import { GuidelineContext } from "../../../hooks/useGuideline";
import { useIsInsideGuidelines } from "../Guidelines/GuidelinesContext";
import { NumberCircle } from "../shared/NumberCircle";
import { GuidelineHeader } from "./GuidelineHeader";
import { GuidelineFooter } from "./GuidelineFooter";
import styles from "./Guideline.module.css";

interface GuidelineProps extends Guideline {
  children: ReactNode;
}

export function Guideline({
  children,
  ...guideline
}: GuidelineProps): ReactElement {
  const isInsideGuidelines = useIsInsideGuidelines();
  const Root = isInsideGuidelines ? "li" : "div";

  return (
    <GuidelineContext.Provider value={{ guideline }}>
      <Root
        className={clsx(styles.root, isInsideGuidelines && styles.numbered)}
        data-guideline-id={guideline.id}
      >
        {isInsideGuidelines && <NumberCircle />}
        <div className={styles.content}>
          <GuidelineHeader />
          <div className={styles.body}>{children}</div>
          <GuidelineFooter />
        </div>
      </Root>
    </GuidelineContext.Provider>
  );
}
