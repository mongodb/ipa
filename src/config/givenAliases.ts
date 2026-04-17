/**
 * Predefined `given` aliases following Spectral's alias pattern.
 * Maps readable alias names to JSONPath expressions.
 */
export const GIVEN_ALIASES: Record<string, string> = {
  "get-operation": "$.paths[*].get",
  "create-operation": "$.paths[*].post",
  "update-operation": "$.paths[*][put,patch]",
  "delete-operation": "$.paths[*].delete",
  "operation": "$.paths[*][get,put,post,delete,options,head,patch,trace]",
  "resource": "$.paths[*]",
  "paths": "$.paths",
  "schema": "$.components.schemas[*]",
  "parameter": "$.paths..parameters[*]",
  "tag": "$.tags[*]",
  "enum": "$..enum",
  "spec": "$",
};

/** Check if a value is a known given alias. */
export function isKnownAlias(value: string): boolean {
  return value in GIVEN_ALIASES;
}
