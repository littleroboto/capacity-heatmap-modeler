import { describe, it, expect } from "vitest";
import { addDays, eachDay, weekdayIndex, weekdayOf, inWindow, daysBetween, weekStart, quarterOf } from "./dates";

describe("dates", () => {
  it("weekdayIndex maps Monday to 0 and Sunday to 6", () => {
    expect(weekdayIndex("2026-01-05")).toBe(0); // Monday
    expect(weekdayIndex("2026-01-11")).toBe(6); // Sunday
    expect(weekdayOf("2026-01-05")).toBe("mon");
  });

  it("addDays crosses month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("eachDay is inclusive on both ends", () => {
    expect(eachDay("2026-01-01", "2026-01-03")).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
    ]);
  });

  it("inWindow treats missing bounds as open", () => {
    expect(inWindow("2026-05-01", "2026-01-01", "2026-12-31")).toBe(true);
    expect(inWindow("2026-05-01", undefined, undefined)).toBe(true);
    expect(inWindow("2025-12-31", "2026-01-01")).toBe(false);
  });

  it("daysBetween and weekStart", () => {
    expect(daysBetween("2026-01-01", "2026-01-08")).toBe(7);
    expect(weekStart("2026-01-07")).toBe("2026-01-05"); // Wed -> Mon
  });

  it("quarterOf", () => {
    expect(quarterOf("2026-01-15")).toBe(1);
    expect(quarterOf("2026-07-15")).toBe(3);
  });
});
