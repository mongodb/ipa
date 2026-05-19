import { z } from "zod";

export const stateSchema = z.enum([
  "adopt",
  "experimental",
  "deprecated",
  "retired",
]);

export type State = z.infer<typeof stateSchema>;

export const principleSchema = z.object({
  id: z.number().int().positive(),
  state: z
    .string()
    .transform((s) => s.toLowerCase())
    .pipe(stateSchema),
});

export type Principle = z.infer<typeof principleSchema>;
