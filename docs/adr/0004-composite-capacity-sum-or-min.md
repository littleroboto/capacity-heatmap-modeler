# Composite capacity: sum for fungible, min for coupled

A Subject may draw capacity from more than one **Track** (e.g. a person + a CI
pipeline, or several departments). How Tracks combine into the Subject's
Effective Capacity depends on their relationship: **fungible** (parallel,
interchangeable) Tracks **sum**, while **coupled** (serial, all-required) Tracks
take the **min** — the binding **Constraint** (Goldratt's Theory of Constraints,
"no chain is stronger than its weakest link"). Each Subject declares a
**composition** of `sum` or `min`.

## Relationship to ADR-0002

This refines ADR-0002. Rollup across a faceting Dimension is still summation, but
that is now understood as the `sum` (fungible) case. Coupled Subjects use `min`,
so "rollup = summation" is the default, not the universal rule.

## Consequences

- A Track is a capacity source tagged like any Capacity entry; `composition`
  is a per-Subject setting (default `sum`).
- Under `min`, the engine also reports *which* Track is the Constraint, so the
  UI can surface the bottleneck.
- `min` only makes sense when Tracks share a comparable unit or are normalised;
  mixing raw incompatible units under `min` is a modelling error to guard against.
