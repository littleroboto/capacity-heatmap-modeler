# Capacity Heatmap Modeler

A config-driven, browser-based tool for modeling time-series capacity as a
GitHub-contribution-style heatmap. See `CONTEXT.md` for the domain glossary and
`docs/adr/` for architectural decisions.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via the `gh` CLI). External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the project root. See `docs/agents/domain.md`.
