import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type ReactElement,
} from "react";
import { Accordion } from "../../ui";
import { GuidelineContext } from "../../../hooks/useGuideline";
import { NumberCircle } from "../shared/NumberCircle";
import styles from "./Workflow.module.css";

interface WorkflowProps {
  title?: string;
  children: ReactNode;
}

// Steps render themselves — the same composition pattern as
// <Guidelines>/<Guideline>, so steps survive being wrapped in other
// elements or components. The context exists only to guard against a
// <Workflow.Step> rendered outside a <Workflow>.
const WorkflowContext = createContext(false);

interface WorkflowStepProps {
  children: ReactNode;
}

function WorkflowStep({ children }: WorkflowStepProps): ReactElement {
  const isInsideWorkflow = useContext(WorkflowContext);
  if (!isInsideWorkflow) {
    throw new Error("<Workflow.Step> must be rendered inside a <Workflow>");
  }

  return (
    <li className={styles.step}>
      <NumberCircle className={styles.stepNum} />
      <span className={styles.stepText}>{children}</span>
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

  return (
    <WorkflowContext.Provider value={true}>
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
        <ol className={styles.steps} data-testid="workflow-steps">
          {children}
        </ol>
      </Accordion>
    </WorkflowContext.Provider>
  );
}

export const Workflow = Object.assign(WorkflowBase, {
  Step: WorkflowStep,
});
