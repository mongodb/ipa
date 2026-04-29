import React from "react";
import styles from "./Guidelines.module.css";

interface GuidelinesProps {
  children: React.ReactNode;
}

// Pure visual container for a group of <Guideline> components within one
// logical section of an IPA document. Renders a card-like wrapper with
// separators between children. Each <Guideline> resolves its own `state`
// independently (defaulting to the document's frontmatter `state`).
export function Guidelines({ children }: GuidelinesProps) {
  return (
    <div className={styles.root} data-testid="guidelines">
      {children}
    </div>
  );
}
