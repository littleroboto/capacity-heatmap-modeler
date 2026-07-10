# Course Build Notes

## Audience model (the big difference from `../teaching/`)
- `../teaching/` = **Doug** learning capacity modeling to build the tool. One learner.
- `course/` (here) = a **product** taught to the tool's **end users**, at 3 fixed levels.
- Do not assume prior knowledge here — a Cell / mode / Reducer may be brand new to the reader.

## The three depths (labels describe the CONTENT, never the reader)
Visible labels are **Overview / In practice / In depth**. The internal CSS classes and
`data-level` IDs stay `easy` / `intermediate` / `expert` — do not rename those.
- **Overview** (`lvl-easy`). No jargon on first use without a plain gloss. One idea, one picture.
  Analogies (a glass filling with water, a motorway getting busy). No formulas.
- **In practice** (`lvl-intermediate`). The tool's real vocabulary (Subject, Load Intensity,
  Subtractive, Reducer, Consumer). Simple arithmetic (consumed ÷ capacity). Short worked example.
- **In depth** (`lvl-expert`). Underlying theory + citations (Little's Law, Theory of Constraints,
  Kingman/queueing, utilisation bands). Edge cases and where the model is a simplification.

Never call the reader "grade-school", "beginner", etc. in visible prose.

## Authoring contract (all lessons MUST follow)
- Link the shared stylesheet: `../assets/course.css`.
- Include, in `<head>`: `../assets/levels.js` (depth switcher) and `../assets/quiz.js`.
- Wrap depth-specific prose in `<div class="lvl lvl-easy">…`, `lvl-intermediate`, `lvl-expert`.
  Content shared by all levels sits **outside** any `.lvl` block.
- Put `<div class="level-bar" data-level-bar></div>` right after `<body>` (levels.js fills it).
- Set `<body data-level="intermediate">` as the default depth.
- Quizzes are **applied scenarios** using the `.quiz` markup contract (see `assets/quiz.js`).
  Prefer 3–4 options; keep option text roughly equal length (no formatting tells).
- Every lesson ends with: a **primary-source** block, an **ask-your-teacher** block, and a **nav** row.
- Cite non-obvious claims with `<sup class="cite"><a href="…">n</a></sup>` → `RESOURCES.md`.

## Style
- Tufte-inspired, quiet palette, serif body — already encoded in `course.css`. Don't restyle.
- Terse. Recommendation/answer first, rationale second.
- Anchor every concept to the tool's vocabulary and a concrete heatmap example.

## Provenance
- Stylesheet + quiz widget adapted from `../teaching/assets/`.
- Lesson 07 (composition: sum vs min) adapts `../teaching/lessons/0001-sum-vs-bottleneck.html`.
