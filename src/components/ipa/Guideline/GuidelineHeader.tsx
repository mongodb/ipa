import type { ReactElement } from "react";
import { useGuideline } from "../../../hooks/useGuideline";
import { usePrinciple } from "../../../hooks/usePrinciple";
import { StateBadge } from "../shared/StateBadge";
import { Badge } from "../../ui/Badge";
import styles from "./GuidelineHeader.module.css";

const SPECTRAL_RULESETS_URL =
  "https://github.com/mongodb/openapi/blob/main/tools/spectral/ipa/rulesets";

function spectralFileUrl(id: string): string {
  const match = id.match(/^IPA-(\d{4})/);
  if (!match) return SPECTRAL_RULESETS_URL;
  const num = parseInt(match[1], 10);
  return `${SPECTRAL_RULESETS_URL}/IPA-${String(num).padStart(3, "0")}.yaml`;
}

export function GuidelineHeader(): ReactElement {
  const guideline = useGuideline();
  const principle = usePrinciple();

  return (
    <div className={styles.root}>
      <div className={styles.badges}>
        {guideline.state !== undefined &&
          guideline.state !== principle.state && (
            <StateBadge state={guideline.state} />
          )}
        <Badge color="muted" variant="outline">
          {guideline.informational ? "Informational" : "Enforced"}
        </Badge>
      </div>
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
