import React from "react";
import { useRulesSection } from "../RulesSection";
import { rulePropsSchema } from "@site/src/types/ipa";
import type { IpaState, RuleProps } from "@site/src/types/ipa";
import styles from "./Rule.module.css";
import Badge, { type BadgeColor } from "../../ui/Badge";

const SPECTRAL_BASE_URL =
  "https://github.com/mongodb/openapi/tree/main/tools/spectral";

/** Tag color for each rule-level state badge. */
const STATE_TAG_COLOR: Partial<Record<IpaState, BadgeColor>> = {
  experimental: "amber",
  deprecated: "orange",
  retired: "muted",
};

function deriveSeverity(id: string): string | null {
  const match = id.match(/-(must|should|may)-/);
  return match ? match[1].toLowerCase() : null;
}

function deriveSpectralRuleId(id: string): string {
  return `xgen-${id}`;
}

interface RuleComponentProps extends RuleProps {
  children: React.ReactNode;
}

/**
 * One atomic API design rule with machine-readable metadata.
 */
export default function Rule({
  id,
  given,
  lintable = false,
  informational = false,
  implementation = false,
  effort = "check",
  state: explicitState,
  dependsOn,
  children,
}: RuleComponentProps) {
  const { state: sectionState } = useRulesSection();

  // Validate props with Zod — throws during SSR to fail the build on invalid props
  if (typeof window === "undefined") {
    const validated = rulePropsSchema.safeParse({
      id,
      given,
      lintable,
      informational,
      implementation,
      effort,
      state: explicitState,
      dependsOn,
    });
    if (!validated.success) {
      const issues = validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new Error(`<Rule id="${id}">: invalid props — ${issues}`);
    }
  }

  const effectiveState: IpaState = explicitState || sectionState || "experimental";
  // severity is derived from the rule ID slug (must / should / may)
  const severity = deriveSeverity(id);
  const spectralRuleId = lintable ? deriveSpectralRuleId(id) : null;

  // Only show a state badge when the rule diverges from its section's state
  const showStateBadge = Boolean(
    explicitState && explicitState !== sectionState,
  );

  const evaluationType = informational
    ? "Informational"
    : lintable
      ? "Syntactic"
      : "Semantic";

  return (
    <div
      className={`${styles.rule} ${informational ? styles.ruleInformational : ""}`}
      id={id}
      data-severity={severity ?? undefined}
    >
      <div className={styles.ruleHeader}>
        {/* Number is rendered by CSS counter(rule-counter) — no JS needed */}
        <span className={styles.ruleNumber} aria-hidden="true" />

        <div className={styles.ruleBadges}>
          {informational ? (
            <Badge color="blue">Informational</Badge>
          ) : lintable ? (
            <Badge color="green">Lintable</Badge>
          ) : (
            <Badge color="amber">Not Lintable</Badge>
          )}

          <span className={styles.badgeSeparator} aria-hidden="true">
            ·
          </span>
          <span className={styles.badgeType}>{evaluationType}</span>

          {lintable && spectralRuleId && (
            <>
              <span className={styles.badgeSeparator} aria-hidden="true">
                ·
              </span>
              <a
                href={SPECTRAL_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.spectralLink}
              >
                Spectral rule ↗
              </a>
            </>
          )}

          {implementation && !informational && (
            <>
              <span className={styles.badgeSeparator} aria-hidden="true">
                ·
              </span>
              <Badge color="muted">+ Code</Badge>
            </>
          )}

          {showStateBadge && (
            <>
              <span className={styles.badgeSeparator} aria-hidden="true">
                ·
              </span>
              <Badge color={STATE_TAG_COLOR[effectiveState] ?? "muted"}>
                {effectiveState}
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className={styles.ruleBody}>{children}</div>

      {!informational && effort !== "check" && (
        <div className={styles.ruleFooter}>
          <Badge color={effort === "explore" ? "red" : "amber"}>
            Effort: {effort}
          </Badge>
        </div>
      )}

      {dependsOn && dependsOn.length > 0 && (
        <div className={styles.ruleDependencies}>
          <span className={styles.dependencyLabel}>Depends on:</span>
          {dependsOn.map((depId) => (
            <a key={depId} href={`#${depId}`} className={styles.dependencyLink}>
              {depId}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
