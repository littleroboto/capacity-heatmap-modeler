# Mission: The Capacity Modeling Course

## Who this is for

This is **not** a personal learning workspace — it is a **training product** shipped
to the *users* of the Capacity Heatmap Modeler. Those users arrive with very different
needs, so every lesson teaches the same idea at **three depths**, chosen by the reader.

Labels describe the **depth of the material, never the reader** (a senior exec skimming
the "Overview" is choosing a fast read, not being talked down to):

| Depth (shown to reader) | What it delivers | Internal writing target |
|-------------------------|------------------|-------------------------|
| **Overview** | Plain words, one picture, no maths. "What is this and why care?" | Assume no jargon; a two-minute read. |
| **In practice** | Working definitions, the tool's real vocabulary, simple formulas, worked examples. | Assume a motivated practitioner. |
| **In depth** | The underlying theory, edge cases, citations, where the model breaks. | Assume a technical/analyst reader. |

A single sticky switcher at the top of every page sets the depth for the whole course
and remembers it across lessons. (Internal CSS/ID names remain `easy` / `intermediate` /
`expert`; only the visible labels changed.)

## Why the course exists

The Modeler is a **general modeling workbench**. The same heatmap can model the workload
of one person, a team, a whole company — or anything with capacity and demand over time
(a kitchen, a CI pipeline, a budget, a lab). That generality is powerful but easy to get
wrong. Users who don't understand *capacity thinking* will build heatmaps that are
"pretty but wrong": summing things that shouldn't sum, treating 100% utilisation as the
goal, missing the real bottleneck.

The course exists to give every user — whatever their level — a **correct mental model**
so their heatmaps are trustworthy.

## Success looks like

A user finishing the course can:

- Read any heatmap: what a **Cell**, **Load Intensity**, and the blue→red ramp mean.
- Choose **Subtractive vs Additive** mode for a given situation.
- Turn raw capacity into **Effective Capacity** (Reducers, Blackouts, shrinkage).
- Model demand with **Recurring** and **Spanning Consumers** and shaped load.
- Decide whether multiple sources **sum** or are gated by a **bottleneck** (min).
- Set sustainable **utilisation target bands** instead of chasing 100%.
- Scale a model from a **person → team → company** with Dimensions & faceting.

## Design constraints

- **Anchored, not abstract.** Teach general capacity theory, but always land it on the
  tool's own vocabulary (`../../CONTEXT.md`) and heatmap examples.
- **Applied quizzes.** Assessment is scenario-based: *given a situation, model it*
  (pick the mode, set the Reference, name the Constraint) — not definition recall.
- **Cited.** Every non-obvious claim links to a high-trust primary source (`RESOURCES.md`).
- **Beautiful & printable.** Lessons double as reference; Tufte-style, one shared stylesheet.
- **Reusable as product content.** The quiz + lesson HTML is meant to be embedded in-product.

## Out of scope (for now)

- Statistical demand forecasting.
- Financial/cost optimisation (money is just another Declared Unit here).
- Deep queueing-theory derivations — Expert level *links* to them, doesn't reproduce them.
