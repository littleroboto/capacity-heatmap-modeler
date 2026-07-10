import type { KpiSet } from "../domain/kpis";
import { num, pct } from "./format";

interface Card {
  label: string;
  value: string;
  tone?: "warn" | "good";
}

export function KpiStrip({ kpis }: { kpis: KpiSet }) {
  const additive = kpis.mode === "additive";
  const cards: Card[] = [];

  cards.push({ label: additive ? "Mean intensity (of max)" : "Mean utilisation", value: pct(kpis.meanIntensity) });
  cards.push({
    label: "Peak intensity",
    value: pct(kpis.peakIntensity),
    tone: kpis.peakIntensity > 1 ? "warn" : undefined,
  });

  if (additive) {
    cards.push({ label: "Active days", value: String(kpis.activeDays) });
  } else {
    cards.push({
      label: "Overloaded days",
      value: String(kpis.overloadedDays),
      tone: kpis.overloadedDays > 0 ? "warn" : "good",
    });
    cards.push({ label: "Blackout days", value: String(kpis.blackoutDays) });
    cards.push({
      label: `Headroom (${kpis.unit})`,
      value: num(kpis.headroom),
      tone: kpis.headroom < 0 ? "warn" : undefined,
    });
    if (kpis.overBlackoutDays > 0) {
      cards.push({ label: "Load on blackout", value: String(kpis.overBlackoutDays), tone: "warn" });
    }
  }

  return (
    <div className="kpis">
      {cards.map((c) => (
        <div key={c.label} className={`kpi${c.tone ? " " + c.tone : ""}`}>
          <div className="value">{c.value}</div>
          <div className="label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
