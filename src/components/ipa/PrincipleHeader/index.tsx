import React from "react";
import styles from "./PrincipleHeader.module.css";
import { StateBadge } from "../shared/StateBadge";
import type { Principle } from "../../../types/ipa";

interface PrincipleHeaderProps {
  principle: Principle;
}

export function PrincipleHeader({ principle }: PrincipleHeaderProps) {
  return (
    <div className={styles.pageMeta}>
      <StateBadge state={principle.state} />
    </div>
  );
}
