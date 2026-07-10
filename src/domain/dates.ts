import type { ISODate, Weekday } from "./types";
import { WEEKDAYS } from "./types";

/** Parse "YYYY-MM-DD" as a UTC date (avoids local-timezone drift). */
export function parseISO(d: ISODate): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

export function toISO(date: Date): ISODate {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(d: ISODate, n: number): ISODate {
  const date = parseISO(d);
  date.setUTCDate(date.getUTCDate() + n);
  return toISO(date);
}

/** Monday = 0 … Sunday = 6. */
export function weekdayIndex(d: ISODate): number {
  const js = parseISO(d).getUTCDay(); // Sun = 0
  return (js + 6) % 7;
}

export function weekdayOf(d: ISODate): Weekday {
  return WEEKDAYS[weekdayIndex(d)];
}

/** Inclusive day range. */
export function eachDay(start: ISODate, end: ISODate): ISODate[] {
  const out: ISODate[] = [];
  let cur = start;
  while (cur <= end) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

/** Inclusive test that `d` is within [start,end], treating undefined as open. */
export function inWindow(d: ISODate, start?: ISODate, end?: ISODate): boolean {
  if (start && d < start) return false;
  if (end && d > end) return false;
  return true;
}

export function daysBetween(a: ISODate, b: ISODate): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
}

/** Monday on or before `d` (the week's anchor). */
export function weekStart(d: ISODate): ISODate {
  return addDays(d, -weekdayIndex(d));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthKey(d: ISODate): string {
  return d.slice(0, 7); // YYYY-MM
}

export function monthLabel(d: ISODate): string {
  return MONTHS[parseISO(d).getUTCMonth()];
}

export function quarterOf(d: ISODate): number {
  return Math.floor(parseISO(d).getUTCMonth() / 3) + 1;
}

export function yearOf(d: ISODate): number {
  return parseISO(d).getUTCFullYear();
}
