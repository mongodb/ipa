import { type ReactElement, type ReactNode } from "react";
import { Accordion, CheckIcon, CrossIcon } from "@site/src/components/ui";
import { type ExampleType } from "./types";
import styles from "./Example.module.css";

interface ExampleProps {
  type: ExampleType;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
}

function ExampleBase({
  type,
  title,
  icon,
  children,
}: ExampleProps): ReactElement {
  const defaultIcon =
    type === "correct" ? (
      <CheckIcon className={styles.icon} />
    ) : (
      <CrossIcon className={styles.icon} />
    );
  const renderedIcon = icon ?? defaultIcon;
  const defaultTitle = type === "correct" ? "Correct" : "Incorrect";

  return (
    <div className={`${styles.example} ${styles[type] ?? ""}`}>
      <Accordion
        defaultOpen
        className={styles.accordionFlush}
        title={
          <>
            {renderedIcon}
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
