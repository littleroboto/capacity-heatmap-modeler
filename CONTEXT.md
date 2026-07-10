# Capacity Heatmap Modeler

A config-driven, browser-based tool for modeling time-series capacity as a
GitHub-contribution-style heatmap. It renders one-page scenario visuals for a
person, a team, or a business, using a single blue→red temperature ramp.

## Language

### Core model

**Subject**:
The entity a single heatmap models — determined by the current **faceting
level**, not a fixed type. Facet by `person` and each Subject is a person; don't
facet and the Subject is the whole aggregate. "Team" and "business" are just
aggregates: Capacities and Consumers **sum** across any Dimension not being
faceted by (rollup = summation). There is no separate hierarchy system.
_Avoid_: entity, actor, resource

**Cell**:
The atomic unit of a heatmap: one Subject on one **day**. Its colour encodes
Load Intensity. Days are the fixed atomic grain; coarser views are Roll-up Views.
_Avoid_: box, square

**Roll-up View**:
A weekly or monthly aggregate rendered on top of the daily Cells (Load Intensity
aggregated over the bucket). The underlying grain is always daily.
_Avoid_: zoom, summary

**Load Intensity**:
The single normalised value in `[0, 1+]` that every Cell is painted with, on one
blue→red temperature ramp. `0` = empty/uncolored (coolest), `1.0` = the full-red
Reference point, `>1.0` = beyond the reference (deepest red).
_Avoid_: heat, utilisation (utilisation is one *interpretation* of intensity)

**Reference**:
The quantity that maps to Load Intensity `1.0` (full red) for a Cell. What sets
it is the only thing that differs between the two Modes.
_Avoid_: max, ceiling, threshold (each is a specific kind of Reference)

### Modes

**Subtractive mode**:
The Subject has a declared Capacity. A Cell starts blue (nothing consumed) and
moves toward red as Consumers use it up. Reference = the Cell's Effective
Capacity, so Load Intensity = consumed ÷ effective capacity, and `>1.0` is real,
meaningful overload.
_Avoid_: capacity mode, top-down

**Additive mode**:
The Subject has no declared Capacity. A Cell starts empty and heats up as
Consumers layer in. Reference = a Normalisation Max (relative), so Load Intensity
is relative "hotness" with no true overload.
_Avoid_: bottom-up, layering mode

### Capacity, reducers, consumers

**Capacity**:
A declared block of available "room" for a Subject, expressed in one Declared
Unit. A single heatmap has exactly one Capacity in one unit; other capacity
types are shown as separate faceted heatmaps. Exists only in Subtractive mode.
_Avoid_: supply, budget

**Declared Unit**:
The single unit a heatmap's Capacity and Consumers are measured in (e.g.
minutes, covers, GBP, labs, story-points). Free-text per Scenario; the tool does
not convert between units.
_Avoid_: nominal scale, measure

**Base Capacity**:
The declared capacity amount per day before Reducers, in the Declared Unit. One
amount with an optional weekday pattern (e.g. weekdays 450, weekends 0). Default
flat.
_Avoid_: raw capacity, gross capacity

**Effective Capacity**:
`Base Capacity × product of all active Reducer multipliers` for a Cell. This is
the Reference in Subtractive mode.
_Avoid_: net capacity, available capacity

**Reducer**:
Something that lowers a Subject's Capacity over a time span, expressed as a
multiplier in `[0, 1]` (a holiday/blackout is `0`; reduced staffing is e.g.
`0.6`). Multiple Reducers stack multiplicatively. Exists only in Subtractive
mode.
_Avoid_: blocker, deduction

**Blackout**:
A day whose Effective Capacity is `0` (fully reduced, e.g. a holiday). Rendered
as neutral grey rather than red. Any Consumer load landing on a Blackout day is
kept grey but flagged with a warning marker.
_Avoid_: closed, off-day

**Consumer**:
Something that generates load on a Subject over time (e.g. a task, meeting,
campaign, programme). Consumers exist in both Modes; in Subtractive mode they
consume Capacity, in Additive mode they simply add heat. A day's total load is
the **sum** of all active Consumers' amounts on that day ("layering" = summation).
_Avoid_: demand, activity, task (these are kinds/sources of a Consumer)

**Recurring Consumer**:
A Consumer that applies a per-active-day amount on a recurrence (every weekday,
specific weekdays, a cadence), optionally bounded by a date window. For standing
duties and BAU.
_Avoid_: repeating task

**Spanning Consumer**:
A Consumer that applies over a single dated range with a Load Shape describing
how its amount varies across the range. For campaigns, programmes, projects.
_Avoid_: event, campaign (those are sources of a Spanning Consumer)

**Load Shape**:
How a Spanning Consumer's amount is distributed across its range — flat, a
ramp-up/down, or named Phases (e.g. prep vs live).
_Avoid_: curve, profile

**Phase**:
A named sub-span of a Spanning Consumer's range carrying its own amount (e.g.
`prep` at a low amount, then `live` at a high amount).
_Avoid_: stage, period

### Scenario & output

**Scenario**:
One saved, self-contained model — its Subject(s), Capacity, Reducers, Consumers,
and config — that renders to a one-page visual.
_Avoid_: plan, case, view

**Normalisation Max**:
In Additive mode, the load value that maps to full red. May be the hottest Cell
in the visual or a value set by the user.
_Avoid_: peak, cap

### Composition (multi-source capacity)

**Track**:
One capacity source contributing to a Subject when its capacity comes from more
than one place (e.g. a person, a CI pipeline, a department). Tagged like any
Capacity entry.
_Avoid_: stream, lane, channel

**Composition**:
The per-Subject rule for combining its Tracks into Effective Capacity: `sum`
(Tracks are fungible/parallel — interchangeable, so capacities add) or `min`
(Tracks are coupled/serial — all required, so the weakest caps the whole).
Default `sum`.
_Avoid_: aggregation, combine

**Constraint**:
Under `min` composition, the Track with the least capacity — the one that caps
output. Also called the bottleneck. Improving a non-Constraint Track does not
raise Effective Capacity.
_Avoid_: bottleneck (use as gloss only), limiter

### Config & faceting

**Dimension**:
A config-declared attribute, with a fixed set of allowed values, that every
Capacity and Consumer can be tagged with (e.g. `country`, `brand`, `channel`,
`category`). Choosing one Dimension to **facet by** splits a visual into small
multiples — one heatmap per value.
_Avoid_: field, axis, tag (each is a partial view of a Dimension)

**Small multiples**:
The set of heatmaps produced by faceting a visual along one Dimension's values.
_Avoid_: panels, grid
