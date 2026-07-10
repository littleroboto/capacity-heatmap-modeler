import { useMemo, useRef, useState } from "react";
import type { Scenario, ScenarioConfig } from "./domain/types";
import { compute } from "./domain/compute";
import { computeKpis } from "./domain/kpis";
import { toYaml } from "./domain/yaml";
import { EXAMPLES } from "./domain/examples";
import { downloadText, exportPng, printPoster, slug } from "./export";
import { ConfigPanel } from "./ui/ConfigPanel";
import { EntryTable } from "./ui/EntryTable";
import { YamlDrawer } from "./ui/YamlDrawer";
import { Poster } from "./ui/Poster";
import { Toolbar } from "./ui/Toolbar";

// The Learn course is a standalone site synced into /learn at build time.
const learnHref = `${import.meta.env.BASE_URL}learn/index.html`;

// Deep clone so editing never mutates the shared example objects.
function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

export function App() {
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id);
  const [scenario, setScenario] = useState<Scenario>(() => clone(EXAMPLES[0].scenario));
  const [showYaml, setShowYaml] = useState(false);
  const [exporting, setExporting] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => compute(scenario), [scenario]);
  const kpis = useMemo(() => computeKpis(result), [result]);

  const patchConfig = (patch: Partial<ScenarioConfig>) =>
    setScenario((s) => ({ ...s, config: { ...s.config, ...patch } }));

  const loadExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setExampleId(id);
    setScenario(clone(ex.scenario));
  };

  const handleExportPng = async () => {
    if (!posterRef.current) return;
    setExporting(true);
    try {
      await exportPng(posterRef.current, `${slug(scenario.config.name)}.png`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark" />
          <span className="brand-name">Capacity Heatmap Modeler</span>
          <small>· timeseries capacity, one page</small>
        </div>
        <div className="spacer" />
        <Toolbar
          currentExampleId={exampleId}
          onLoadExample={loadExample}
          onLoadScenario={(s) => {
            setScenario(s);
          }}
          onExportYaml={() => downloadText(`${slug(scenario.config.name)}.yaml`, toYaml(scenario))}
          onExportPng={handleExportPng}
          onPrint={printPoster}
          exporting={exporting}
        />
        <span className="topbar-divider" />
        <a className="learn-link" href={learnHref} target="_blank" rel="noreferrer">
          Learn
          <span className="ext" aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <ConfigPanel config={scenario.config} onChange={patchConfig} />
          <EntryTable scenario={scenario} onChange={setScenario} />
          <div className="yaml-toggle">
            <button className="btn ghost" onClick={() => setShowYaml((v) => !v)}>
              {showYaml ? "▾ Hide YAML" : "▸ Edit raw YAML"}
            </button>
          </div>
          {showYaml && <YamlDrawer scenario={scenario} onApply={setScenario} />}
        </aside>
        <main className="main">
          <Poster ref={posterRef} scenario={scenario} result={result} kpis={kpis} />
        </main>
      </div>
    </div>
  );
}
