import type { RampStop } from "../domain/types";
import { BLACKOUT_COLOR, DEFAULT_RAMP, EMPTY_COLOR } from "../domain/ramp";

interface Props {
  mode: string;
  ramp?: RampStop[];
}

export function Legend({ mode, ramp = DEFAULT_RAMP }: Props) {
  const gradient = ramp
    .map((s) => `${s.color} ${Math.min(100, (s.at / 1.3) * 100)}%`)
    .join(", ");

  return (
    <div className="legend">
      <div className="ramp">
        <div className="ramp-bar" style={{ background: `linear-gradient(90deg, ${gradient})` }} />
        <div className="ramp-scale">
          <span>low</span>
          <span>healthy</span>
          <span>{mode === "additive" ? "max" : "full (100%)"}</span>
          <span>over</span>
        </div>
      </div>
      <div className="swatches">
        <span className="swatch"><i style={{ background: EMPTY_COLOR }} /> empty / no load</span>
        {mode === "subtractive" && (
          <span className="swatch"><i style={{ background: BLACKOUT_COLOR }} /> blackout (no capacity)</span>
        )}
        {mode === "subtractive" && (
          <span className="swatch">
            <i style={{ background: "#fff", position: "relative" }}>
              <svg width="12" height="12" style={{ position: "absolute", inset: 0 }}>
                <circle cx="6" cy="6" r="2" fill="#c23b2e" />
              </svg>
            </i>
            load on a blackout day
          </span>
        )}
      </div>
    </div>
  );
}
