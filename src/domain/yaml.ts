import yaml from "js-yaml";
import type { Scenario, ScenarioConfig } from "./types";

/** Serialise a Scenario to canonical YAML. */
export function toYaml(scenario: Scenario): string {
  return yaml.dump(scenario, { noRefs: true, sortKeys: false, lineWidth: 100 });
}

class ScenarioParseError extends Error {}

function req<T>(v: T | undefined, name: string): T {
  if (v === undefined || v === null) throw new ScenarioParseError(`Missing required field: ${name}`);
  return v;
}

/** Parse YAML into a Scenario, applying defaults and light validation. */
export function fromYaml(text: string): Scenario {
  const doc = yaml.load(text) as Partial<Scenario> | undefined;
  if (!doc || typeof doc !== "object") throw new ScenarioParseError("Empty or invalid YAML.");

  const cfgIn = req(doc.config, "config") as Partial<ScenarioConfig>;
  const config: ScenarioConfig = {
    name: cfgIn.name ?? "Untitled scenario",
    mode: cfgIn.mode === "additive" ? "additive" : "subtractive",
    unit: cfgIn.unit ?? "units",
    start: req(cfgIn.start, "config.start"),
    end: req(cfgIn.end, "config.end"),
    dimensions: cfgIn.dimensions ?? [],
    facetBy: cfgIn.facetBy,
    composition: cfgIn.composition === "min" ? "min" : "sum",
    normalisationMax: cfgIn.normalisationMax,
    ramp: cfgIn.ramp,
    description: cfgIn.description,
  };

  if (config.start > config.end) {
    throw new ScenarioParseError("config.start must not be after config.end.");
  }

  return {
    config,
    capacities: doc.capacities ?? [],
    reducers: doc.reducers ?? [],
    consumers: doc.consumers ?? [],
  };
}

export { ScenarioParseError };
