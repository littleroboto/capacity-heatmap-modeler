import { describe, it, expect } from "vitest";
import { fromYaml, toYaml, ScenarioParseError } from "./yaml";
import { teamWorkload, qsrCalendar, deployPipeline } from "./examples";
import { compute } from "./compute";

describe("yaml round-trip", () => {
  for (const make of [teamWorkload, qsrCalendar, deployPipeline]) {
    it(`preserves ${make().config.name}`, () => {
      const original = make();
      const restored = fromYaml(toYaml(original));
      // Structural equality of the meaningful content.
      expect(restored.config.mode).toBe(original.config.mode);
      expect(restored.consumers.length).toBe(original.consumers.length);
      // And the computed result is identical.
      expect(compute(restored)).toEqual(compute(original));
    });
  }

  it("applies defaults for optional fields", () => {
    const s = fromYaml(`
config:
  name: Minimal
  start: 2026-01-01
  end: 2026-01-31
`);
    expect(s.config.mode).toBe("subtractive");
    expect(s.config.composition).toBe("sum");
    expect(s.capacities).toEqual([]);
    expect(s.consumers).toEqual([]);
  });

  it("throws on an inverted date window", () => {
    expect(() =>
      fromYaml("config:\n  name: X\n  start: 2026-12-31\n  end: 2026-01-01\n")
    ).toThrow(ScenarioParseError);
  });
});
