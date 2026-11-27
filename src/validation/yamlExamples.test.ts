import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import {
  extractYamlBlocks,
  validateYamlBlock,
  validateYamlExamples,
} from "./yamlExamples";

// Vitest runs from the repo root (jsdom makes `import.meta.url` non-file).
const IPA_DIR = resolve(process.cwd(), "ipa");

describe("extractYamlBlocks", () => {
  it("extracts yaml fences with their line numbers and skips other languages", () => {
    const source = [
      "text",
      "```yaml",
      "a: 1",
      "```",
      "```json",
      '{"a": 1}',
      "```",
      "  ```yml",
      "  b: 2",
      "  ```",
    ].join("\n");

    const blocks = extractYamlBlocks("x.mdx", source);

    expect(blocks.map((b) => [b.line, b.content])).toEqual([
      [2, "a: 1"],
      [8, "b: 2"],
    ]);
  });
});

describe("validateYamlBlock", () => {
  const block = (content: string) => ({ file: "x.mdx", line: 1, content });

  it("accepts valid yaml", () => {
    expect(validateYamlBlock(block("a:\n  - b: 1"))).toBeUndefined();
  });

  it("rejects an unquoted scalar containing ': '", () => {
    const error = validateYamlBlock(block("description: Deprecated: use x"));
    expect(error?.message).toMatch(/Nested mappings|mapping values/i);
  });
});

describe("IPA guideline examples", () => {
  it("contain only valid YAML", () => {
    const failures = validateYamlExamples(IPA_DIR).map(
      (f) => `${f.file}:${f.line}: ${f.message}`,
    );
    expect(failures).toEqual([]);
  });
});
