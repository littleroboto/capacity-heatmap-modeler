import type { Consumer, ISODate, LoadShape, SpanningConsumer } from "./types";
import { WEEKDAYS_MON_FRI } from "./types";
import { daysBetween, inWindow, weekdayOf } from "./dates";

function shapeAmount(shape: LoadShape, base: number, dayIndex: number, length: number): number {
  switch (shape.type) {
    case "flat":
      return base;
    case "ramp": {
      if (length <= 1) return shape.to;
      const frac = dayIndex / (length - 1);
      return shape.from + frac * (shape.to - shape.from);
    }
    case "phases": {
      let offset = 0;
      for (const phase of shape.phases) {
        if (dayIndex < offset + phase.days) return phase.amount;
        offset += phase.days;
      }
      return 0; // beyond the last defined phase
    }
  }
}

/** Load a single Consumer contributes on a day (0 if inactive). */
export function amountOnDay(c: Consumer, date: ISODate): number {
  if (c.kind === "recurring") {
    if (!inWindow(date, c.start, c.end)) return 0;
    const active = c.weekdays ?? WEEKDAYS_MON_FRI;
    return active.includes(weekdayOf(date)) ? c.amount : 0;
  }
  // spanning
  const s = c as SpanningConsumer;
  if (!inWindow(date, s.start, s.end)) return 0;
  const dayIndex = daysBetween(s.start, date);
  const length = daysBetween(s.start, s.end) + 1;
  return shapeAmount(s.shape, s.amount, dayIndex, length);
}

/** Total load from a set of Consumers on a day (layering = summation). */
export function loadOnDay(consumers: Consumer[], date: ISODate): number {
  let total = 0;
  for (const c of consumers) total += amountOnDay(c, date);
  return total;
}
