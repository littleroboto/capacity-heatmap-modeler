import { useState } from "react";
import type { Capacity, Consumer, Reducer, Scenario, Tags } from "../domain/types";

type Tab = "capacities" | "reducers" | "consumers";

interface Props {
  scenario: Scenario;
  onChange: (next: Scenario) => void;
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function setTag(tags: Tags | undefined, key: string, value: string): Tags | undefined {
  const next = { ...(tags ?? {}) };
  if (value === "") delete next[key];
  else next[key] = value;
  return Object.keys(next).length ? next : undefined;
}

export function EntryTable({ scenario, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("consumers");
  const facet = scenario.config.facetBy;
  const facetDim = scenario.config.dimensions.find((d) => d.id === facet);

  const patch = (part: Partial<Scenario>) => onChange({ ...scenario, ...part });

  function TagSelect({ tags, onSet }: { tags: Tags | undefined; onSet: (t: Tags | undefined) => void }) {
    if (!facet || !facetDim) return null;
    return (
      <select
        className="control"
        value={tags?.[facet] ?? ""}
        onChange={(e) => onSet(setTag(tags, facet, e.target.value))}
        title={facetDim.label}
      >
        <option value="">all {facetDim.label.toLowerCase()}</option>
        {facetDim.values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    );
  }

  // ---- Capacities ----
  function renderCapacities() {
    const items = scenario.capacities;
    const update = (i: number, part: Partial<Capacity>) =>
      patch({ capacities: items.map((c, idx) => (idx === i ? { ...c, ...part } : c)) });
    const remove = (i: number) => patch({ capacities: items.filter((_, idx) => idx !== i) });
    const add = () =>
      patch({ capacities: [...items, { id: uid("cap"), label: "New capacity", amount: 100 }] });

    return (
      <div className="entry-list">
        {items.map((c, i) => (
          <div className="entry" key={c.id}>
            <div className="entry-top">
              <input className="control" value={c.label} onChange={(e) => update(i, { label: e.target.value })} />
              <button className="del" onClick={() => remove(i)} title="Delete">
                ✕
              </button>
            </div>
            <div className="grid2">
              <label className="mini">
                Amount / day
                <input
                  type="number"
                  className="control"
                  value={c.amount}
                  onChange={(e) => update(i, { amount: Number(e.target.value) })}
                />
              </label>
              <label className="mini">
                Track (optional)
                <input
                  className="control"
                  value={c.track ?? ""}
                  placeholder="—"
                  onChange={(e) => update(i, { track: e.target.value || undefined })}
                />
              </label>
            </div>
            {facetDim && (
              <div className="mini" style={{ marginTop: 6 }}>
                <TagSelect tags={c.tags} onSet={(t) => update(i, { tags: t })} />
              </div>
            )}
          </div>
        ))}
        <button className="btn add-row" onClick={add}>
          + Add capacity
        </button>
      </div>
    );
  }

  // ---- Reducers ----
  function renderReducers() {
    const items = scenario.reducers;
    const update = (i: number, part: Partial<Reducer>) =>
      patch({ reducers: items.map((r, idx) => (idx === i ? { ...r, ...part } : r)) });
    const remove = (i: number) => patch({ reducers: items.filter((_, idx) => idx !== i) });
    const add = () =>
      patch({
        reducers: [
          ...items,
          { id: uid("red"), label: "New reducer", multiplier: 0.5, start: scenario.config.start, end: scenario.config.end },
        ],
      });

    return (
      <div className="entry-list">
        {items.map((r, i) => (
          <div className="entry" key={r.id}>
            <div className="entry-top">
              <input className="control" value={r.label} onChange={(e) => update(i, { label: e.target.value })} />
              <span className="kind-badge">×{r.multiplier}</span>
              <button className="del" onClick={() => remove(i)} title="Delete">
                ✕
              </button>
            </div>
            <div className="grid2">
              <label className="mini">
                Multiplier (0–1)
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  className="control"
                  value={r.multiplier}
                  onChange={(e) => update(i, { multiplier: Number(e.target.value) })}
                />
              </label>
              <label className="mini">
                Track (optional)
                <input
                  className="control"
                  value={r.track ?? ""}
                  placeholder="—"
                  onChange={(e) => update(i, { track: e.target.value || undefined })}
                />
              </label>
            </div>
            <div className="grid2" style={{ marginTop: 6 }}>
              <label className="mini">
                Start
                <input type="date" className="control" value={r.start} onChange={(e) => update(i, { start: e.target.value })} />
              </label>
              <label className="mini">
                End
                <input type="date" className="control" value={r.end} onChange={(e) => update(i, { end: e.target.value })} />
              </label>
            </div>
            {facetDim && (
              <div className="mini" style={{ marginTop: 6 }}>
                <TagSelect tags={r.tags} onSet={(t) => update(i, { tags: t })} />
              </div>
            )}
          </div>
        ))}
        <button className="btn add-row" onClick={add}>
          + Add reducer
        </button>
      </div>
    );
  }

  // ---- Consumers ----
  function renderConsumers() {
    const items = scenario.consumers;
    const update = (i: number, part: Partial<Consumer>) =>
      patch({ consumers: items.map((c, idx) => (idx === i ? ({ ...c, ...part } as Consumer) : c)) });
    const remove = (i: number) => patch({ consumers: items.filter((_, idx) => idx !== i) });
    const addRecurring = () =>
      patch({ consumers: [...items, { id: uid("con"), label: "New recurring", kind: "recurring", amount: 30 }] });
    const addSpanning = () =>
      patch({
        consumers: [
          ...items,
          {
            id: uid("con"),
            label: "New spanning",
            kind: "spanning",
            amount: 100,
            start: scenario.config.start,
            end: scenario.config.end,
            shape: { type: "flat" },
          },
        ],
      });

    return (
      <div className="entry-list">
        {items.map((c, i) => (
          <div className="entry" key={c.id}>
            <div className="entry-top">
              <input className="control" value={c.label} onChange={(e) => update(i, { label: e.target.value })} />
              <span className="kind-badge">{c.kind}</span>
              <button className="del" onClick={() => remove(i)} title="Delete">
                ✕
              </button>
            </div>
            <div className="grid2">
              <label className="mini">
                {c.kind === "spanning" && c.shape.type !== "flat" ? "Base amount" : "Amount / day"}
                <input
                  type="number"
                  className="control"
                  value={c.amount}
                  onChange={(e) => update(i, { amount: Number(e.target.value) })}
                />
              </label>
              <label className="mini">
                Track (optional)
                <input
                  className="control"
                  value={c.track ?? ""}
                  placeholder="—"
                  onChange={(e) => update(i, { track: e.target.value || undefined })}
                />
              </label>
            </div>
            {c.kind === "spanning" && (
              <>
                <div className="grid2" style={{ marginTop: 6 }}>
                  <label className="mini">
                    Start
                    <input type="date" className="control" value={c.start} onChange={(e) => update(i, { start: e.target.value })} />
                  </label>
                  <label className="mini">
                    End
                    <input type="date" className="control" value={c.end} onChange={(e) => update(i, { end: e.target.value })} />
                  </label>
                </div>
                <div className="hint">
                  Shape: {c.shape.type}
                  {c.shape.type === "phases" ? ` (${c.shape.phases.length} phases)` : ""} — edit shapes in the YAML tab.
                </div>
              </>
            )}
            {facetDim && (
              <div className="mini" style={{ marginTop: 6 }}>
                <TagSelect tags={c.tags} onSet={(t) => update(i, { tags: t })} />
              </div>
            )}
          </div>
        ))}
        <div className="add-row" style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={addRecurring}>
            + Recurring
          </button>
          <button className="btn" onClick={addSpanning}>
            + Spanning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h3>Data</h3>
      <div className="entry-tabs">
        <button className={tab === "consumers" ? "active" : ""} onClick={() => setTab("consumers")}>
          Consumers ({scenario.consumers.length})
        </button>
        <button className={tab === "capacities" ? "active" : ""} onClick={() => setTab("capacities")}>
          Capacity ({scenario.capacities.length})
        </button>
        <button className={tab === "reducers" ? "active" : ""} onClick={() => setTab("reducers")}>
          Reducers ({scenario.reducers.length})
        </button>
      </div>
      {tab === "capacities" && renderCapacities()}
      {tab === "reducers" && renderReducers()}
      {tab === "consumers" && renderConsumers()}
    </div>
  );
}
