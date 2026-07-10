import { forwardRef } from "react";
import type { ComputeResult, Scenario } from "../domain/types";
import type { KpiSet } from "../domain/kpis";
import { Heatmap } from "./Heatmap";
import { KpiStrip } from "./KpiStrip";
import { Legend } from "./Legend";
import { pct, prettyDate } from "./format";

interface Props {
  scenario: Scenario;
  result: ComputeResult;
  kpis: KpiSet;
}

export const Poster = forwardRef<HTMLDivElement, Props>(function Poster({ scenario, result, kpis }, ref) {
  const { config } = scenario;
  const facetDim = config.dimensions.find((d) => d.id === config.facetBy);

  const subtitleBits = [
    `${prettyDate(config.start)} – ${prettyDate(config.end)}`,
    config.unit,
    facetDim ? `faceted by ${facetDim.label.toLowerCase()}` : "single view",
    config.composition === "min" ? "coupled (min)" : "summed",
  ];

  const events = scenario.consumers.filter((c) => c.kind === "spanning");

  const peakOf = (subject: string): number => {
    const s = result.subjects.find((x) => x.subject === subject);
    if (!s) return 0;
    return s.cells.reduce((m, c) => (c.intensity > m ? c.intensity : m), 0);
  };

  return (
    <div className="poster" ref={ref}>
      <header className="poster-head">
        <h1>{config.name}</h1>
        <div className="subtitle">
          <span className={`badge ${config.mode}`}>{config.mode}</span>{" "}
          {subtitleBits.join(" · ")}
        </div>
        {config.description && <div className="desc">{config.description}</div>}
      </header>

      <KpiStrip kpis={kpis} />

      <div className="heatmaps">
        {result.subjects.map((s) => (
          <div className="heatmap-block" key={s.subject}>
            <div className="subject-label">
              {s.subject}
              <span className="meta">peak {pct(peakOf(s.subject))}</span>
            </div>
            <Heatmap
              series={s}
              start={config.start}
              end={config.end}
              unit={config.unit}
              mode={config.mode}
              ramp={config.ramp}
            />
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <div className="events">
          <h4>Scheduled activity</h4>
          <ul>
            {events.map((e) => {
              const subj = facetDim && e.tags?.[facetDim.id];
              return (
                <li key={e.id}>
                  <span className="chip" />
                  <span>
                    <b>{e.label}</b>
                    {subj ? ` · ${subj}` : ""}
                    <br />
                    {"start" in e && "end" in e ? `${prettyDate(e.start)} – ${prettyDate(e.end)}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Legend mode={config.mode} ramp={config.ramp} />
    </div>
  );
});
