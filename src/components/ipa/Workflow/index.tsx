import {
  createContext,
  useContext,
  type ReactNode,
  type ReactElement,
} from "react";
import { Accordion, CheckSquareIcon } from "@site/src/components/ui";
import { NumberCircle } from "../shared/NumberCircle";
import styles from "./Workflow.module.css";

interface WorkflowProps {
  title?: string;
  children: ReactNode;
}

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
  return (
    <WorkflowContext.Provider value={true}>
      <Accordion
        className={styles.accordion}
        title={
          <span className={styles.title}>
            <CheckSquareIcon className={styles.titleIcon} />
            <span className={styles.titleText}>
              {title ?? "Evaluation workflow"}
            </span>
          </span>
        }
        titleClassName={styles.header}
        contentClassName={styles.content}
      >
        <ol role="list" className={styles.steps} data-testid="workflow-steps">
          {children}
        </ol>
      </Accordion>
    </WorkflowContext.Provider>
  );
}

export const Workflow = Object.assign(WorkflowBase, {
  Step: WorkflowStep,
});
