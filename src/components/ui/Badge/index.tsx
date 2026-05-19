import React from "react";
import styles from "./Badge.module.css";

export type BadgeColor = "green" | "amber" | "red" | "muted";
export type BadgeVariant = "solid" | "outline";

interface BadgeProps {
  color?: BadgeColor;
  dot?: boolean;
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({
  color = "muted",
  dot = false,
  variant = "solid",
  children,
}: BadgeProps): React.ReactElement {
  return (
    <span className={styles.badge} data-color={color} data-variant={variant}>
      {dot && <span className={styles.badgeDot} aria-hidden="true" />}
      {children}
    </span>
  );
}
