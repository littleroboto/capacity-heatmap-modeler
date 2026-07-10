import { describe, it, expect } from "vitest";
import { compute, subjectsOf } from "./compute";
import { computeKpis } from "./kpis";
import { deployPipeline, qsrCalendar, teamWorkload } from "./examples";

function cellOn(result: ReturnType<typeof compute>, subject: string, date: string) {
  const s = result.subjects.find((x) => x.subject === subject)!;
  return s.cells.find((c) => c.date === date)!;
}

describe("compute — subtractive faceting", () => {
  const result = compute(teamWorkload());

  it("produces one series per facet value", () => {
    expect(subjectsOf(teamWorkload())).toEqual(["Ada", "Blake", "Chen"]);
    expect(result.subjects.map((s) => s.subject)).toEqual(["Ada", "Blake", "Chen"]);
  });

  it("marks the summer shutdown as a blackout", () => {
    const cell = cellOn(result, "Ada", "2026-08-12"); // Wed in shutdown week
    expect(cell.state).toBe("blackout");
  });

  it("treats an ordinary weekend as empty, not blackout", () => {
    const sat = cellOn(result, "Ada", "2026-01-10"); // Sat, no load
    expect(sat.state).toBe("empty");
  });

  it("flags work scheduled on a non-capacity day as blackout", () => {
    // Blake's on-call spans weekends; Sat 2026-05-02 has load but no weekday capacity.
    const sat = cellOn(result, "Blake", "2026-05-02");
    expect(sat.state).toBe("blackout");
    expect(sat.overBlackout).toBe(true);
  });

  it("intensity = load ÷ effective capacity on a normal day", () => {
    // Ada, Mon 2026-01-05: standup 15 + admin 60 = 75; cap 450 * 0.85 focus = 382.5
    const cell = cellOn(result, "Ada", "2026-01-05");
    expect(cell.load).toBeCloseTo(75);
    expect(cell.reference).toBeCloseTo(382.5);
    expect(cell.intensity).toBeCloseTo(75 / 382.5, 4);
  });
});

describe("compute — additive normalisation", () => {
  it("uses the fixed Normalisation Max as the reference", () => {
    const result = compute(qsrCalendar());
    const anyActive = result.subjects[0].cells.find((c) => c.state === "active")!;
    expect(anyActive.reference).toBe(110);
    expect(anyActive.intensity).toBeCloseTo(anyActive.load / 110, 6);
  });
});

describe("compute — coupled composition (min)", () => {
  const result = compute(deployPipeline());
  const subject = result.subjects[0];

  it("caps effective capacity at the pipeline track and names the constraint", () => {
    const cell = subject.cells.find((c) => c.date === "2026-01-05")!; // Mon
    expect(cell.reference).toBe(8); // min(20, 8)
    expect(cell.constraintTrack).toBe("pipeline");
    expect(cell.intensity).toBeCloseTo(6 / 8, 4); // 6 BAU deploys
  });

  it("shows overload during the release crunch", () => {
    const kpis = computeKpis(result);
    expect(kpis.overloadedDays).toBeGreaterThan(0);
  });
});

describe("kpis aggregate by numerator/denominator, not mean of ratios", () => {
  it("mean intensity is Σload ÷ Σreference for subtractive", () => {
    const result = compute(teamWorkload());
    const kpis = computeKpis(result);
    expect(kpis.meanIntensity).toBeGreaterThan(0);
    expect(kpis.meanIntensity).toBeLessThan(2);
    expect(kpis.blackoutDays).toBeGreaterThan(0);
  });
});
