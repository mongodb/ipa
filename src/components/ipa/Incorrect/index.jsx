import React from "react";
import styles from "./Incorrect.module.css";

/** A violating example — code block plus an optional Reason child. */
export default function Incorrect({ children }) {
  return (
    <div className={styles.example}>
      <div className={styles.exampleHeader}>
        <span className={styles.incorrectIcon} aria-hidden="true">
          ✗
        </span>
        <span className={styles.incorrectLabel}>Incorrect</span>
      </div>
      <div className={styles.exampleBody}>{children}</div>
    </div>
  );
}
