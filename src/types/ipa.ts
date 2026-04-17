import { z } from "zod";
import { isKnownAlias } from "../config/givenAliases";

export const ipaStateSchema = z.enum([
  "adopt",
  "experimental",
  "deprecated",
  "retired",
]);

export type IpaState = z.infer<typeof ipaStateSchema>;

/**
 * Frontmatter schema for IPA documents (numbered files under ipa/).
 */
export const ipaFrontmatterSchema = z.object({
  id: z.number().int().positive(),
  state: z
    .string()
    .transform((s) => s.toLowerCase())
    .pipe(ipaStateSchema),
});

// ---- Rule component schemas ----

/** A single given value: known alias or JSONPath starting with $ */
export const givenValueSchema = z.string().check(
  z.refine((v) => isKnownAlias(v) || v.startsWith("$"), {
    message: "Must be a known alias or a JSONPath starting with $",
  }),
);

/** given prop: single value or non-empty array */
export const givenSchema = z.union([
  givenValueSchema,
  z.array(givenValueSchema).nonempty(),
]);

/** Rule ID format: IPA-{nnnn}-{must|should|may}-{slug} */
export const ruleIdSchema = z.string().regex(
  /^IPA-\d{4}-(must|should|may)-.+$/,
  "Rule ID must match IPA-{nnnn}-{must|should|may}-{slug}",
);

/** Effort level */
export const effortSchema = z.enum(["check", "reason", "explore"]);

/** Full Rule component props schema */
export const rulePropsSchema = z
  .object({
    id: ruleIdSchema,
    given: givenSchema.optional(),
    lintable: z.boolean().default(false),
    informational: z.boolean().default(false),
    implementation: z.boolean().default(false),
    effort: effortSchema.default("check"),
    state: ipaStateSchema.optional(),
    dependsOn: z.array(ruleIdSchema).optional(),
  })
  .check(
    z.refine((data) => data.informational || data.given !== undefined, {
      message: "Non-informational rules require a 'given' prop",
      path: ["given"],
    }),
  );

export type RuleProps = z.infer<typeof rulePropsSchema>;
