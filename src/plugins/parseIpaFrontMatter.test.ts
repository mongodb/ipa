import { describe, it, expect } from "vitest";
import parseFrontMatter from "./parseIpaFrontMatter";

const IPA_PATH = "ipa/general/0100.md";
const AUX_PATH = "ipa/index.md";

function md(frontmatter: Record<string, unknown>, path = IPA_PATH) {
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const fileContent = `---\n${yaml}\n---\n# Title\n`;

  // Minimal defaultParseFrontMatter that mimics Docusaurus
  const defaultParseFrontMatter = async ({
    fileContent,
  }: {
    fileContent: string;
  }) => {
    const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const fm: Record<string, unknown> = {};
    if (match) {
      for (const line of match[1].split("\n")) {
        const [key, ...rest] = line.split(": ");
        const val = rest.join(": ");
        // Parse numbers like real YAML would
        fm[key] = /^\d+$/.test(val) ? Number(val) : val;
      }
    }
    return { frontMatter: fm, content: match?.[2] ?? fileContent };
  };

  return parseFrontMatter({
    filePath: path,
    fileContent,
    defaultParseFrontMatter,
  });
}

describe("parseFrontMatter", () => {
  it.each(["adopt", "experimental", "deprecated", "retired"])(
    "accepts valid state: %s",
    async (state) => {
      const result = await md({ id: 100, state });
      expect(result.frontMatter.state).toBe(state);
    },
  );

  it("normalizes state to lowercase", async () => {
    const result = await md({ id: 100, state: "ADOPT" });
    expect(result.frontMatter.state).toBe("adopt");
  });

  it("derives slug from id", async () => {
    const result = await md({ id: 100, state: "adopt" });
    expect(result.frontMatter.slug).toBe("/100");
  });

  it("rejects invalid state on IPA doc", async () => {
    await expect(md({ id: 100, state: "banana" })).rejects.toThrow(
      /Invalid frontmatter/,
    );
  });

  it("rejects non-string state on IPA doc", async () => {
    await expect(md({ id: 100, state: 42 })).rejects.toThrow(
      /Invalid frontmatter/,
    );
  });

  it("rejects missing state on IPA doc", async () => {
    await expect(md({ id: 100 })).rejects.toThrow(/Invalid frontmatter/);
  });

  it("rejects missing id on IPA doc", async () => {
    await expect(md({ state: "adopt" })).rejects.toThrow(/Invalid frontmatter/);
  });

  it("rejects non-numeric id on IPA doc", async () => {
    await expect(md({ id: "foo", state: "adopt" })).rejects.toThrow(
      /Invalid frontmatter/,
    );
  });

  it("allows missing state on auxiliary pages", async () => {
    const result = await md({ id: "index" }, AUX_PATH);
    expect(result.frontMatter.state).toBeUndefined();
  });

  it("skips validation for non-IPA paths", async () => {
    const result = await md({ title: "Hello" }, "docs/intro.md");
    expect(result.frontMatter.state).toBeUndefined();
  });
});
