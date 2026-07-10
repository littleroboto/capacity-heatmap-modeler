import type { Capacity, Composition, ISODate, Reducer } from "./types";
import { WEEKDAYS_MON_FRI } from "./types";
import { inWindow, weekdayOf } from "./dates";
import { tagsMatch } from "./match";

/** Base Capacity amount for one entry on a day, before Reducers. */
export function baseAmountOnDay(cap: Capacity, date: ISODate): number {
  if (!inWindow(date, cap.start, cap.end)) return 0;
  const active = cap.weekdays ?? WEEKDAYS_MON_FRI;
  return active.includes(weekdayOf(date)) ? cap.amount : 0;
}

/** Total Base Capacity (before Reducers) across all entries on a day. */
export function baseCapacityTotal(caps: Capacity[], date: ISODate): number {
  let total = 0;
  for (const cap of caps) total += baseAmountOnDay(cap, date);
  return total;
}

function reducerApplies(r: Reducer, cap: Capacity, date: ISODate): boolean {
  if (!inWindow(date, r.start, r.end)) return false;
  if (r.weekdays && !r.weekdays.includes(weekdayOf(date))) return false;
  if (r.track !== undefined && r.track !== cap.track) return false;
  return tagsMatch(cap.tags, r.tags);
}

/** Effective capacity per Track after Reducers, for a set of Capacity entries. */
export function effectiveCapacityByTrack(
  caps: Capacity[],
  reducers: Reducer[],
  date: ISODate
): Map<string, number> {
  const byTrack = new Map<string, number>();
  for (const cap of caps) {
    const base = baseAmountOnDay(cap, date);
    if (base === 0) {
      // Still register the track so a blacked-out track can constrain a min.
      const track = cap.track ?? "";
      if (!byTrack.has(track)) byTrack.set(track, 0);
      continue;
    }
    let mult = 1;
    for (const r of reducers) {
      if (reducerApplies(r, cap, date)) mult *= r.multiplier;
    }
    const track = cap.track ?? "";
    byTrack.set(track, (byTrack.get(track) ?? 0) + base * mult);
  }
  return byTrack;
}

export interface EffectiveCapacity {
  value: number;
  byTrack: Map<string, number>;
  constraintTrack?: string;
}

/** Combine per-Track capacity into a Subject's Effective Capacity (ADR-0004). */
export function composeCapacity(
  byTrack: Map<string, number>,
  composition: Composition
): EffectiveCapacity {
  if (byTrack.size === 0) return { value: 0, byTrack };

  if (composition === "sum") {
    let total = 0;
    for (const v of byTrack.values()) total += v;
    return { value: total, byTrack };
  }

  // min: the weakest Track caps the whole; report it as the Constraint.
  let min = Infinity;
  let constraint: string | undefined;
  for (const [track, v] of byTrack) {
    if (v < min) {
      min = v;
      constraint = track;
    }
  }
  return { value: min === Infinity ? 0 : min, byTrack, constraintTrack: constraint };
}

export function effectiveCapacity(
  caps: Capacity[],
  reducers: Reducer[],
  date: ISODate,
  composition: Composition
): EffectiveCapacity {
  return composeCapacity(effectiveCapacityByTrack(caps, reducers, date), composition);
}
