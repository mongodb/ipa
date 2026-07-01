import type { ReactElement } from "react";
import Link from "@docusaurus/Link";
import { useGuideline } from "../../../hooks/useGuideline";
import { usePrinciple } from "../../../hooks/usePrinciple";
import styles from "./GuidelineFooter.module.css";

// IPA-107-must-use-http-patch → "Must Use HTTP Patch"
function slugToTitle(id: string): string {
  const slug = id.split("-").slice(2).join("-");
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// IPA-107-must-use-http-patch → 107
function ipaNumber(id: string): number | null {
  const [prefix, number] = id.split("-");
  if (prefix !== "IPA") return null;

  const parsed = Number(number);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function hasGuidelineAnchor(id: string): boolean {
  return id.split("-").length > 2;
}

// "IPA-107-must-use-http-patch" → "IPA 107: Must Use HTTP Patch"
// "IPA-107" → "IPA 107"
function depLabel(depId: string): string {
  const num = ipaNumber(depId);
  if (!hasGuidelineAnchor(depId)) return num !== null ? `IPA ${num}` : depId;

  const title = slugToTitle(depId);
  return num !== null ? `IPA ${num}: ${title}` : title;
}

// Cross-IPA: /107#IPA-107-must-use-http-patch
// Same-IPA:  #IPA-107-must-use-http-patch
function depHref(depId: string, currentIpa: number): string {
  const depIpa = ipaNumber(depId);
  const hasAnchor = hasGuidelineAnchor(depId);
  const anchor = `#${depId}`;
  if (!hasAnchor)
    return depIpa !== null && depIpa !== currentIpa ? `/${depIpa}` : anchor;

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
          <Link
            key={depId}
            to={depHref(depId, principle.id)}
            className={styles.depTag}
          >
            {depLabel(depId)}
          </Link>
        ))}
      </div>
    </div>
  );
}
