import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseAllDocuments } from "yaml";

export interface YamlBlock {
  file: string;
  /** 1-based line of the opening fence. */
  line: number;
  content: string;
}

export interface YamlBlockError extends YamlBlock {
  message: string;
}

const FENCE = /^(\s*)(`{3,}|~{3,})\s*(yaml|yml)\b.*$/;

/** Recursively lists the `.mdx` files under `dir`. */
export function listMdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listMdxFiles(path);
      return entry.name.endsWith(".mdx") ? [path] : [];
    })
    .sort();
}

/** Extracts fenced `yaml` code blocks from MDX source. */
export function extractYamlBlocks(file: string, source: string): YamlBlock[] {
  const lines = source.split("\n");
  const blocks: YamlBlock[] = [];
  for (let i = 0; i < lines.length; i++) {
    const open = FENCE.exec(lines[i]);
    if (!open) continue;
    const [, indent, fence] = open;
    const body: string[] = [];
    let j = i + 1;
    while (j < lines.length) {
      const trimmed = lines[j].trim();
      if (trimmed.startsWith(fence) && /^[`~]+$/.test(trimmed)) break;
      // Strip the fence's indentation so nested blocks parse as written.
      body.push(
        lines[j].startsWith(indent) ? lines[j].slice(indent.length) : lines[j],
      );
      j++;
    }
    blocks.push({ file, line: i + 1, content: body.join("\n") });
    i = j;
  }
  return blocks;
}

/** Returns the parse error for a block, or undefined when it is valid YAML. */
export function validateYamlBlock(
  block: YamlBlock,
): YamlBlockError | undefined {
  const errors = parseAllDocuments(block.content).flatMap((doc) => doc.errors);
  if (errors.length === 0) return undefined;
  return { ...block, message: errors.map((e) => e.message).join("\n") };
}

/** Validates every yaml block under `dir` and returns the failures. */
export function validateYamlExamples(dir: string): YamlBlockError[] {
  return listMdxFiles(dir).flatMap((file) =>
    extractYamlBlocks(file, readFileSync(file, "utf8")).flatMap(
      (block) => validateYamlBlock(block) ?? [],
    ),
  );
}
