import React from "react";
import shared from "../ExampleBlock.module.css";
import styles from "./Incorrect.module.css";

interface IncorrectProps {
  children: React.ReactNode;
}

/** A violating example — code block plus an optional Reason child. */
export default function Incorrect({ children }: IncorrectProps) {
  return (
    <div className={shared.example}>
      <div className={shared.exampleHeader}>
        <span className={styles.incorrectIcon} aria-hidden="true">
          ✗
        </span>
        <span className={styles.incorrectLabel}>Incorrect</span>
      </div>
      <div className={shared.exampleBody}>{children}</div>
    </div>
  );
}
