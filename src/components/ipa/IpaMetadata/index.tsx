import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import styles from "./IpaMetadata.module.css";
import Badge, { type BadgeColor } from "../../ui/Badge";

type IpaState = "adopt" | "experimental" | "deprecated" | "retired";

const STATE_CONFIG: Record<IpaState, { label: string; color: BadgeColor }> = {
  adopt: { label: "Adopt", color: "green" },
  experimental: { label: "Experimental", color: "amber" },
  deprecated: { label: "Deprecated", color: "orange" },
  retired: { label: "Retired", color: "muted" },
};

export default function IpaMetadata(): React.ReactElement | null {
  const { frontMatter } = useDoc();

  const raw = (frontMatter as Record<string, unknown>).state;
  const state =
    typeof raw === "string" ? (raw.toLowerCase() as IpaState) : undefined;
  const stateConfig = state ? STATE_CONFIG[state] : null;

  if (!stateConfig) return null;

  return (
    <div className={styles.pageMeta}>
      <Badge color={stateConfig.color} dot>
        {stateConfig.label}
      </Badge>
    </div>
  );
}
