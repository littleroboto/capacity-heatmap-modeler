import type { Scenario } from "./types";

const YEAR_START = "2026-01-01";
const YEAR_END = "2026-12-31";

/** A small team's workload — subtractive, faceted by person, rollup = summation. */
export function teamWorkload(): Scenario {
  return {
    config: {
      name: "Team workload — Platform squad",
      description: "Committed minutes per day. Facet by person; the aggregate rolls up by summation.",
      mode: "subtractive",
      unit: "minutes",
      start: YEAR_START,
      end: YEAR_END,
      dimensions: [{ id: "person", label: "Person", values: ["Ada", "Blake", "Chen"] }],
      facetBy: "person",
      composition: "sum",
    },
    capacities: [
      { id: "cap-ada", label: "Ada — working day", amount: 450, tags: { person: "Ada" } },
      { id: "cap-blake", label: "Blake — working day", amount: 450, tags: { person: "Blake" } },
      { id: "cap-chen", label: "Chen — working day", amount: 450, tags: { person: "Chen" } },
    ],
    reducers: [
      { id: "focus", label: "Focus factor (context switching)", multiplier: 0.85, start: YEAR_START, end: YEAR_END },
      { id: "summer-shutdown", label: "Summer shutdown", multiplier: 0, start: "2026-08-10", end: "2026-08-14" },
      { id: "chen-part-time", label: "Chen 60%", multiplier: 0.6, start: YEAR_START, end: YEAR_END, tags: { person: "Chen" } },
    ],
    consumers: [
      { id: "standup", label: "Daily standup", kind: "recurring", amount: 15 },
      { id: "admin", label: "Email & admin", kind: "recurring", amount: 60 },
      { id: "ada-1on1", label: "Ada 1:1s", kind: "recurring", amount: 60, weekdays: ["tue", "thu"], tags: { person: "Ada" } },
      {
        id: "ada-migration",
        label: "Ada — DB migration project",
        kind: "spanning",
        amount: 0,
        start: "2026-02-02",
        end: "2026-04-30",
        tags: { person: "Ada" },
        shape: { type: "phases", phases: [
          { name: "design", days: 20, amount: 120 },
          { name: "build", days: 40, amount: 300 },
          { name: "cutover", days: 28, amount: 200 },
        ] },
      },
      {
        id: "blake-oncall",
        label: "Blake — on-call load",
        kind: "spanning",
        amount: 0,
        start: "2026-05-01",
        end: "2026-06-30",
        tags: { person: "Blake" },
        shape: { type: "ramp", from: 60, to: 360 },
      },
      { id: "blake-meetings", label: "Blake — planning meetings", kind: "recurring", amount: 120, weekdays: ["mon", "wed", "fri"], tags: { person: "Blake" } },
      { id: "chen-support", label: "Chen — support rota", kind: "recurring", amount: 150, tags: { person: "Chen" } },
    ],
  };
}

/** QSR marketing calendar across countries — additive, faceted by country. */
export function qsrCalendar(): Scenario {
  const campaign = (
    id: string,
    label: string,
    country: string,
    start: string,
    end: string
  ) => ({
    id,
    label,
    kind: "spanning" as const,
    amount: 0,
    start,
    end,
    tags: { country },
    shape: { type: "phases" as const, phases: [
      { name: "prep", days: 14, amount: 25 },
      { name: "live", days: 21, amount: 90 },
      { name: "wind-down", days: 7, amount: 40 },
    ] },
  });

  return {
    config: {
      name: "QSR marketing calendar — EMEA",
      description: "Relative promo intensity by country (additive, no fixed capacity). Full red = a heavy promo week.",
      mode: "additive",
      unit: "promo load",
      start: YEAR_START,
      end: YEAR_END,
      dimensions: [{ id: "country", label: "Country", values: ["UK", "DE", "FR"] }],
      facetBy: "country",
      composition: "sum",
      normalisationMax: 110,
    },
    capacities: [],
    reducers: [],
    consumers: [
      { id: "always-on-uk", label: "UK always-on", kind: "recurring", amount: 8, weekdays: ["mon","tue","wed","thu","fri","sat","sun"], tags: { country: "UK" } },
      { id: "always-on-de", label: "DE always-on", kind: "recurring", amount: 6, weekdays: ["mon","tue","wed","thu","fri","sat","sun"], tags: { country: "DE" } },
      { id: "always-on-fr", label: "FR always-on", kind: "recurring", amount: 6, weekdays: ["mon","tue","wed","thu","fri","sat","sun"], tags: { country: "FR" } },
      campaign("uk-veganuary", "UK — Veganuary", "UK", "2026-01-02", "2026-02-05"),
      campaign("uk-summer", "UK — Summer of Sport", "UK", "2026-06-01", "2026-07-06"),
      campaign("uk-xmas", "UK — Festive", "UK", "2026-11-15", "2026-12-20"),
      campaign("de-spring", "DE — Frühlingsaktion", "DE", "2026-03-10", "2026-04-13"),
      campaign("de-oktober", "DE — Oktoberfest", "DE", "2026-09-20", "2026-10-25"),
      campaign("fr-rentree", "FR — Rentrée", "FR", "2026-08-25", "2026-09-28"),
      campaign("fr-noel", "FR — Noël", "FR", "2026-11-20", "2026-12-25"),
    ],
  };
}

/**
 * AU / NSW QSR busyness — subtractive: the covers Consumers bring vs a flat service
 * Capacity. Reducers cut Capacity around Christmas (about the only time a QSR really
 * closes); busyness otherwise rides entirely on Consumers — an assumed weekly build to
 * a Fri/Sat peak, plus ABS-anchored December/January seasonality and NSW school-holiday
 * spikes. Dates use the NSW (Eastern division) 2026 calendar. Day-of-week weighting is
 * an estimate; see docs/research/au-nsw-qsr-busyness-2026.md for sources and caveats.
 */
export function nswQsrBusyness(): Scenario {
  const NSW = { market: "NSW" };
  const schoolBreak = (id: string, label: string, start: string, end: string) => ({
    id,
    label,
    kind: "spanning" as const,
    amount: 700,
    start,
    end,
    tags: NSW,
    shape: { type: "flat" as const },
  });

  return {
    config: {
      name: "AU / NSW — QSR busyness",
      description:
        "The covers Consumers bring vs a flat NSW service Capacity. Reducers close Capacity around Christmas; busyness builds to a Fri/Sat peak and lifts for the ABS December/January season and NSW school holidays. Weekly shape is illustrative — see docs/research/au-nsw-qsr-busyness-2026.md.",
      mode: "subtractive",
      unit: "covers",
      start: YEAR_START,
      end: YEAR_END,
      dimensions: [{ id: "market", label: "Market", values: ["NSW"] }],
      composition: "sum",
    },
    capacities: [
      {
        id: "cap-nsw",
        label: "NSW QSR service capacity",
        amount: 5000,
        weekdays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        tags: NSW,
      },
    ],
    // Capacity cuts — the small, credible festive cluster (NSW public holidays 2026).
    reducers: [
      { id: "xmas-eve", label: "Christmas Eve — early close", multiplier: 0.8, start: "2026-12-24", end: "2026-12-24", tags: NSW },
      { id: "xmas-day", label: "Christmas Day — closed", multiplier: 0, start: "2026-12-25", end: "2026-12-25", tags: NSW },
      { id: "boxing-day", label: "Boxing Day — late open", multiplier: 0.7, start: "2026-12-26", end: "2026-12-26", tags: NSW },
      { id: "new-years-day", label: "New Year's Day — late open", multiplier: 0.8, start: "2026-01-01", end: "2026-01-01", tags: NSW },
    ],
    consumers: [
      // Weekly rhythm (assumed, non-primary): busyness builds across the week, Fri/Sat peak, Sun softer.
      { id: "base-trade", label: "Base trade", kind: "recurring", amount: 2000, weekdays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], tags: NSW },
      { id: "midweek-build", label: "Midweek build", kind: "recurring", amount: 400, weekdays: ["wed", "thu"], tags: NSW },
      { id: "weekend-peak", label: "Fri/Sat peak", kind: "recurring", amount: 1200, weekdays: ["fri", "sat"], tags: NSW },
      { id: "sunday-trade", label: "Sunday trade", kind: "recurring", amount: 400, weekdays: ["sun"], tags: NSW },
      // Seasonality (ABS-anchored): December festive peak, the New Year week, and an elevated January.
      {
        id: "december-festive",
        label: "December festive peak (summer break begins)",
        kind: "spanning",
        amount: 0,
        start: "2026-12-01",
        end: "2026-12-24",
        tags: NSW,
        shape: { type: "ramp", from: 800, to: 2600 },
      },
      {
        id: "new-year-week",
        label: "New Year week (Boxing Day → NYE)",
        kind: "spanning",
        amount: 2200,
        start: "2026-12-26",
        end: "2026-12-31",
        tags: NSW,
        shape: { type: "flat" },
      },
      {
        id: "january-summer",
        label: "January summer holidays + events",
        kind: "spanning",
        amount: 1000,
        start: "2026-01-01",
        end: "2026-01-31",
        tags: NSW,
        shape: { type: "flat" },
      },
      // NSW school-holiday spikes (Eastern division 2026 breaks): families out → more covers.
      schoolBreak("autumn-break", "Autumn school holidays", "2026-04-07", "2026-04-17"),
      schoolBreak("winter-break", "Winter school holidays", "2026-07-06", "2026-07-17"),
      schoolBreak("spring-break", "Spring school holidays", "2026-09-28", "2026-10-09"),
    ],
  };
}

/** Deploy pipeline — subtractive with coupled Tracks (min composition, ADR-0004). */
export function deployPipeline(): Scenario {
  return {
    config: {
      name: "Deploy pipeline — coupled capacity",
      description: "Engineer + CI pipeline are coupled (min). The pipeline is the constraint; adding engineers won't help.",
      mode: "subtractive",
      unit: "deploys/day",
      start: YEAR_START,
      end: YEAR_END,
      dimensions: [],
      composition: "min",
    },
    capacities: [
      { id: "engineer", label: "Engineer throughput", amount: 20, track: "engineer" },
      { id: "pipeline", label: "CI pipeline throughput", amount: 8, track: "pipeline" },
    ],
    reducers: [
      { id: "ci-maintenance", label: "CI maintenance window", multiplier: 0, start: "2026-03-16", end: "2026-03-17", track: "pipeline" },
    ],
    consumers: [
      { id: "bau-deploys", label: "BAU deploys", kind: "recurring", amount: 6 },
      {
        id: "release-crunch",
        label: "Q2 release crunch",
        kind: "spanning",
        amount: 0,
        start: "2026-05-04",
        end: "2026-06-12",
        shape: { type: "ramp", from: 6, to: 14 },
      },
    ],
  };
}

export interface ExampleEntry {
  id: string;
  scenario: Scenario;
}

export const EXAMPLES: ExampleEntry[] = [
  { id: "team-workload", scenario: teamWorkload() },
  { id: "qsr-calendar", scenario: qsrCalendar() },
  { id: "nsw-qsr-busyness", scenario: nswQsrBusyness() },
  { id: "deploy-pipeline", scenario: deployPipeline() },
];
