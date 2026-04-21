import type { LoadContext, Plugin } from "@docusaurus/types";
import fs from "fs";
import path from "path";
import { rulePropsSchema } from "../types/ipa";

// ---- Regex extractors for <Rule> props from MDX ----

/** Match each <Rule ...> opening tag (multiline). */
const RULE_TAG_RE = /<Rule\s([\s\S]*?)\/?\s*>/g;

const PROP_EXTRACTORS = {
  id: /id="([^"]+)"/,
  given_string: /given="([^"]+)"/,
  given_array: /given=\{\[([^\]]+)\]\}/,
  effort: /effort="([^"]+)"/,
  state: /state="([^"]+)"/,
  dependsOn: /dependsOn=\{\[([^\]]+)\]\}/,
};

const BOOL_PROPS = ["lintable", "informational", "implementation"] as const;

/** Parse a JSX string array like `"a", "b"` into string[]. */
function parseStringArray(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

export interface ExtractedRule {
  id: string;
  given?: string | string[];
  lintable?: boolean;
  informational?: boolean;
  implementation?: boolean;
  effort?: string;
  state?: string;
  dependsOn?: string[];
  [key: string]: unknown;
}

/** Extract Rule props from MDX content using regex. */
export function extractRuleProps(content: string): ExtractedRule[] {
  // Strip fenced code blocks so we don't extract <Rule> from examples.
  const stripped = content.replace(/```[\s\S]*?```/g, '');
  // Strip JSX comments so we don't extract commented-out <Rule> tags.
  const withoutComments = stripped.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  const rules: ExtractedRule[] = [];
  let match: RegExpExecArray | null;

  RULE_TAG_RE.lastIndex = 0;
  while ((match = RULE_TAG_RE.exec(withoutComments)) !== null) {
    const attrs = match[1];
    const props: ExtractedRule = { id: "" };

    const idMatch = attrs.match(PROP_EXTRACTORS.id);
    if (idMatch) props.id = idMatch[1];

    // given (string or array)
    const givenArrayMatch = attrs.match(PROP_EXTRACTORS.given_array);
    if (givenArrayMatch) {
      props.given = parseStringArray(givenArrayMatch[1]);
    } else {
      const givenStringMatch = attrs.match(PROP_EXTRACTORS.given_string);
      if (givenStringMatch) props.given = givenStringMatch[1];
    }

    const effortMatch = attrs.match(PROP_EXTRACTORS.effort);
    if (effortMatch) props.effort = effortMatch[1];

    const stateMatch = attrs.match(PROP_EXTRACTORS.state);
    if (stateMatch) props.state = stateMatch[1];

    const depsMatch = attrs.match(PROP_EXTRACTORS.dependsOn);
    if (depsMatch) props.dependsOn = parseStringArray(depsMatch[1]);

    // boolean props: bare attribute, ={true}, or ={false}
    for (const boolProp of BOOL_PROPS) {
      const explicitRe = new RegExp(`(?:^|\\s)${boolProp}=\\{(true|false)\\}`);
      const explicitMatch = attrs.match(explicitRe);
      if (explicitMatch) {
        props[boolProp] = explicitMatch[1] === "true";
      } else {
        const bareRe = new RegExp(`(?:^|\\s)${boolProp}(?:\\s|$)`);
        if (bareRe.test(attrs)) props[boolProp] = true;
      }
    }

    if (props.id) rules.push(props);
  }

  return rules;
}

// ---- Cross-file validators ----

export interface RuleEntry {
  id: string;
  file: string;
  dependsOn: string[];
}

/** Check that all rule IDs are unique across files. */
export function checkUniqueness(rules: RuleEntry[]): void {
  const seen = new Map<string, string[]>();
  for (const rule of rules) {
    const files = seen.get(rule.id) ?? [];
    files.push(rule.file);
    seen.set(rule.id, files);
  }
  const dupes = [...seen.entries()].filter(([, files]) => files.length > 1);
  if (dupes.length > 0) {
    const msg = dupes
      .map(
        ([id, files]) => `  Duplicate rule ID "${id}" in: ${files.join(", ")}`,
      )
      .join("\n");
    throw new Error(`Duplicate rule IDs found:\n${msg}`);
  }
}

/** Check that every dependsOn reference resolves to an existing rule. */
export function checkReferences(rules: RuleEntry[]): void {
  const knownIds = new Set(rules.map((r) => r.id));
  const unresolved: string[] = [];
  for (const rule of rules) {
    for (const dep of rule.dependsOn) {
      if (!knownIds.has(dep)) {
        unresolved.push(
          `  Rule "${rule.id}" (${rule.file}) depends on unresolved "${dep}"`,
        );
      }
    }
  }
  if (unresolved.length > 0) {
    throw new Error(
      `Unresolved dependsOn references:\n${unresolved.join("\n")}`,
    );
  }
}

/** Check for cycles using Kahn's algorithm. */
export function checkNoCycles(rules: RuleEntry[]): void {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const rule of rules) {
    if (!inDegree.has(rule.id)) inDegree.set(rule.id, 0);
    if (!adj.has(rule.id)) adj.set(rule.id, []);
  }

  for (const rule of rules) {
    for (const dep of rule.dependsOn) {
      // dep -> rule.id (rule depends on dep, so dep must come first)
      if (!adj.has(dep)) adj.set(dep, []);
      adj.get(dep)!.push(rule.id);
      inDegree.set(rule.id, (inDegree.get(rule.id) ?? 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  let processed = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    processed++;
    for (const neighbor of adj.get(node) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  if (processed < inDegree.size) {
    const cycleNodes = [...inDegree.entries()]
      .filter(([, deg]) => deg > 0)
      .map(([id]) => id);
    throw new Error(
      `Dependency cycle detected among rules: ${cycleNodes.join(", ")}`,
    );
  }
}

// ---- Docusaurus plugin ----

function findMdxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(full));
    } else if (entry.name.endsWith(".mdx")) {
      results.push(full);
    }
  }
  return results;
}

export default function validateIpaRulesPlugin(context: LoadContext): Plugin {
  return {
    name: "validate-ipa-rules",

    async loadContent() {
      const ipaDir = path.join(context.siteDir, "ipa");
      const mdxFiles = findMdxFiles(ipaDir);
      const allRules: RuleEntry[] = [];

      for (const file of mdxFiles) {
        const content = fs.readFileSync(file, "utf-8");
        const extracted = extractRuleProps(content);
        const relFile = path.relative(context.siteDir, file);

        for (const props of extracted) {
          const result = rulePropsSchema.safeParse(props);
          if (!result.success) {
            const issues = result.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; ");
            throw new Error(
              `Invalid <Rule> in ${relFile}: id="${props.id}" — ${issues}`,
            );
          }
          allRules.push({
            id: props.id,
            file: relFile,
            dependsOn: props.dependsOn ?? [],
          });
        }
      }

      checkUniqueness(allRules);
      checkReferences(allRules);
      checkNoCycles(allRules);

      return null;
    },
  };
}
