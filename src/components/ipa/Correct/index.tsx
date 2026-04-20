import React from "react";
import styles from "./Correct.module.css";

interface CorrectProps {
  children: React.ReactNode;
}

/** A compliant example — code block plus an optional Reason child. */
export default function Correct({ children }: CorrectProps) {
  return (
    <div className={styles.example}>
      <div className={styles.exampleHeader}>
        <span className={styles.correctIcon} aria-hidden="true">
          ✓
        </span>
        <span className={styles.correctLabel}>Correct</span>
      </div>
      <div className={styles.exampleBody}>{children}</div>
    </div>
  );
}
