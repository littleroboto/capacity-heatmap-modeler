# Subject is a faceting level, not a hierarchy

A Scenario is a flat list of Capacity and Consumer entries tagged with Dimension
values. A **Subject is whatever level you facet by**, and team/business rollups
are just **summation across the Dimensions you are not faceting by** — there is
no explicit person→team→business hierarchy or dedicated rollup engine. We chose
this because summation is the only rollup rule these quantities need, and it
keeps the data model flat and the same math serves every level.

## Consequences

- Capacities and Consumers must be additive quantities for rollup to be valid.
- Anything that does not sum cleanly (e.g. a ratio-based capacity) does not fit
  and would force a rethink of this decision.
- "Team" and "business" are not first-class types; they are views.
