import { useMemo } from "react";
import type { Cell, RampStop, SubjectSeries } from "../domain/types";
import { addDays, monthLabel, weekStart } from "../domain/dates";
import { BLACKOUT_COLOR, colorFor, EMPTY_COLOR, OUTSIDE_COLOR } from "../domain/ramp";
import { num, pct, prettyDate } from "./format";

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 18; // month labels
const LEFT = 26; // weekday labels
const DOW = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

interface Props {
  series: SubjectSeries;
  start: string;
  end: string;
  unit: string;
  mode: string;
  ramp?: RampStop[];
}

function cellColor(cell: Cell | undefined, ramp?: RampStop[]): string {
  if (!cell || cell.state === "outside") return OUTSIDE_COLOR;
  if (cell.state === "blackout") return BLACKOUT_COLOR;
  if (cell.state === "empty") return EMPTY_COLOR;
  return colorFor(cell.intensity, ramp);
}

function tooltip(date: string, cell: Cell | undefined, unit: string, mode: string): string {
  if (!cell || cell.state === "outside") return prettyDate(date);
  const lines = [prettyDate(date)];
  if (cell.state === "blackout") {
    lines.push("Blackout — no capacity");
    if (cell.overBlackout) lines.push(`⚠ ${num(cell.load)} ${unit} scheduled on a blackout day`);
    return lines.join("\n");
  }
  lines.push(`Load: ${num(cell.load)} ${unit}`);
  if (mode === "subtractive") lines.push(`Capacity: ${num(cell.reference)} ${unit}`);
  lines.push(`Intensity: ${pct(cell.intensity)}`);
  if (cell.constraintTrack) lines.push(`Constraint: ${cell.constraintTrack}`);
  return lines.join("\n");
}

export function Heatmap({ series, start, end, unit, mode, ramp }: Props) {
  const { weeks, byDate, monthMarks } = useMemo(() => {
    const byDate = new Map<string, Cell>();
    for (const c of series.cells) byDate.set(c.date, c);

    const firstMon = weekStart(start);
    const lastMon = weekStart(end);
    const weeks: string[] = [];
    let cur = firstMon;
    while (cur <= lastMon) {
      weeks.push(cur);
      cur = addDays(cur, 7);
    }

    const monthMarks: { col: number; label: string }[] = [];
    let prevMonth = "";
    weeks.forEach((wk, col) => {
      const m = wk.slice(5, 7);
      if (m !== prevMonth) {
        monthMarks.push({ col, label: monthLabel(wk) });
        prevMonth = m;
      }
    });

    return { weeks, byDate, monthMarks };
  }, [series, start, end]);

  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;

  return (
    <div className="heatmap">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={`Heatmap for ${series.subject}`}>
        {monthMarks.map((m) => (
          <text key={m.col} className="axis" x={LEFT + m.col * STEP} y={TOP - 6}>
            {m.label}
          </text>
        ))}
        {DOW.map((d, row) =>
          d ? (
            <text key={row} className="axis" x={0} y={TOP + row * STEP + CELL - 2} textAnchor="start">
              {d}
            </text>
          ) : null
        )}
        {weeks.map((wk, col) =>
          Array.from({ length: 7 }, (_, row) => {
            const date = addDays(wk, row);
            const outside = date < start || date > end;
            const cell = outside ? undefined : byDate.get(date);
            const fill = outside ? OUTSIDE_COLOR : cellColor(cell, ramp);
            return (
              <g key={date}>
                <rect
                  className="cell"
                  x={LEFT + col * STEP}
                  y={TOP + row * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={fill}
                >
                  <title>{tooltip(date, cell, unit, mode)}</title>
                </rect>
                {cell?.overBlackout && (
                  <circle
                    cx={LEFT + col * STEP + CELL / 2}
                    cy={TOP + row * STEP + CELL / 2}
                    r={2}
                    fill="#c23b2e"
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
