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
import { Accordion } from "../../ui";
import { GuidelineContext } from "../../../hooks/useGuideline";
import styles from "./Workflow.module.css";

interface WorkflowProps {
  title?: string;
  children: ReactNode;
}

// Steps render themselves and join the checklist via context — the same
// composition pattern as <Guidelines>/<Guideline>, so steps survive being
// wrapped in other elements or components.
interface WorkflowContextValue {
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
  const checked = ctx.checked.has(stepId);

  return (
    <li className={styles.step}>
      <label className={styles.stepLabel}>
        <input
          type="checkbox"
          className={styles.stepCheckbox}
          checked={checked}
          onChange={() => ctx.toggle(stepId)}
        />
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

  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());

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

  const contextValue = useMemo(() => ({ toggle, checked }), [toggle, checked]);

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
          </span>
        }
        titleClassName={styles.header}
        contentClassName={styles.content}
      >
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
            disabled={checked.size === 0}
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
