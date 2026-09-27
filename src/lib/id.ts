import { randomUUID } from "crypto";

/** A short, sortable-enough unique id. Good for primary keys; not a secret. */
export function newId(prefix?: string): string {
  const uuid = randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${uuid}` : uuid;
}
