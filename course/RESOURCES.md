# Capacity Modeling Resources

## Knowledge

- [Little's Law (L = λW) — MIT, *Urban Operations Research* §4.4](https://web.mit.edu/urban_or_book/www/book/chapter4/4.4.html)
  Larson & Odoni's derivation: average WIP = arrival rate × time-in-system, holding
  for any stable system regardless of arrival/service distribution or queue discipline.
  Use for: the identity linking WIP, throughput, and cycle time behind any capacity model.
- [Kingman's formula / VUT equation — Wikipedia](https://en.wikipedia.org/wiki/Kingman%27s_formula)
  Mean wait ≈ (utilisation) × (variability) × (time); the ρ/(1−ρ) term blows up as
  utilisation → 100%. From Kingman's 1961 heavy-traffic paper. Use for: why waiting
  time is a "hockey stick," not linear, near full utilisation.
- [The Principles of Product Development Flow — Celeritas (Reinertsen)](http://celeritaspublishing.com/books/)
  Reinertsen applies queue theory to knowledge work: invisible queues are the root
  cause of poor flow, and high utilisation is economically destructive. Use for: why
  100% "busy" is a false economy in project/creative capacity.
- [Theory of Constraints — TOC Institute](https://www.tocinstitute.org/theory-of-constraints.html)
  Goldratt's core idea: every system's output is limited by one constraint ("no
  chain is stronger than its weakest link"). Use for: when coupled resources
  should be modeled as a bottleneck (min), not a sum.
- [Theory of Constraints — Scholarpedia](http://www.scholarpedia.org/article/Theory_of_Constraints)
  More rigorous treatment; resource vs policy vs market constraints; drum-buffer-rope.
  Use for: classifying *what kind* of constraint is binding.
- [Theory of Constraints — Lean Production](https://www.leanproduction.com/theory-of-constraints/)
  The Five Focusing Steps, clearly laid out. Use for: what to do once you've
  found the constraint (exploit → subordinate → elevate → repeat).
- [The Goal — North River Press (Goldratt, primary)](https://northriverpress.com/30th-anniversary-edition-of-the-goal-published/)
  The 1984 business novel that introduced TOC; the anniversary edition adds the Five
  Focusing Steps. Use for: citing the origin of bottleneck thinking in ops.
- [Workforce Capacity Planning: Formula, KPIs, 4B Framework — Teamwork](https://www.teamwork.com/blog/workforce-capacity-planning/)
  Capacity gap = available − demand; demand must be broken down by skill/phase/
  confidence, never a single number. Use for: KPI definitions, utilisation targets.
- [Full Guide to Capacity Planning — Toggl](https://toggl.com/blog/capacity-planning-guide)
  Distinguishes capacity *planning* (strategic) vs *management* (real-time) vs
  *resource* planning (who does what). Subtract 5–8% non-project time; ~80% target.
- [Workforce Capacity Planning — AIHR](https://www.aihr.com/blog/workforce-capacity-planning/)
  Utilisation = (baseline hours − adjustments) ÷ demand; 75–85% sustainable band.
  Use for: turning raw capacity into *effective* capacity, and defending target bands.
- [Myth: Velocity is Productivity — Scrum.org](https://www.scrum.org/resources/blog/myth-velocity-productivity)
  Velocity is a team-specific *planning* estimate of relative capacity, not a
  comparable or normalisable productivity metric. Use for: story points as a capacity
  unit and its caveats (don't compare teams, don't set as a target).
- [OEE (Overall Equipment Effectiveness) — Lean Production](https://www.leanproduction.com/oee/)
  Effective capacity = Availability × Performance × Quality; nominal time is discounted
  by downtime, speed loss, and defects. Use for: the manufacturing analogue of
  Base → Effective Capacity via multiplicative Reducers.
- [Small Multiples — Tufte, *Envisioning Information* (Wikipedia)](https://en.wikipedia.org/wiki/Small_multiple)
  Repeated same-scale, same-axes thumbnails that "enforce comparisons" — answering
  "compared to what?" at a glance. Use for: the rationale behind faceted heatmaps
  (one panel per Dimension value, constant encoding).

## Wisdom (Communities)

- [r/operations](https://www.reddit.com/r/operations/) and [r/projectmanagement](https://www.reddit.com/r/projectmanagement/)
  Practitioners doing real capacity/resource planning. Use for: sanity-checking
  whether a model matches how ops people actually think.
- [r/dataisbeautiful](https://www.reddit.com/r/dataisbeautiful/)
  Use for: feedback on the heatmap visual encoding once there's something to show.
- [r/lean](https://www.reddit.com/r/lean/) and [Project Production Institute](https://projectproduction.org/)
  Lean/TOC and queueing-in-practice communities. Use for: pressure-testing utilisation
  and flow claims against ops/production-science practitioners.

## Gaps

- No single authoritative source yet on *visual* encoding of capacity heatmaps
  (colour ramps, calendar layouts). Prior art (`../../Capacity Visualisations/`)
  is the working reference until one is found.
- Tufte's small-multiples argument is cited via Wikipedia (quoting *Envisioning
  Information*); there is no free primary Tufte web page for it — the book is the primary.
