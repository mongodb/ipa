import { type ReactNode, type ReactElement } from "react";
import { Accordion } from "@site/src/components/ui";
import styles from "./GuidelineDetails.module.css";

interface DetailsProps {
  title?: string;
  children: ReactNode;
}

export function Details({ title, children }: DetailsProps): ReactElement {
  return (
    <Accordion
      title={title ?? "Details"}
      className={styles.root}
      contentClassName={styles.content}
    >
      {children}
    </Accordion>
  );
}

Details.displayName = "Guideline.Details";
