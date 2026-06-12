import { type ReactElement, type ReactNode } from "react";
import styles from "./Reason.module.css";

interface ReasonProps {
  children: ReactNode;
}

export function Reason({ children }: ReasonProps): ReactElement {
  return (
    <div className={styles.reason}>
      <span className={styles.lead}>Why:</span> {children}
    </div>
  );
}
