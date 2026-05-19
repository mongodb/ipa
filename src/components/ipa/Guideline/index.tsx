import React from "react";
import type { Guideline } from "../../../types/guideline";
import { GuidelineContext } from "../../../hooks/useGuideline";
import { GuidelineHeader } from "./GuidelineHeader";
import { GuidelineFooter } from "./GuidelineFooter";
import styles from "./Guideline.module.css";

interface GuidelineProps extends Guideline {
  index?: number;
  children: React.ReactNode;
}

export function Guideline({ index, children, ...guideline }: GuidelineProps) {
  return (
    <GuidelineContext.Provider value={{ guideline }}>
      <div className={styles.root} data-guideline-id={guideline.id}>
        <div className={styles.index}>
          {index ?? "·"}
        </div>
        <div className={styles.container}>
          <GuidelineHeader />
          <div className={styles.content}>{children}</div>
          <GuidelineFooter />
        </div>
      </div>
    </GuidelineContext.Provider>
  );
}
