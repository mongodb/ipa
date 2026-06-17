import type { ReactElement } from "react";
import { useGuideline } from "../../../hooks/useGuideline";
import { usePrinciple } from "../../../hooks/usePrinciple";
import { StateBadge } from "../shared/StateBadge";
import styles from "./GuidelineHeader.module.css";

const SPECTRAL_RULESETS_URL =
  "https://github.com/mongodb/openapi/blob/main/tools/spectral/ipa/rulesets";

function spectralFileUrl(id: string): string {
  const match = id.match(/^IPA-(\d{3})/);
  if (!match) return SPECTRAL_RULESETS_URL;
  const num = parseInt(match[1], 10);
  return `${SPECTRAL_RULESETS_URL}/IPA-${String(num).padStart(3, "0")}.yaml`;
}

export function GuidelineHeader(): ReactElement | null {
  const guideline = useGuideline();
  const principle = usePrinciple();

  const stateBadge =
    guideline.state !== undefined && guideline.state !== principle.state ? (
      <StateBadge state={guideline.state} />
    ) : null;

  // Nothing to show → render no header at all, so it doesn't leave an empty
  // bar above the body.
  if (!stateBadge && !guideline.lintable) return null;

  return (
    <div className={styles.root}>
      {stateBadge && <div className={styles.badges}>{stateBadge}</div>}
      {guideline.lintable && (
        <a
          href={spectralFileUrl(guideline.id)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.lintLink}
        >
          Lint rule ↗
        </a>
      )}
    </div>
  );
}
