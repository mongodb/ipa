import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import clsx from "clsx";
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
  return (
    <li className={clsx(styles.step, checked && styles.stepDone)}>
      <label className={styles.stepLabel}>
        <input
          type="checkbox"
          className={styles.stepCheckbox}
          checked={checked}
          onChange={() => onToggle?.()}
        />
        <span className={styles.stepText}>{children}</span>
      </label>
    </li>
  );
}
WorkflowStep.displayName = "Workflow.Step";

function WorkflowBase({ title, children }: WorkflowProps): ReactElement {
  // Optional on purpose: <Workflow> also renders standalone (e.g. fixtures).
  const guidelineCtx = useContext(GuidelineContext);
  const referenceOnly = guidelineCtx?.guideline.lintable ?? false;

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
          <span>{title ?? "Evaluation workflow"}</span>
          {referenceOnly && (
            <Badge color="muted" variant="outline">
              Reference only — agent skips
            </Badge>
          )}
          <span
            className={styles.progress}
            data-testid="workflow-progress"
            aria-live="polite"
          >
            <Badge color={allDone ? "green" : "muted"} variant="outline">
              {done} of {total} verified
            </Badge>
          </span>
        </span>
      }
      titleClassName={styles.header}
      contentClassName={styles.content}
    >
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
