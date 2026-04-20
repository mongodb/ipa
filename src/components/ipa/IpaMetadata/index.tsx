import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import type { IpaState } from "@site/src/types/ipa";
import styles from "./IpaMetadata.module.css";
import Badge, { type BadgeColor } from "../../ui/Badge";

const STATE_CONFIG: Record<IpaState, { label: string; color: BadgeColor }> = {
  adopt: { label: "Adopt", color: "green" },
  experimental: { label: "Experimental", color: "amber" },
  deprecated: { label: "Deprecated", color: "orange" },
  retired: { label: "Retired", color: "muted" },
};

/**
 * Tag strip rendered above the page title for every IPA document.
 * Reads `state` from the page's frontmatter via `useDoc()` — no props needed.
 */
export default function IpaMetadata(): React.ReactElement | null {
  const { frontMatter } = useDoc();

  const state = (frontMatter as Record<string, unknown>).state as string | undefined;
  const normalizedState = state?.toLowerCase() as IpaState | undefined;
  const stateConfig = normalizedState ? STATE_CONFIG[normalizedState] : null;

  if (!stateConfig) return null;

  return (
    <div className={styles.pageMeta}>
      <Badge color={stateConfig.color} dot>
        {stateConfig.label}
      </Badge>
    </div>
  );
}
