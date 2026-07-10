# Mission: Capacity Modeling for the Heatmap Modeler

## Why
You're building the Capacity Heatmap Modeler and need a correct mental model of
capacity so the tool models it faithfully across scales — an individual, a
person plus a coupled resource (human or infra), several related human/infra
tracks, or whole departments. Getting the modeling right is what makes the
heatmaps trustworthy rather than pretty-but-wrong.

## Success looks like
- Decide, for any scenario, whether multiple capacity sources should be **summed**
  or gated by a **bottleneck**.
- Express individual, composite, multi-track, and departmental capacity in the
  tool's Subtractive/Additive model.
- Spot when a "rollup = summation" view is lying and reach for the constraint.
- Set sustainable utilisation **target bands** rather than treating 100% as the goal.

## Constraints
- Learning serves shipping the tool; lessons tie back to its domain model
  (`../CONTEXT.md`, `../docs/adr/`).
- Prefers active decisions / being grilled, recommendations-first, one thing at
  a time, terse.
- Short lessons.

## Out of scope (for now)
- Queueing-theory math depth (Kingman's formula) — may come later.
- Statistical demand forecasting.
- Financial / cost capacity modeling.
