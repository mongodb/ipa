import React from "react";
import styles from "./Badge.module.css";

export type BadgeColor = "green" | "amber" | "blue" | "orange" | "red" | "muted";

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
  const COLOR_CLASSES: Record<BadgeColor, string> = {
    green: styles.tag_green,
    amber: styles.tag_amber,
    blue: styles.tag_blue,
    orange: styles.tag_orange,
    red: styles.tag_red,
    muted: styles.tag_muted,
  };
  return (
    <span className={`${styles.tag} ${COLOR_CLASSES[color]}`}>
      {dot && <span className={styles.tagDot} aria-hidden="true" />}
      {children}
    </span>
  );
}
