import { type ReactNode, type ReactElement } from "react";
import styles from "./Guidelines.module.css";
import { GuidelinesProvider } from "./GuidelinesContext";

interface GuidelinesProps {
  children: ReactNode;
}

export function Guidelines({ children }: GuidelinesProps): ReactElement {
  return (
    <GuidelinesProvider value={true}>
      <ol role="list" className={styles.root} data-testid="guidelines">
        {children}
      </ol>
    </GuidelinesProvider>
  );
}
