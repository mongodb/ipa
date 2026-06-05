import { type ReactNode, type ReactElement } from "react";
import styles from "./Guidelines.module.css";

interface GuidelinesProps {
  children: ReactNode;
}

// Pure visual container for a group of <Guideline> components within one
// logical section of an IPA document. Renders a card-like wrapper with
// separators between children.
export function Guidelines({ children }: GuidelinesProps): ReactElement {
  return (
    <div className={styles.root} data-testid="guidelines">
      {children}
    </div>
  );
}
