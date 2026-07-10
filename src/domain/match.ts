import type { Tags } from "./types";

/**
 * True when `entry` carries every tag in `filter` with matching values.
 * An empty/undefined filter matches everything.
 */
export function tagsMatch(entry: Tags | undefined, filter: Tags | undefined): boolean {
  if (!filter) return true;
  const keys = Object.keys(filter);
  if (keys.length === 0) return true;
  if (!entry) return false;
  return keys.every((k) => entry[k] === filter[k]);
}
