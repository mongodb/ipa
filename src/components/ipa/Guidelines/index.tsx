import React from "react";
import styles from "./Guidelines.module.css";

interface GuidelinesProps {
  children: React.ReactNode;
}

/**
 * Visual container that groups all <Guideline> components belonging to one
 * logical section of an IPA document. Pure presentation: renders a
 * card-like wrapper with separators between children.
 *
 * Each <Guideline> resolves its own `state` independently — defaulting to
 * the document's frontmatter `state` and overridable via an explicit
 * `state` prop on the guideline itself.
 */
export default function Guidelines({ children }: GuidelinesProps) {
  return <section className={styles.root}>{children}</section>;
}
