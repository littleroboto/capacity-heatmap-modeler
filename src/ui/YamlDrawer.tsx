import { useEffect, useState } from "react";
import type { Scenario } from "../domain/types";
import { fromYaml, toYaml } from "../domain/yaml";

interface Props {
  scenario: Scenario;
  onApply: (next: Scenario) => void;
}

export function YamlDrawer({ scenario, onApply }: Props) {
  const [text, setText] = useState(() => toYaml(scenario));
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Re-sync when the scenario changes externally (e.g. example switch / table edit),
  // unless the user has unapplied edits in the textarea.
  useEffect(() => {
    if (!dirty) setText(toYaml(scenario));
  }, [scenario, dirty]);

  const apply = () => {
    try {
      const next = fromYaml(text);
      setError(null);
      setDirty(false);
      onApply(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const revert = () => {
    setText(toYaml(scenario));
    setDirty(false);
    setError(null);
  };

  return (
    <div className="section yaml-drawer">
      <h3>Scenario YAML</h3>
      <textarea
        className="control"
        value={text}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          setDirty(true);
        }}
      />
      <div className="yaml-actions">
        <button className="btn primary" onClick={apply} disabled={!dirty}>
          Apply
        </button>
        <button className="btn" onClick={revert} disabled={!dirty}>
          Revert
        </button>
        {dirty && !error && <span className="hint">Unapplied changes</span>}
      </div>
      {error && <div className="yaml-error">⚠ {error}</div>}
    </div>
  );
}
