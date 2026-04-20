import { describe, it, expect } from "vitest";
import {
  extractRuleProps,
  checkUniqueness,
  checkReferences,
  checkNoCycles,
} from "./validateIpaRules";

describe("extractRuleProps", () => {
  it("extracts id and given from a simple Rule tag", () => {
    const mdx = `<Rule id="IPA-0100-must-use-english" given="spec">`;
    const rules = extractRuleProps(mdx);
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe("IPA-0100-must-use-english");
    expect(rules[0].given).toBe("spec");
  });

  it("extracts given as array", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given={["schema", "paths"]}>`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].given).toEqual(["schema", "paths"]);
  });

  it("extracts boolean props", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given="spec" lintable implementation>`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].lintable).toBe(true);
    expect(rules[0].implementation).toBe(true);
  });

  it("extracts informational prop", () => {
    const mdx = `<Rule id="IPA-0100-may-foo" informational>`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].informational).toBe(true);
  });

  it("extracts effort prop", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given="spec" effort="explore">`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].effort).toBe("explore");
  });

  it("extracts dependsOn", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given="spec" dependsOn={["IPA-0100-must-bar"]}>`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].dependsOn).toEqual(["IPA-0100-must-bar"]);
  });

  it("extracts multiple rules from one file", () => {
    const mdx = `
      <Rule id="IPA-0100-must-a" given="spec">
      <Rule id="IPA-0100-must-b" given="paths">
    `;
    const rules = extractRuleProps(mdx);
    expect(rules).toHaveLength(2);
  });

  it("ignores Rule tags inside fenced code blocks", () => {
    const mdx = `
Some text before.

\`\`\`mdx
<Rule id="IPA-0100-must-example" given="spec">
\`\`\`

<Rule id="IPA-0100-must-real" given="spec">
    `;
    const rules = extractRuleProps(mdx);
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe("IPA-0100-must-real");
  });

  it("extracts lintable={true} explicit syntax", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given="spec" lintable={true}>`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].lintable).toBe(true);
  });

  it("extracts lintable={false} explicit syntax", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given="spec" lintable={false}>`;
    const rules = extractRuleProps(mdx);
    expect(rules[0].lintable).toBe(false);
  });

  it("extracts self-closing Rule tags", () => {
    const mdx = `<Rule id="IPA-0100-must-foo" given="spec" />`;
    const rules = extractRuleProps(mdx);
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe("IPA-0100-must-foo");
    expect(rules[0].given).toBe("spec");
  });

  it("ignores Rule tags inside JSX comments", () => {
    const mdx = `{/* <Rule id="IPA-0100-must-foo" given="spec"> */}`;
    const rules = extractRuleProps(mdx);
    expect(rules).toHaveLength(0);
  });

  it("handles multiline Rule tags", () => {
    const mdx = `<Rule
    id="IPA-0100-must-foo"
    given="spec"
    effort="reason"
  >`;
    const rules = extractRuleProps(mdx);
    expect(rules).toHaveLength(1);
    expect(rules[0].effort).toBe("reason");
  });
});

describe("checkUniqueness", () => {
  it("passes with unique IDs", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: [] as string[] },
      { id: "IPA-0100-must-b", file: "b.mdx", dependsOn: [] as string[] },
    ];
    expect(() => checkUniqueness(rules)).not.toThrow();
  });

  it("throws on duplicate IDs", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: [] as string[] },
      { id: "IPA-0100-must-a", file: "b.mdx", dependsOn: [] as string[] },
    ];
    expect(() => checkUniqueness(rules)).toThrow(/duplicate.*IPA-0100-must-a/i);
  });
});

describe("checkReferences", () => {
  it("passes when all dependsOn targets exist", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: [] as string[] },
      { id: "IPA-0100-must-b", file: "a.mdx", dependsOn: ["IPA-0100-must-a"] },
    ];
    expect(() => checkReferences(rules)).not.toThrow();
  });

  it("throws on unresolved reference", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: ["IPA-0100-must-z"] },
    ];
    expect(() => checkReferences(rules)).toThrow(
      /unresolved.*IPA-0100-must-z/i,
    );
  });
});

describe("checkNoCycles", () => {
  it("passes with a valid DAG", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: [] as string[] },
      { id: "IPA-0100-must-b", file: "a.mdx", dependsOn: ["IPA-0100-must-a"] },
      { id: "IPA-0100-must-c", file: "a.mdx", dependsOn: ["IPA-0100-must-b"] },
    ];
    expect(() => checkNoCycles(rules)).not.toThrow();
  });

  it("throws on direct cycle", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: ["IPA-0100-must-b"] },
      { id: "IPA-0100-must-b", file: "a.mdx", dependsOn: ["IPA-0100-must-a"] },
    ];
    expect(() => checkNoCycles(rules)).toThrow(/cycle/i);
  });

  it("throws on transitive cycle", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: ["IPA-0100-must-c"] },
      { id: "IPA-0100-must-b", file: "a.mdx", dependsOn: ["IPA-0100-must-a"] },
      { id: "IPA-0100-must-c", file: "a.mdx", dependsOn: ["IPA-0100-must-b"] },
    ];
    expect(() => checkNoCycles(rules)).toThrow(/cycle/i);
  });

  it("passes with no dependencies", () => {
    const rules = [
      { id: "IPA-0100-must-a", file: "a.mdx", dependsOn: [] as string[] },
      { id: "IPA-0100-must-b", file: "a.mdx", dependsOn: [] as string[] },
    ];
    expect(() => checkNoCycles(rules)).not.toThrow();
  });
});
