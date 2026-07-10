import type { RampStop } from "./types";

/** Traditional thermal ramp: blue (low) → green (healthy) → yellow → orange → red → deep red (overload). */
export const DEFAULT_RAMP: RampStop[] = [
  { at: 0.0, color: "#dbe4e8" }, // pale — just above empty
  { at: 0.2, color: "#2f6f8f" }, // blue — low / spare
  { at: 0.45, color: "#3f9e6b" }, // green — healthy band
  { at: 0.7, color: "#d9b53f" }, // yellow — busy
  { at: 0.85, color: "#db8a3a" }, // orange — high
  { at: 1.0, color: "#c23b2e" }, // red — at Reference (full)
  { at: 1.3, color: "#7d211a" }, // deep red — overload
];

export const EMPTY_COLOR = "#eef1ec"; // zero load / empty cell
export const BLACKOUT_COLOR = "#b9bcc2"; // zero Effective Capacity (grey)
export const OUTSIDE_COLOR = "#f7f8f5"; // outside the horizon

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Colour for a Load Intensity on the ramp. Clamps below the first / above the last stop. */
export function colorFor(intensity: number, stops: RampStop[] = DEFAULT_RAMP): string {
  const t = Math.max(0, intensity);
  if (t <= stops[0].at) return stops[0].color;
  if (t >= stops[stops.length - 1].at) return stops[stops.length - 1].color;

  for (let i = 0; i < stops.length - 1; i++) {
    const lo = stops[i];
    const hi = stops[i + 1];
    if (t >= lo.at && t <= hi.at) {
      const f = (t - lo.at) / (hi.at - lo.at);
      const [r1, g1, b1] = hexToRgb(lo.color);
      const [r2, g2, b2] = hexToRgb(hi.color);
      return `rgb(${Math.round(lerp(r1, r2, f))}, ${Math.round(lerp(g1, g2, f))}, ${Math.round(lerp(b1, b2, f))})`;
    }
  }
  return stops[stops.length - 1].color;
}
