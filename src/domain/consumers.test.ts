import { describe, it, expect } from "vitest";
import type { RecurringConsumer, SpanningConsumer } from "./types";
import { amountOnDay, loadOnDay } from "./consumers";

describe("recurring consumer", () => {
  const standup: RecurringConsumer = {
    id: "s",
    label: "standup",
    kind: "recurring",
    amount: 15,
    weekdays: ["mon", "tue", "wed", "thu", "fri"],
  };
  it("fires on active weekdays only", () => {
    expect(amountOnDay(standup, "2026-01-05")).toBe(15); // Mon
    expect(amountOnDay(standup, "2026-01-10")).toBe(0); // Sat
  });
});

describe("spanning consumer", () => {
  it("flat shape holds the base amount across the range", () => {
    const c: SpanningConsumer = {
      id: "f", label: "flat", kind: "spanning", amount: 100,
      start: "2026-03-01", end: "2026-03-31", shape: { type: "flat" },
    };
    expect(amountOnDay(c, "2026-03-15")).toBe(100);
    expect(amountOnDay(c, "2026-04-01")).toBe(0);
  });

  it("ramp interpolates from start to end", () => {
    const c: SpanningConsumer = {
      id: "r", label: "ramp", kind: "spanning", amount: 0,
      start: "2026-01-01", end: "2026-01-11", shape: { type: "ramp", from: 0, to: 100 },
    };
    expect(amountOnDay(c, "2026-01-01")).toBeCloseTo(0);
    expect(amountOnDay(c, "2026-01-06")).toBeCloseTo(50); // midpoint of 11 days
    expect(amountOnDay(c, "2026-01-11")).toBeCloseTo(100);
  });

  it("phases apply sequentially by day count", () => {
    const c: SpanningConsumer = {
      id: "p", label: "campaign", kind: "spanning", amount: 0,
      start: "2026-06-01", end: "2026-06-10",
      shape: { type: "phases", phases: [
        { name: "prep", days: 3, amount: 10 },
        { name: "live", days: 4, amount: 80 },
      ] },
    };
    expect(amountOnDay(c, "2026-06-01")).toBe(10); // prep
    expect(amountOnDay(c, "2026-06-03")).toBe(10); // last prep day
    expect(amountOnDay(c, "2026-06-04")).toBe(80); // first live day
    expect(amountOnDay(c, "2026-06-07")).toBe(80); // last live day
    expect(amountOnDay(c, "2026-06-08")).toBe(0); // beyond defined phases
  });
});

describe("loadOnDay", () => {
  it("sums active consumers (layering = summation)", () => {
    const a: RecurringConsumer = { id: "a", label: "a", kind: "recurring", amount: 15 };
    const b: RecurringConsumer = { id: "b", label: "b", kind: "recurring", amount: 30 };
    expect(loadOnDay([a, b], "2026-01-05")).toBe(45);
  });
});
