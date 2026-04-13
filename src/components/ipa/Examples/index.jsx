import React, { useState } from "react";
import styles from "./Examples.module.css";

/** Collapsible accordion containing Correct and Incorrect example blocks. */
export default function Examples({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.accordionToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Examples
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
