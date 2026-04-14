import React from "react";
import styles from "./Badge.module.css";

/**
 * A pill-shaped tag badge for displaying metadata like state, lintability, effort, etc.
 *
 * @param {{
 *   color?: "green" | "amber" | "blue" | "orange" | "red" | "muted",
 *   dot?: boolean,
 *   children: React.ReactNode,
 * }} props
 *
 * @example
 * // IPA state tags (with status dot)
 * <Tag color="green" dot>Adopt</Tag>
 * <Tag color="amber" dot>Experimental</Tag>
 *
 * @example
 * // Rule lintability badges
 * <Tag color="green">Lintable</Tag>
 * <Tag color="amber">Not Lintable</Tag>
 * <Tag color="blue">Informational</Tag>
 *
 * @example
 * // Effort / implementation badges
 * <Tag color="muted">+ Code</Tag>
 * <Tag color="red">Effort: explore</Tag>
 */
export default function Badge({ color = "muted", dot = false, children }) {
  const colorClass = styles[`tag_${color}`] ?? styles.tag_muted;
  return (
    <span className={`${styles.tag} ${colorClass}`}>
      {dot && <span className={styles.tagDot} aria-hidden="true" />}
      {children}
    </span>
  );
}
