import type { ScenarioConfig } from "../domain/types";

interface Props {
  config: ScenarioConfig;
  onChange: (patch: Partial<ScenarioConfig>) => void;
}

export function ConfigPanel({ config, onChange }: Props) {
  return (
    <>
      <div className="section">
        <h3>Setup</h3>

        <div className="field">
          <label>Name</label>
          <input className="control" value={config.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Mode</label>
            <select
              className="control"
              value={config.mode}
              onChange={(e) => onChange({ mode: e.target.value as ScenarioConfig["mode"] })}
            >
              <option value="subtractive">Subtractive (capacity used up)</option>
              <option value="additive">Additive (load layered in)</option>
            </select>
          </div>
          <div className="field">
            <label>Unit</label>
            <input className="control" value={config.unit} onChange={(e) => onChange({ unit: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Timeframe</h3>

        <div className="field-row">
          <div className="field">
            <label>Start</label>
            <input type="date" className="control" value={config.start} onChange={(e) => onChange({ start: e.target.value })} />
          </div>
          <div className="field">
            <label>End</label>
            <input type="date" className="control" value={config.end} onChange={(e) => onChange({ end: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="section">
        <h3>View</h3>

        <div className="field-row">
          <div className="field">
            <label>Facet by</label>
            <select
              className="control"
              value={config.facetBy ?? ""}
              onChange={(e) => onChange({ facetBy: e.target.value || undefined })}
            >
              <option value="">(single view)</option>
              {config.dimensions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Composition</label>
            <select
              className="control"
              value={config.composition}
              onChange={(e) => onChange({ composition: e.target.value as ScenarioConfig["composition"] })}
            >
              <option value="sum">Sum (fungible tracks)</option>
              <option value="min">Min (coupled bottleneck)</option>
            </select>
          </div>
        </div>

        {config.mode === "additive" && (
          <div className="field">
            <label>Normalisation max (blank = data max)</label>
            <input
              type="number"
              className="control"
              value={config.normalisationMax ?? ""}
              onChange={(e) => onChange({ normalisationMax: e.target.value === "" ? undefined : Number(e.target.value) })}
            />
          </div>
        )}
      </div>
    </>
  );
}
