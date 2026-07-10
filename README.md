# Capacity Heatmap Modeler

A config-driven **heatmap modeler for time-series capacity** — for an individual, a team, or an
entire business. Describe capacity and the things that consume or reduce it, and get a
GitHub-contribution-style thermal heatmap plus a one-page visual you can export.

It runs entirely in the browser: no backend, no accounts. A Scenario is a single YAML file you can
edit in the app, import, and export.

## What it does

- **Two modes on one intensity model**
  - *Subtractive* — start from a block of declared capacity; as consumers take it, cells warm from
    blue → green → yellow → orange → red (over 100%).
  - *Additive* — start blank; as activity layers in, cells warm relative to a normalisation max.
- **Consumers** add load: *recurring* (weekday patterns) or *spanning* (dated blocks with a flat,
  ramp, or multi-phase load shape).
- **Reducers** lower capacity multiplicatively over a span (focus factor, part-time, shutdowns). A
  reducer of `0` is a **blackout**.
- **Composite capacity** (per Subject) combines *Tracks*:
  - `sum` for fungible / parallel tracks, and
  - `min` for **coupled** tracks — the bottleneck wins, and the constraining track is reported.
- **Faceting** by any declared Dimension produces **small multiples** (one heatmap per person /
  country / team); the aggregate rolls up by summation.
- **One-page visual**: title, always-on **KPI strip** (utilisation, peak, overloaded days,
  blackouts, headroom), the heatmap(s), a scheduled-activity list, and a legend.
- **Export**: one-click **PNG** and **Print → PDF**.
- **Learn**: an in-app section with interactive lessons on the modeling ideas (utilisation bands,
  coupled vs fungible capacity, additive vs subtractive, and roll-up traps).

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # domain engine unit tests (Vitest)
pnpm build      # type-check + production build into dist/
```

The three seeded examples show the range:

| Example | Mode | Shows |
| --- | --- | --- |
| **Team workload — Platform squad** | subtractive | faceting by person, reducers (focus factor, part-time, shutdown), recurring + phased/ramped work |
| **QSR marketing calendar — EMEA** | additive | promo intensity across countries, fixed normalisation max |
| **Deploy pipeline — coupled capacity** | subtractive | `min` composition — the CI pipeline is the constraint |

## How a Scenario is structured

```yaml
config:
  name: Team workload
  mode: subtractive        # or additive
  unit: minutes
  start: 2026-01-01
  end: 2026-12-31
  dimensions:
    - { id: person, label: Person, values: [Ada, Blake, Chen] }
  facetBy: person          # omit for a single aggregate view
  composition: sum         # or min (coupled bottleneck)
capacities:
  - { id: cap-ada, label: Ada — working day, amount: 450, tags: { person: Ada } }
reducers:
  - { id: focus, label: Focus factor, multiplier: 0.85, start: 2026-01-01, end: 2026-12-31 }
consumers:
  - { id: standup, label: Daily standup, kind: recurring, amount: 15 }
  - id: migration
    label: DB migration
    kind: spanning
    amount: 0
    start: 2026-02-02
    end: 2026-04-30
    tags: { person: Ada }
    shape:
      type: phases
      phases:
        - { name: design, days: 20, amount: 120 }
        - { name: build,  days: 40, amount: 300 }
        - { name: cutover, days: 28, amount: 200 }
```

## Architecture

- **`src/domain/`** — a pure, framework-free engine (dates, capacity + reducers, consumer load
  shapes, `sum`/`min` composition, faceting + roll-up, intensity, KPIs, YAML, colour ramp). Fully
  unit-tested with Vitest.
- **`src/ui/`** — React components: SVG `Heatmap`, `Legend`, `KpiStrip`, `Poster` (the export
  target), `ConfigPanel`, config-driven `EntryTable`, `YamlDrawer`, `Learn`, `Toolbar`.
- **`teaching/`** — the training materials; `scripts/sync-learn.mjs` copies them into `public/`
  at build time so they ship with the site (surfaced under the in-app **Learn** tab).
- **`docs/adr/`** — Architecture Decision Records for the key modeling choices.
- **`CONTEXT.md`** — the domain glossary (ubiquitous language).

## Design decisions

Recorded as ADRs in [`docs/adr/`](docs/adr/):

1. Unified intensity model (modes differ only in their Reference).
2. Subject is a faceting level; roll-up is summation.
3. A single capacity unit per heatmap (capacity *types* via faceting).
4. Composite capacity: `sum` for fungible, `min` for coupled tracks.

## Deployment

The site is published to **GitHub Pages** from the `gh-pages` branch (the built `dist/`). The Vite
`base` is set to the repo name in `vite.config.ts`, so it serves from
`https://<user>.github.io/capacity-heatmap-modeler/`.

To publish an update:

```bash
pnpm build
npm run deploy      # pushes dist/ to the gh-pages branch
```

A ready-to-use GitHub Actions workflow (build + test + deploy on push to `main`) is included at
`.github/workflows/deploy.yml`. To switch to CI-based deploys, grant the `workflow` scope
(`gh auth refresh -s workflow`), commit that file, and set the Pages source to **GitHub Actions**.

## License

MIT
