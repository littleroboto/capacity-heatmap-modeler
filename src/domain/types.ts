// Domain types for the Capacity Heatmap Modeler.
// Vocabulary follows CONTEXT.md; keep names aligned with the glossary.

export type Mode = "subtractive" | "additive";

/** How a Subject's Tracks combine into Effective Capacity (ADR-0004). */
export type Composition = "sum" | "min";

/** ISO calendar date, "YYYY-MM-DD". */
export type ISODate = string;

/** Monday..Sunday, matching JS getDay remapped so Monday = 0. */
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAYS: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const WEEKDAYS_MON_FRI: Weekday[] = ["mon", "tue", "wed", "thu", "fri"];

/** A config-declared attribute that Capacity/Consumer entries can be tagged with. */
export interface DimensionDef {
  id: string;
  label: string;
  values: string[];
}

/** Tag values keyed by Dimension id. */
export type Tags = Record<string, string>;

/** Base Capacity source. In composite Subjects it belongs to a Track. */
export interface Capacity {
  id: string;
  label: string;
  /** Amount per active day, in the Scenario's Declared Unit. */
  amount: number;
  /** Active weekdays; default Mon–Fri. Inactive weekdays contribute 0. */
  weekdays?: Weekday[];
  /** Track name for composite capacity; omitted = the default single Track. */
  track?: string;
  tags?: Tags;
  /** Optional active window. */
  start?: ISODate;
  end?: ISODate;
}

/** Lowers capacity over a span (Subtractive mode only). */
export interface Reducer {
  id: string;
  label: string;
  /** Multiplier in [0,1]; 0 = Blackout. */
  multiplier: number;
  start: ISODate;
  end: ISODate;
  /** Optional weekday restriction (e.g. recurring weekend reducer). */
  weekdays?: Weekday[];
  /** Matches Capacity entries whose tags include all of these. Empty = all. */
  tags?: Tags;
  /** Optionally scope to a single Track. */
  track?: string;
}

export type LoadShape =
  | { type: "flat" }
  | { type: "ramp"; from: number; to: number }
  | { type: "phases"; phases: Phase[] };

export interface Phase {
  name: string;
  /** Length of this phase in days (sequential from the range start). */
  days: number;
  /** Load amount during this phase, in the Declared Unit. */
  amount: number;
}

interface ConsumerBase {
  id: string;
  label: string;
  /** Load amount per active day (Recurring) or base for a flat Shape (Spanning). */
  amount: number;
  tags?: Tags;
  track?: string;
  /** Optional categorisation (a kind of Dimension value), e.g. "meeting". */
  category?: string;
}

export interface RecurringConsumer extends ConsumerBase {
  kind: "recurring";
  weekdays?: Weekday[]; // default Mon–Fri
  start?: ISODate;
  end?: ISODate;
}

export interface SpanningConsumer extends ConsumerBase {
  kind: "spanning";
  start: ISODate;
  end: ISODate;
  shape: LoadShape;
}

export type Consumer = RecurringConsumer | SpanningConsumer;

export interface RampStop {
  /** Position on the intensity scale, 0..1+ (1 = full red / Reference). */
  at: number;
  /** CSS colour. */
  color: string;
}

export interface ScenarioConfig {
  name: string;
  mode: Mode;
  unit: string;
  start: ISODate;
  end: ISODate;
  dimensions: DimensionDef[];
  /** Dimension id to facet by (produces small multiples). Empty = single aggregate. */
  facetBy?: string;
  /** Default Track composition for Subjects. */
  composition: Composition;
  /** Additive mode: fixed Normalisation Max. If absent, the data max is used. */
  normalisationMax?: number;
  /** Optional custom ramp; a sensible thermal default is used otherwise. */
  ramp?: RampStop[];
  /** Optional notes shown on the one-page visual. */
  description?: string;
}

export interface Scenario {
  config: ScenarioConfig;
  capacities: Capacity[];
  reducers: Reducer[];
  consumers: Consumer[];
}

export type CellState = "empty" | "active" | "blackout" | "outside";

/** One computed Cell: a Subject on a day. */
export interface Cell {
  date: ISODate;
  load: number;
  /** Effective Capacity (Subtractive) or the Normalisation Max (Additive). */
  reference: number;
  /** Load Intensity in [0,1+]; NaN-safe (0 when reference is 0). */
  intensity: number;
  state: CellState;
  /** True when load lands on a Blackout day (flagged). */
  overBlackout: boolean;
  /** Under min composition, the constraining Track (if any). */
  constraintTrack?: string;
}

export interface SubjectSeries {
  /** Facet value, or "All" for the aggregate. */
  subject: string;
  cells: Cell[];
}

export interface ComputeResult {
  config: ScenarioConfig;
  subjects: SubjectSeries[];
  /** The intensity value mapping to full red (Additive: normMax; Subtractive: 1). */
  referenceLabel: string;
}
