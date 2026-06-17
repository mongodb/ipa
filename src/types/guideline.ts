import { z } from "zod";
import { stateSchema } from "./ipa";

// Predefined `given` aliases.
// Maps readable alias names to JSONPath expressions.
const GIVEN_ALIASES = {
  "get-operation": "$.paths[*].get",
  "create-operation": "$.paths[*].post",
  "update-operation": "$.paths[*][put,patch]",
  "delete-operation": "$.paths[*].delete",
  operation: "$.paths[*][get,put,post,delete,options,head,patch,trace]",
  resource: "$.paths[*]",
  paths: "$.paths",
  schema: "$.components.schemas[*]",
  parameter: "$.paths..parameters[*]",
  tag: "$.tags[*]",
  enum: "$..enum",
  spec: "$",
} as const;

type GivenAlias = keyof typeof GIVEN_ALIASES;

function isGivenAlias(value: string): value is GivenAlias {
  return value in GIVEN_ALIASES;
}

// A single given value: known alias or JSONPath starting with $
export const givenValueSchema = z.string().check(
  z.refine((v) => isGivenAlias(v) || v.startsWith("$"), {
    message: "Must be a known alias or a JSONPath starting with $",
  }),
);

// given prop: single value or non-empty array
export const givenSchema = z.union([
  givenValueSchema,
  z.array(givenValueSchema).nonempty(),
]);

// Guideline ID format: IPA-{nnn}-{must|should|may}-{slug}
export const guidelineIdSchema = z
  .string()
  .regex(
    /^IPA-\d{3}-(must|should|may)-.+$/,
    "Guideline ID must match IPA-{nnn}-{must|should|may}-{slug}",
  );

// Effort level
export const effortSchema = z.enum(["check", "reason", "explore"]);

// Full Guideline component props schema
export const guidelinePropsSchema = z
  .object({
    id: guidelineIdSchema,
    given: givenSchema.optional(),
    lintable: z.boolean().default(false),
    informational: z.boolean().default(false),
    // Metadata consumed by the extraction pipeline and agent skill router, not rendered in the UI.
    implementation: z.boolean().default(false),
    effort: effortSchema.default("check"),
    state: stateSchema.optional(),
    dependsOn: z
      .array(guidelineIdSchema)
      .optional()
      .check(
        z.refine((arr) => !arr || new Set(arr).size === arr.length, {
          message: "dependsOn must not contain duplicate guideline IDs",
        }),
      ),
  })
  .check(
    z.refine((data) => data.informational || data.given !== undefined, {
      message: "Non-informational guidelines require a 'given' prop",
      path: ["given"],
    }),
  );

export type Guideline = z.infer<typeof guidelinePropsSchema>;
