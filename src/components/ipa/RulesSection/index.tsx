import React, { createContext, useContext } from "react";
import type { IpaState } from "@site/src/types/ipa";
import styles from "./RulesSection.module.css";

interface RulesSectionContextValue {
  state: IpaState;
}

const RulesSectionContext = createContext<RulesSectionContextValue | null>(null);

export function useRulesSection(): RulesSectionContextValue {
  const ctx = useContext(RulesSectionContext);
  if (!ctx) {
    throw new Error("<Rule> must be rendered inside a <RulesSection>");
  }
  return ctx;
}

interface RulesSectionProps {
  state?: IpaState;
  children: React.ReactNode;
}

/**
 * Groups all Rules belonging to one logical section of an IPA document.
 * Provides the section-level `state` via React context so individual
 * `<Rule>` components can inherit it without repeating the prop.
 */
export default function RulesSection({ state = "adopt", children }: RulesSectionProps) {
  return (
    <RulesSectionContext.Provider value={{ state }}>
      <div className={styles.rulesSection}>
        <h2 className={styles.rulesSectionTitle}>
          <span className={styles.rulesSectionIcon} aria-hidden="true">
            {"<>"}
          </span>{" "}
          Rules
        </h2>
        {children}
      </div>
    </RulesSectionContext.Provider>
  );
}
