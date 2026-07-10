# Single capacity unit per heatmap; capacity-type is a facet

A single heatmap has exactly **one Capacity in one Declared Unit**. When a
Subject needs several kinds of capacity (e.g. budget, throughput, staff hours),
each is a **separate faceted heatmap** rather than multiple typed pools inside
one heatmap. We chose this over multi-type capacity pools because it keeps
Load Intensity unambiguous (one numerator, one denominator, one unit) and avoids
consumers that must target and split across incompatible units.

## Consequences

- The tool never converts between units.
- Comparing capacity types is a small-multiples layout concern, not a
  compute-model concern.
- If a single Scenario ever needs two incompatible units with real overload
  semantics compared side by side on shared axes, this decision must be revisited.
