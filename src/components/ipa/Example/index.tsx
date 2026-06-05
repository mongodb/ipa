import { type ReactElement, type ReactNode } from "react";
import { Accordion } from "@site/src/components/ui";
import { type ExampleType } from "./types";
import styles from "./Example.module.css";

interface ExampleProps {
  type: ExampleType;
  title?: string;
  children: ReactNode;
}

function ExampleBase({ type, title, children }: ExampleProps): ReactElement {
  const icon = type === "correct" ? "✓" : "✗";
  const defaultTitle = type === "correct" ? "Correct" : "Incorrect";

  return (
    <div className={`${styles.example} ${styles[type] ?? ""}`}>
      <Accordion
        defaultOpen
        className={styles.accordionFlush}
        title={
          <>
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
            <span>{title ?? defaultTitle}</span>
          </>
        }
        titleClassName={styles.header}
        contentClassName={styles.content}
      >
        {children}
      </Accordion>
    </div>
  );
}

const CorrectExample = (props: Omit<ExampleProps, "type">): ReactElement => (
  <ExampleBase {...props} type="correct" />
);
CorrectExample.displayName = "Correct";

const IncorrectExample = (props: Omit<ExampleProps, "type">): ReactElement => (
  <ExampleBase {...props} type="incorrect" />
);
IncorrectExample.displayName = "Incorrect";

export const Example = Object.assign(ExampleBase, {
  Correct: CorrectExample,
  Incorrect: IncorrectExample,
});
