import type { ReactElement } from "react";
import { useGuideline } from "../../../hooks/useGuideline";
import { usePrinciple } from "../../../hooks/usePrinciple";
import styles from "./GuidelineFooter.module.css";

// IPA-0107-must-use-http-patch → "Use HTTP Patch"
function slugToTitle(id: string): string {
  const slug = id.replace(/^IPA-\d{4}-(must|should|may)-/, "");
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// IPA-0107-must-use-http-patch → 107
function ipaNumber(id: string): number | null {
  const match = id.match(/^IPA-(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

// "IPA-0107-must-use-http-patch" → "IPA-107: Use HTTP Patch"
function depLabel(depId: string): string {
  const num = ipaNumber(depId);
  const title = slugToTitle(depId);
  return num !== null ? `IPA-${num}: ${title}` : title;
}

// Cross-IPA: /107#IPA-0107-must-use-http-patch
// Same-IPA:  #IPA-0107-must-use-http-patch
function depHref(depId: string, currentIpa: number): string {
  const depIpa = ipaNumber(depId);
  const anchor = `#${depId}`;
  return depIpa !== null && depIpa !== currentIpa
    ? `/${depIpa}${anchor}`
    : anchor;
}

export function GuidelineFooter(): ReactElement | null {
  const guideline = useGuideline();
  const principle = usePrinciple();

  if (!guideline.dependsOn || guideline.dependsOn.length === 0) return null;

  return (
    <div className={styles.root}>
      <span className={styles.label}>Depends on</span>
      <div className={styles.deps}>
        {guideline.dependsOn.map((depId) => (
          <a
            key={depId}
            href={depHref(depId, principle.id)}
            className={styles.depTag}
          >
            {depLabel(depId)}
          </a>
        ))}
      </div>
    </div>
  );
}
