import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import styles from "./IpaMetadata.module.css";
import Badge, { type BadgeColor } from "../../ui/Badge";
import type { IpaState } from "../../../types/ipa";

const STATE_CONFIG: Record<IpaState, { label: string; color: BadgeColor }> = {
  adopt: { label: "Adopt", color: "green" },
  experimental: { label: "Experimental", color: "amber" },
  deprecated: { label: "Deprecated", color: "red" },
  retired: { label: "Retired", color: "muted" },
};

export default function IpaMetadata(): React.ReactElement | null {
  const { frontMatter } = useDoc();

  const state = (frontMatter as Record<string, unknown>).state as
    | IpaState
    | undefined;
  if (!state || !(state in STATE_CONFIG)) return null;

  const stateConfig = STATE_CONFIG[state];

  return (
    <div className={styles.pageMeta}>
      <Badge color={stateConfig.color} dot>
        {stateConfig.label}
      </Badge>
    </div>
  );
}
