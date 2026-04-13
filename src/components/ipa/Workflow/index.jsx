import React, { useState } from "react";
import styles from "./Workflow.module.css";

/** Collapsible accordion containing numbered evaluation steps for the rule. */
export default function Workflow({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.accordionToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Evaluation workflow
        <span
          className={`${styles.accordionChevron} ${open ? styles.accordionChevronOpen : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}
