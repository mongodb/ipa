import React from "react";
import styles from "./Reason.module.css";

/**
 * Short prose callout explaining *why* a pattern is correct or incorrect —
 * the principle, not a restatement of the rule. Rendered beneath the code block.
 */
export default function Reason({ children }) {
  return (
    <div className={styles.reason}>
      <div className={styles.reasonContent}>{children}</div>
    </div>
  );
}
