import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import styles from "./IpaMetadata.module.css";
import Badge from "../../ui/Badge";

/**
 * @typedef {"adopt" | "experimental" | "deprecated" | "retired"} IpaState
 * @typedef {"green" | "amber" | "blue" | "orange" | "red" | "muted"} TagColor
 */

/** @type {Record<IpaState, { label: string, color: TagColor }>} */
const STATE_CONFIG = {
  adopt: { label: "Adopt", color: "green" },
  experimental: { label: "Experimental", color: "amber" },
  deprecated: { label: "Deprecated", color: "orange" },
  retired: { label: "Retired", color: "muted" },
};

/**
 * Tag strip rendered above the page title for every IPA document.
 * Reads `state` from the page's frontmatter via `useDoc()` — no props needed.
 *
 * Designed to grow: add more frontmatter keys here (e.g. `lintable`, `since`)
 * without touching any individual doc file.
 */
export default function IpaMetadata() {
  const { frontMatter } = useDoc();

  /** @type {IpaState | undefined} */
  const state = frontMatter.state?.toLowerCase();
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
