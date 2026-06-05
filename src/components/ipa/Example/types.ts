export const EXAMPLE_TYPE = ["correct", "incorrect"] as const;

export type ExampleType = (typeof EXAMPLE_TYPE)[number];
