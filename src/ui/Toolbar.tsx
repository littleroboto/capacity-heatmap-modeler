import { useRef, useState } from "react";
import type { Scenario } from "../domain/types";
import { EXAMPLES } from "../domain/examples";
import { fromYaml } from "../domain/yaml";

interface Props {
  currentExampleId: string;
  onLoadExample: (id: string) => void;
  onLoadScenario: (s: Scenario) => void;
  onExportYaml: () => void;
  onExportPng: () => void;
  onPrint: () => void;
  exporting: boolean;
}

export function Toolbar({
  currentExampleId,
  onLoadExample,
  onLoadScenario,
  onExportYaml,
  onExportPng,
  onPrint,
  exporting,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      onLoadScenario(fromYaml(text));
      setImportError(null);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="toolbar">
      <select
        className="control"
        value={currentExampleId}
        onChange={(e) => onLoadExample(e.target.value)}
        title="Load an example scenario"
      >
        {EXAMPLES.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.scenario.config.name}
          </option>
        ))}
        <option value="__custom" disabled>
          (edited / imported)
        </option>
      </select>

      <input
        ref={fileRef}
        type="file"
        accept=".yaml,.yml,text/yaml"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <button className="btn" onClick={() => fileRef.current?.click()} title={importError ?? "Import a scenario YAML"}>
        Import
      </button>
      <button className="btn" onClick={onExportYaml}>
        YAML
      </button>
      <button className="btn" onClick={onExportPng} disabled={exporting}>
        {exporting ? "…" : "PNG"}
      </button>
      <button className="btn primary" onClick={onPrint}>
        Print / PDF
      </button>
    </div>
  );
}
