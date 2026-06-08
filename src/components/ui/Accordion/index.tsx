import { ReactNode, ReactElement, useState, useId } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";

export interface AccordionProps {
  title?: ReactNode;
  titleClassName?: string;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function Accordion({
  title,
  titleClassName,
  defaultOpen = false,
  className,
  contentClassName,
  children,
}: AccordionProps): ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={clsx(styles.container, className)}>
      <div role="heading" aria-level={3} className={styles.heading}>
        <button
          id={buttonId}
          className={clsx(styles.toggle, titleClassName)}
          onClick={() => setIsOpen((v) => !v)}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className={styles.label}>{title}</span>
          <span
            aria-hidden="true"
            className={styles.chevron}
            data-open={isOpen}
          >
            ▾
          </span>
        </button>
      </div>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={clsx(
          styles.content,
          contentClassName,
          !isOpen && styles.contentHidden,
        )}
      >
        {children}
      </div>
    </div>
  );
}
