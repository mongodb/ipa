import React from "react";
import styles from "./Badge.module.css";

export type BadgeColor = "green" | "amber" | "red" | "muted";

interface BadgeProps {
  color?: BadgeColor;
  dot?: boolean;
  children: React.ReactNode;
}

export default function Badge({
  color = "muted",
  dot = false,
  children,
}: BadgeProps): React.ReactElement {
  const colorClass = styles[`tag_${color}`] ?? styles.tag_muted;
  return (
    <span className={`${styles.tag} ${colorClass}`}>
      {dot && <span className={styles.tagDot} aria-hidden="true" />}
      {children}
    </span>
  );
}
