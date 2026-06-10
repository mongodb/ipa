import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
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

// Steps render themselves and enroll in the checklist via context — the
// same composition pattern as <Guidelines>/<Guideline>, so steps survive
// being wrapped in other elements or components.
interface WorkflowContextValue {
  register: (id: string) => () => void;
  toggle: (id: string) => void;
  checked: ReadonlySet<string>;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

interface WorkflowStepProps {
  children: ReactNode;
}

function WorkflowStep({ children }: WorkflowStepProps): ReactElement {
  const ctx = useContext(WorkflowContext);
  if (!ctx) {
    throw new Error("<Workflow.Step> must be rendered inside a <Workflow>");
  }
  const stepId = useId();
  const { register } = ctx;

  useEffect(() => register(stepId), [register, stepId]);

  const checked = ctx.checked.has(stepId);

  return (
    <li className={styles.step}>
      <input
        id={stepId}
        type="checkbox"
        className={styles.stepCheckbox}
        checked={checked}
        onChange={() => ctx.toggle(stepId)}
      />
      <label className={styles.stepLabel} htmlFor={stepId}>
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

  const [registered, setRegistered] = useState<ReadonlySet<string>>(new Set());
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());

  const register = useCallback((id: string) => {
    setRegistered((prev) => new Set(prev).add(id));
    return () => {
      setRegistered((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setChecked((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ register, toggle, checked }),
    [register, toggle, checked],
  );

  // Steps enroll in an effect, so the count is 0 during SSR and corrects
  // itself on hydration — acceptable for a decorative progress chip.
  const total = registered.size;
  const done = checked.size;
  const allDone = total > 0 && done === total;

  return (
    <WorkflowContext.Provider value={contextValue}>
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
          {children}
        </ol>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.reset}
            onClick={() => setChecked(new Set())}
            disabled={done === 0}
          >
            Reset
          </button>
        </div>
      </Accordion>
    </WorkflowContext.Provider>
  );
}

export const Workflow = Object.assign(WorkflowBase, {
  Step: WorkflowStep,
});
