import { describe, it, expect } from "vitest";
import { compute } from "./compute";
import { EXAMPLES, nswQsrBusyness } from "./examples";
import type { Cell } from "./types";

describe("nswQsrBusyness example", () => {
  const result = compute(nswQsrBusyness());
  // No faceting, so there is a single aggregate Subject.
  const cells = result.subjects[0].cells;
  const on = (date: string): Cell => {
    const c = cells.find((cell) => cell.date === date);
    if (!c) throw new Error(`no cell for ${date}`);
    return c;
  };

  it("is registered in EXAMPLES", () => {
    expect(EXAMPLES.some((e) => e.id === "nsw-qsr-busyness")).toBe(true);
  });

  it("keeps capacity open 7 days a week (weekends are not off-days)", () => {
    // A quiet February Saturday: full base capacity, active, no reducer.
    const sat = on("2026-02-07");
    expect(sat.reference).toBe(5000);
    expect(sat.state).toBe("active");
  });

  it("blacks out Christmas Day and flags demand landing on it", () => {
    const xmas = on("2026-12-25");
    expect(xmas.state).toBe("blackout");
    expect(xmas.reference).toBe(0);
    expect(xmas.overBlackout).toBe(true);
  });

  it("tips Boxing Day into overload (weekend demand meets a capacity cut)", () => {
    // Boxing Day (Sat): capacity trimmed to 0.7 while weekend + December demand lands.
    const boxing = on("2026-12-26");
    expect(boxing.state).toBe("active");
    expect(boxing.reference).toBe(3500);
    expect(boxing.intensity).toBeGreaterThan(1);
  });

  it("carries the ABS seasonal shape: December season above January trough", () => {
    // Matched Tuesdays with no reducer and no school break — the only difference is the
    // monthly seasonal uplift, so this isolates the ABS per-day shape (Dec peak > Jan 0).
    const decTue = on("2026-12-08");
    const janTue = on("2026-01-06");
    expect(decTue.intensity).toBeGreaterThan(janTue.intensity);
  });

  it("lifts a school-holiday week above the same weekday outside the break", () => {
    // Winter break runs 6–17 Jul; compare a mid-break day with the same weekday a week
    // later (same monthly season, so the gap is purely the school-holiday spike).
    const inBreak = on("2026-07-15");
    const outBreak = on("2026-07-22");
    expect(inBreak.load).toBeGreaterThan(outBreak.load);
  });
});
