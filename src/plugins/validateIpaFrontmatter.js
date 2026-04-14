// @ts-check

/**
 * Remark plugin that validates the `state` frontmatter field on IPA documents.
 *
 * Runs at build/start time during markdown compilation. Any invalid value
 * causes a hard build error attributed to the offending file.
 *
 * Valid values: adopt | experimental | deprecated | retired
 */

"use strict";

const VALID_STATES = ["adopt", "experimental", "deprecated", "retired"];

/** @returns {import('unified').Plugin} */
function validateIpaFrontmatter() {
  return function (_tree, vfile) {
    const frontMatter = /** @type {Record<string, unknown>} */ (
      vfile.data?.frontMatter ?? {}
    );

    if (!("state" in frontMatter)) return;

    const state =
      typeof frontMatter.state === "string"
        ? frontMatter.state.toLowerCase()
        : null;

    if (!state || !VALID_STATES.includes(state)) {
      vfile.fail(
        `Invalid frontmatter value for "state": ${JSON.stringify(frontMatter.state)}. ` +
          `Must be one of: ${VALID_STATES.join(", ")}.`,
      );
    }
  };
}

module.exports = validateIpaFrontmatter;
