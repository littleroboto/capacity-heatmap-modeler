import { describe, it, expect } from "vitest";
import type { Capacity, Reducer } from "./types";
import { baseAmountOnDay, effectiveCapacity, effectiveCapacityByTrack } from "./capacity";

const cap = (over: Partial<Capacity> = {}): Capacity => ({
  id: "c",
  label: "c",
  amount: 450,
  ...over,
});

describe("baseAmountOnDay", () => {
  it("applies on default weekdays and zeroes weekends", () => {
    expect(baseAmountOnDay(cap(), "2026-01-05")).toBe(450); // Mon
    expect(baseAmountOnDay(cap(), "2026-01-10")).toBe(0); // Sat
  });

  it("respects an active window", () => {
    const c = cap({ start: "2026-02-01", end: "2026-02-28" });
    expect(baseAmountOnDay(c, "2026-01-05")).toBe(0);
    expect(baseAmountOnDay(c, "2026-02-02")).toBe(450); // Mon in window
  });
});

describe("reducers", () => {
  it("stack multiplicatively", () => {
    const c = cap();
    const reducers: Reducer[] = [
      { id: "r1", label: "a", multiplier: 0.5, start: "2026-01-01", end: "2026-12-31" },
      { id: "r2", label: "b", multiplier: 0.5, start: "2026-01-01", end: "2026-12-31" },
    ];
    // Mon: 450 * 0.5 * 0.5 = 112.5
    expect(effectiveCapacity([c], reducers, "2026-01-05", "sum").value).toBeCloseTo(112.5);
  });

  it("a zero multiplier is a blackout", () => {
    const c = cap();
    const reducers: Reducer[] = [
      { id: "r", label: "holiday", multiplier: 0, start: "2026-01-05", end: "2026-01-05" },
    ];
    expect(effectiveCapacity([c], reducers, "2026-01-05", "sum").value).toBe(0);
  });

  it("only matches by tags when a filter is present", () => {
    const uk = cap({ id: "uk", tags: { country: "UK" } });
    const de = cap({ id: "de", tags: { country: "DE" } });
    const reducers: Reducer[] = [
      { id: "r", label: "uk-only", multiplier: 0, start: "2026-01-01", end: "2026-12-31", tags: { country: "UK" } },
    ];
    const byTrack = effectiveCapacityByTrack([uk, de], reducers, "2026-01-05");
    // UK zeroed, DE untouched → both in same (default) track summed = 450
    expect(effectiveCapacity([uk, de], reducers, "2026-01-05", "sum").value).toBe(450);
    expect(byTrack.get("")).toBe(450);
  });
});

describe("composition", () => {
  const dev = cap({ id: "dev", track: "engineer", amount: 20, weekdays: ["mon", "tue", "wed", "thu", "fri"] });
  const ci = cap({ id: "ci", track: "pipeline", amount: 8, weekdays: ["mon", "tue", "wed", "thu", "fri"] });

  it("sum adds tracks", () => {
    expect(effectiveCapacity([dev, ci], [], "2026-01-05", "sum").value).toBe(28);
  });

  it("min takes the weakest track and names the constraint", () => {
    const r = effectiveCapacity([dev, ci], [], "2026-01-05", "min");
    expect(r.value).toBe(8);
    expect(r.constraintTrack).toBe("pipeline");
  });

  it("min with a blacked-out required track is 0", () => {
    const reducers: Reducer[] = [
      { id: "r", label: "ci down", multiplier: 0, start: "2026-01-05", end: "2026-01-05", track: "pipeline" },
    ];
    const r = effectiveCapacity([dev, ci], reducers, "2026-01-05", "min");
    expect(r.value).toBe(0);
    expect(r.constraintTrack).toBe("pipeline");
  });
});
