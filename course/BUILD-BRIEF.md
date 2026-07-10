# Build Brief — Capacity Modeling Course lessons

You are building lessons for a **training product** shipped to the users of the
*Capacity Heatmap Modeler*. Read these first, in order:

1. `MISSION.md` — who the course is for and the three-level model.
2. `NOTES.md` — the authoring contract (READ CAREFULLY, follow exactly).
3. `lessons/0001-what-is-capacity-modeling.html` — the **template**. Copy its structure.
4. `reference/glossary.html` and `../CONTEXT.md` — the exact vocabulary. Use these words precisely.

## Non-negotiable structure (every lesson)
- `<head>` links `../assets/course.css` and loads `../assets/levels.js` + `../assets/quiz.js`.
- `<body data-level="intermediate">`, then `<div class="level-bar" data-level-bar></div>`, then `<div class="wrap">`.
- A `.kicker` ("Capacity Modeling · Lesson N"), an `<h1>`, and a `.lede`.
- Three depth layers, each a sibling block: `<div class="lvl lvl-easy">`, `<div class="lvl lvl-intermediate">`, `<div class="lvl lvl-expert">`.
  - **Easy = grade-school**: plain words, an analogy, one picture/mini-heatmap, NO formulas. Gloss any tool term on first use.
  - **Intermediate = college**: the tool's real vocabulary, simple arithmetic, a short worked example, a `table.grid` where useful.
  - **Expert = researcher**: the underlying theory + citations, edge cases, and one honest "where this is a simplification" note.
- Shared prose (intro/why/quiz) sits OUTSIDE any `.lvl` block so all levels see it.
- An **applied quiz** (2–4 `.quiz` blocks): give a *situation*, learner picks how to model it. Use the `.quiz` markup contract from `assets/quiz.js` (data-choice / data-correct / data-explain-<choice>). Keep option labels roughly equal length — no formatting tells.
- Optionally a `.note.build` ("IN THE TOOL") tying the concept to a concrete modelling action.
- End with, in order: a `.primary-source` block, a `.ask` block ("I'm your teacher — ask me follow-ups…"), and a `.nav` row linking prev/next lesson, `../index.html`, and `../reference/glossary.html`.

## Reusable components already available (use, don't reinvent)
- **Mini-heatmap**: `<div class="heat" style="--cols:14" data-demo-heat></div>` + a small inline `<script>` to paint cells (copy the painter from the template lesson) OR hand-set `cell.style.background`. Add `<div class="heat-legend"><span>…</span><span class="heat-ramp"></span><span>…</span></div>`.
- **Tables**: `<table class="grid">` with `<th>` header row.
- **Callouts**: `.note`, `.note.key`, `.note.takeaway`, `.note.build`.
- **Steps**: `<ol class="steps">`.

## Citations — DO NOT invent URLs
- Primary citation hub is `../RESOURCES.md` (a research subagent is filling it). For inline `<sup class="cite">` marks, link to `../RESOURCES.md` (always valid) unless a URL is on the allow-list below.
- Glossary anchor: `../reference/glossary.html`.
- **Allow-list of external URLs you MAY use directly** (all verified stable):
  - Theory of Constraints: `https://www.tocinstitute.org/theory-of-constraints.html`, `https://www.leanproduction.com/theory-of-constraints/`
  - Little's Law: `https://en.wikipedia.org/wiki/Little%27s_law`
  - Queueing theory: `https://en.wikipedia.org/wiki/Queueing_theory`
  - Kingman's formula: `https://en.wikipedia.org/wiki/Kingman%27s_formula`
  - Tufte / small multiples: `https://www.edwardtufte.com/book/envisioning-information/`
- For the `.primary-source` "read this next" block, name a real, well-known source (book/paper/author) and link either to its allow-listed URL or to `../RESOURCES.md`. Never fabricate a link.

## Tone
Terse. Answer/recommendation first, rationale second. Anchor every idea to the tool's
vocabulary and a concrete heatmap example. Beautiful and printable — do not add new CSS;
the shared stylesheet covers everything. If you truly need a one-off style, put a small
`<style>` in that lesson's `<head>` scoped to a lesson-specific class.

## Quality bar
Each lesson must open in a browser with no console errors, the level bar must switch all
three depths, and every quiz must give correct/incorrect feedback. Keep each lesson short
enough to complete in a few minutes at any single level.
