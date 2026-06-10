import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import { Accordion, Badge } from "../../ui";
import { GuidelineContext } from "../../../hooks/useGuideline";
import styles from "./Workflow.module.css";

interface WorkflowProps {
  title?: string;
  children: ReactNode;
}

interface WorkflowStepProps {
  children: ReactNode;
  // Injected by <Workflow> — not part of the authoring API.
  checked?: boolean;
  onToggle?: () => void;
}

function WorkflowStep({
  children,
  checked = false,
  onToggle,
}: WorkflowStepProps): ReactElement {
  const checkboxId = useId();

  return (
    <li className={styles.step}>
      <input
        id={checkboxId}
        type="checkbox"
        className={styles.stepCheckbox}
        checked={checked}
        onChange={() => onToggle?.()}
      />
      <label className={styles.stepLabel} htmlFor={checkboxId}>
        <span className={styles.stepBox} aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <path d="M2 6.2 4.8 9 10 3.4" />
          </svg>
        </span>
        <span className={styles.stepNum} aria-hidden="true" />
        <span className={styles.stepText}>{children}</span>
      </label>
    </li>
  );
}
WorkflowStep.displayName = "Workflow.Step";

function WorkflowBase({ title, children }: WorkflowProps): ReactElement {
  // Optional on purpose: <Workflow> also renders standalone (e.g. fixtures).
  const guidelineCtx = useContext(GuidelineContext);

  useEffect(() => {
    guidelineCtx?.reportWorkflow?.();
  }, [guidelineCtx]);

  const steps = Children.toArray(children).filter(
    (child): child is ReactElement<WorkflowStepProps> =>
      isValidElement(child) && child.type === WorkflowStep,
  );
  const [verified, setVerified] = useState<ReadonlySet<number>>(new Set());

  const toggleStep = (index: number) =>
    setVerified((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  const total = steps.length;
  const done = verified.size;
  const allDone = total > 0 && done === total;

  return (
    <Accordion
      className={styles.accordion}
      title={
        <span className={styles.title}>
          <svg
            className={styles.titleIcon}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <rect
              x="1.5"
              y="1.5"
              width="13"
              height="13"
              rx="2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4.6 8.2 7 10.5l4.4-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.titleText}>
            {title ?? "Evaluation workflow"}
          </span>
          <span
            className={styles.progress}
            data-testid="workflow-progress"
            aria-live="polite"
          >
            <Badge color={allDone ? "green" : "muted"} dot>
              {done} of {total} verified
            </Badge>
          </span>
        </span>
      }
      titleClassName={styles.header}
      contentClassName={styles.content}
    >
      <div className={styles.track} aria-hidden="true">
        <div
          className={styles.trackFill}
          style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
        />
      </div>
      <p className={styles.hint}>
        Work through each step against the spec under review. Progress is kept
        on this page only.
      </p>
      <ol className={styles.steps} data-testid="workflow-steps">
        {steps.map((step, index) =>
          cloneElement(step, {
            key: index,
            checked: verified.has(index),
            onToggle: () => toggleStep(index),
          }),
        )}
      </ol>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.reset}
          onClick={() => setVerified(new Set())}
          disabled={done === 0}
        >
          Reset
        </button>
      </div>
    </Accordion>
  );
}

export const Workflow = Object.assign(WorkflowBase, {
  Step: WorkflowStep,
});
