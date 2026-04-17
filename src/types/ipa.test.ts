import { describe, it, expect } from "vitest";
import { rulePropsSchema, givenValueSchema, ruleIdSchema } from "./ipa";

describe("ruleIdSchema", () => {
  it("accepts valid IDs", () => {
    expect(ruleIdSchema.safeParse("IPA-0108-must-use-http-delete").success).toBe(true);
    expect(ruleIdSchema.safeParse("IPA-0101-should-not-mirror-database-schema").success).toBe(true);
    expect(ruleIdSchema.safeParse("IPA-0101-may-have-sub-resources").success).toBe(true);
  });

  it("rejects IDs without severity keyword", () => {
    expect(ruleIdSchema.safeParse("IPA-0108-use-http-delete").success).toBe(false);
  });

  it("rejects IDs with wrong format", () => {
    expect(ruleIdSchema.safeParse("RULE-0108-must-foo").success).toBe(false);
    expect(ruleIdSchema.safeParse("IPA-abc-must-foo").success).toBe(false);
  });
});

describe("givenValueSchema", () => {
  it("accepts known aliases", () => {
    expect(givenValueSchema.safeParse("delete-operation").success).toBe(true);
    expect(givenValueSchema.safeParse("spec").success).toBe(true);
    expect(givenValueSchema.safeParse("schema").success).toBe(true);
  });

  it("accepts raw JSONPaths starting with $", () => {
    expect(givenValueSchema.safeParse("$.paths[*].get").success).toBe(true);
    expect(givenValueSchema.safeParse("$.components.schemas..properties").success).toBe(true);
  });

  it("rejects unknown strings that are not JSONPaths", () => {
    expect(givenValueSchema.safeParse("foo-bar").success).toBe(false);
    expect(givenValueSchema.safeParse("paths").success).toBe(true); // "paths" IS an alias
    expect(givenValueSchema.safeParse("unknown").success).toBe(false);
  });
});

describe("rulePropsSchema", () => {
  const validBase = {
    id: "IPA-0108-must-use-http-delete",
    given: "delete-operation",
  };

  it("accepts minimal valid props", () => {
    const result = rulePropsSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("applies defaults", () => {
    const result = rulePropsSchema.parse(validBase);
    expect(result.lintable).toBe(false);
    expect(result.informational).toBe(false);
    expect(result.implementation).toBe(false);
    expect(result.effort).toBe("check");
  });

  it("accepts given as array", () => {
    const result = rulePropsSchema.safeParse({
      ...validBase,
      given: ["delete-operation", "schema"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts given as array with mixed aliases and JSONPaths", () => {
    const result = rulePropsSchema.safeParse({
      ...validBase,
      given: ["$.components.schemas..properties", "paths"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts all optional props", () => {
    const result = rulePropsSchema.safeParse({
      ...validBase,
      lintable: true,
      implementation: true,
      effort: "explore",
      state: "experimental",
      dependsOn: ["IPA-0108-must-use-http-delete"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-informational rule without given", () => {
    const result = rulePropsSchema.safeParse({
      id: "IPA-0108-must-use-http-delete",
    });
    expect(result.success).toBe(false);
  });

  it("allows informational rule without given", () => {
    const result = rulePropsSchema.safeParse({
      id: "IPA-0101-may-have-custom-methods",
      informational: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid effort value", () => {
    const result = rulePropsSchema.safeParse({
      ...validBase,
      effort: "investigate",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid dependsOn format", () => {
    const result = rulePropsSchema.safeParse({
      ...validBase,
      dependsOn: ["bad-id-format"],
    });
    expect(result.success).toBe(false);
  });
});
