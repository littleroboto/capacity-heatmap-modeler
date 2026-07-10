import type { ComputeResult } from "./types";

export interface KpiSet {
  /** Aggregate intensity: Σload ÷ Σreference over non-blackout cells (never a mean of ratios). */
  meanIntensity: number;
  peakIntensity: number;
  overloadedDays: number;
  blackoutDays: number;
  overBlackoutDays: number;
  /** Active (non-empty, non-blackout) day count. */
  activeDays: number;
  /** Total slack = Σ(reference − load) over non-blackout cells (Subtractive). */
  headroom: number;
  mode: string;
  unit: string;
}

export function computeKpis(result: ComputeResult): KpiSet {
  let totalLoad = 0;
  let totalRef = 0;
  let peak = 0;
  let overloaded = 0;
  let blackout = 0;
  let overBlackout = 0;
  let active = 0;
  let intensitySum = 0;
  let intensityCount = 0;

  const additive = result.config.mode === "additive";

  for (const s of result.subjects) {
    for (const c of s.cells) {
      if (c.state === "blackout") {
        blackout++;
        if (c.overBlackout) overBlackout++;
        continue;
      }
      if (c.state === "outside") continue;

      totalLoad += c.load;
      totalRef += c.reference;
      intensitySum += c.intensity;
      intensityCount++;
      if (c.intensity > peak) peak = c.intensity;
      if (!additive && c.intensity > 1) overloaded++;
      if (c.state === "active") active++;
    }
  }

  const meanIntensity = additive
    ? intensityCount > 0
      ? intensitySum / intensityCount
      : 0
    : totalRef > 0
      ? totalLoad / totalRef
      : 0;

  return {
    meanIntensity,
    peakIntensity: peak,
    overloadedDays: overloaded,
    blackoutDays: blackout,
    overBlackoutDays: overBlackout,
    activeDays: active,
    headroom: additive ? 0 : totalRef - totalLoad,
    mode: result.config.mode,
    unit: result.config.unit,
  };
}
