import { z } from "zod";

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
