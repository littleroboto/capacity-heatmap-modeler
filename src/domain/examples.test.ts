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

  it("drives the pre-Christmas peak into overload (demand surge + reduced supply)", () => {
    // Christmas Eve: capacity trimmed to 0.8 while festive demand peaks.
    const eve = on("2026-12-24");
    expect(eve.state).toBe("active");
    expect(eve.reference).toBe(4000);
    expect(eve.intensity).toBeGreaterThan(1);
  });

  it("keeps the New Year week busy (no post-Christmas seasonal gap)", () => {
    // New Year's Eve sits inside the summer break; it should read warm, not baseline.
    const nye = on("2026-12-31");
    expect(nye.state).toBe("active");
    expect(nye.intensity).toBeGreaterThan(0.7);
  });

  it("runs coolest in the early-year lull (no seasonal uplift)", () => {
    // A February weekday carries only the weekly rhythm — well under capacity.
    const feb = on("2026-02-10"); // Tuesday
    expect(feb.intensity).toBeLessThan(0.5);
  });
});
