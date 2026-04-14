import type { Plugin } from "unified";
import type { VFile } from "vfile";

const VALID_STATES = [
  "adopt",
  "experimental",
  "deprecated",
  "retired",
] as const;

export default function validateIpaFrontmatter(): Plugin {
  return function (_tree, vfile: VFile) {
    const frontMatter = (vfile.data?.frontMatter ?? {}) as Record<
      string,
      unknown
    >;

    if (!("state" in frontMatter)) return;

    const state =
      typeof frontMatter.state === "string"
        ? frontMatter.state.toLowerCase()
        : null;

    if (!state || !(VALID_STATES as readonly string[]).includes(state)) {
      vfile.fail(
        `Invalid frontmatter value for "state": ${JSON.stringify(frontMatter.state)}. ` +
          `Must be one of: ${VALID_STATES.join(", ")}.`,
      );
    }
  };
}
