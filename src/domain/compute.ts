import type {
  Capacity,
  Cell,
  Consumer,
  ComputeResult,
  Reducer,
  Scenario,
  SubjectSeries,
  Tags,
} from "./types";
import { eachDay } from "./dates";
import { baseCapacityTotal, effectiveCapacity } from "./capacity";
import { loadOnDay } from "./consumers";

const AGGREGATE = "All";

export function subjectsOf(scenario: Scenario): string[] {
  const facet = scenario.config.facetBy;
  if (!facet) return [AGGREGATE];
  const dim = scenario.config.dimensions.find((d) => d.id === facet);
  return dim ? dim.values : [AGGREGATE];
}

/** An entry belongs to a Subject if it is untagged on the facet Dimension (global) or matches. */
function belongsToSubject(tags: Tags | undefined, facet: string | undefined, subject: string): boolean {
  if (!facet || subject === AGGREGATE) return true;
  const v = tags?.[facet];
  return v === undefined || v === subject;
}

interface RawCell {
  date: string;
  load: number;
  reference: number;
  /** Base capacity before Reducers — distinguishes "off day" from "blackout". */
  base: number;
  constraintTrack?: string;
}

export function compute(scenario: Scenario): ComputeResult {
  const { config } = scenario;
  const facet = config.facetBy;
  const subjects = subjectsOf(scenario);
  const days = eachDay(config.start, config.end);
  const isAdditive = config.mode === "additive";

  // Pass 1 — raw loads and capacities per subject/day.
  const rawBySubject = new Map<string, RawCell[]>();
  let dataMaxLoad = 0;

  for (const subject of subjects) {
    const caps: Capacity[] = scenario.capacities.filter((c) => belongsToSubject(c.tags, facet, subject));
    const reducers: Reducer[] = scenario.reducers.filter((r) => belongsToSubject(r.tags, facet, subject));
    const consumers: Consumer[] = scenario.consumers.filter((c) => belongsToSubject(c.tags, facet, subject));

    const raw: RawCell[] = days.map((date) => {
      const load = loadOnDay(consumers, date);
      if (load > dataMaxLoad) dataMaxLoad = load;
      if (isAdditive) {
        return { date, load, reference: 0, base: 0 };
      }
      const eff = effectiveCapacity(caps, reducers, date, config.composition);
      return {
        date,
        load,
        reference: eff.value,
        base: baseCapacityTotal(caps, date),
        constraintTrack: eff.constraintTrack || undefined,
      };
    });
    rawBySubject.set(subject, raw);
  }

  // Additive Reference: fixed Normalisation Max, or the data max.
  const normMax = isAdditive ? config.normalisationMax ?? (dataMaxLoad || 1) : 0;

  // Pass 2 — finalise cells with intensity + state.
  const series: SubjectSeries[] = subjects.map((subject) => {
    const raw = rawBySubject.get(subject)!;
    const cells: Cell[] = raw.map((rc) => {
      if (isAdditive) {
        const intensity = normMax > 0 ? rc.load / normMax : 0;
        return {
          date: rc.date,
          load: rc.load,
          reference: normMax,
          intensity,
          state: rc.load === 0 ? "empty" : "active",
          overBlackout: false,
        };
      }
      if (rc.reference === 0) {
        // No effective capacity. An ordinary off-day (no base capacity, no load)
        // reads as empty; a working day driven to zero — or work scheduled on a
        // non-capacity day — is a Blackout, flagged when load lands on it.
        if (rc.base === 0 && rc.load === 0) {
          return {
            date: rc.date,
            load: 0,
            reference: 0,
            intensity: 0,
            state: "empty",
            overBlackout: false,
          };
        }
        return {
          date: rc.date,
          load: rc.load,
          reference: 0,
          intensity: 0,
          state: "blackout",
          overBlackout: rc.load > 0,
          constraintTrack: rc.constraintTrack,
        };
      }
      return {
        date: rc.date,
        load: rc.load,
        reference: rc.reference,
        intensity: rc.reference > 0 ? rc.load / rc.reference : 0,
        state: rc.load === 0 ? "empty" : "active",
        overBlackout: false,
        constraintTrack: rc.constraintTrack,
      };
    });
    return { subject, cells };
  });

  return {
    config,
    subjects: series,
    referenceLabel: isAdditive ? `${normMax} ${config.unit} (max)` : `capacity (${config.unit})`,
  };
}
