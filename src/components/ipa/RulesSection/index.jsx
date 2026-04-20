import React, { createContext, useContext } from "react";
import styles from "./RulesSection.module.css";

/** @typedef {"experimental" | "adopt" | "deprecated" | "retired"} RuleState */

/**
 * @typedef {Object} RulesSectionContextValue
 * @property {RuleState} state - Inherited lifecycle state for child Rules.
 */

const RulesSectionContext = createContext(
  /** @type {RulesSectionContextValue} */ ({ state: "adopt" }),
);

export function useRulesSection() {
  return useContext(RulesSectionContext);
}

/**
 * Groups all Rules belonging to one logical section of an IPA document.
 * Provides the section-level `state` via React context so individual
 * `<Rule>` components can inherit it without repeating the prop.
 *
 * @param {{ state?: RuleState, children: React.ReactNode }} props
 */
export default function RulesSection({ state = "adopt", children }) {
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
