import React, { useState, useId } from "react";
import styles from "./Accordion.module.css";

interface AccordionProps {
  label: string;
  children: React.ReactNode;
}

/** Reusable collapsible accordion section. */
export default function Accordion({ label, children }: AccordionProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.accordionToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
      >
        {label}
        <span
          className={`${styles.accordionChevron} ${open ? styles.accordionChevronOpen : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && (
        <div id={contentId} className={styles.accordionContent}>
          {children}
        </div>
      )}
    </div>
  );
}
