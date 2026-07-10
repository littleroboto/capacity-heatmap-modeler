import type { RampStop } from "./types";

/** Bright, saturated thermal ramp: sky → blue → teal → green → yellow → orange → red → deep red. */
export const DEFAULT_RAMP: RampStop[] = [
  { at: 0.0, color: "#e3f3fd" }, // pale sky — just above empty
  { at: 0.15, color: "#2196f3" }, // bright blue — low / spare
  { at: 0.35, color: "#00c6ae" }, // turquoise
  { at: 0.5, color: "#3ddc4a" }, // fresh green — healthy band
  { at: 0.65, color: "#ffd21f" }, // sunny yellow — busy
  { at: 0.8, color: "#ff8c1a" }, // vivid orange — high
  { at: 1.0, color: "#ff1f3d" }, // vivid red — at Reference (full)
  { at: 1.3, color: "#b3001b" }, // deep red — overload
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
