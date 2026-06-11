import { type ReactNode, type ReactElement, useEffect, useRef } from "react";
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
  const hasWorkflow = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (guideline.lintable || guideline.informational) return;
    if (!hasWorkflow.current) {
      console.warn(
        `Guideline ${guideline.id} is unlintable and non-informational but ` +
          "has no <Workflow> documenting its manual review steps.",
      );
    }
  }, [guideline.id, guideline.lintable, guideline.informational]);

  return (
    <GuidelineContext.Provider
      value={{
        guideline,
        reportWorkflow: () => {
          hasWorkflow.current = true;
        },
      }}
    >
      <Root
        className={clsx(styles.root, isInsideGuidelines && styles.numbered)}
        data-guideline-id={guideline.id}
      >
        {isInsideGuidelines && <NumberCircle className={styles.index} />}
        <div className={styles.content}>
          <GuidelineHeader />
          <div className={styles.body}>{children}</div>
          <GuidelineFooter />
        </div>
      </Root>
    </GuidelineContext.Provider>
  );
}
