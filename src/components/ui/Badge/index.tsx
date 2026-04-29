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
  return (
    <span className={styles.tag} data-color={color}>
      {dot && <span className={styles.tagDot} aria-hidden="true" />}
      {children}
    </span>
  );
}
