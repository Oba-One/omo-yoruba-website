# 05: Impact: the page, its header and the headline numbers

Labels: design, content
Status: resolved
Blocked by: none

**What to build:** `/impact` renders from Sanity with its slim header (gold "Sponsor or partner", outline
"Talk to us") and the headline numbers (spec Q5): the page's stats in the prototype's framed grid, four
or six by `stats`, each with its source line or the chip "a source line under the figure"; under `six`
the empty cells each carry the registry's chip for attendance and learners served; `sources: hidden`
hides every source line, their chips and the lead that promises them.

- [x] `@oy/content`: registry rows for the page's stats and the `six` condition (named constant);
      `impactPageQuery`; the stega filter's Phase 7 option names; TypeGen
- [x] `@oy/ui`: `StatStrip` gains the framed grid (four, six, collapsing as drawn); stories and tests
- [x] `packages/web`: the builder and the route with `cachePage`; tested
- [x] `Pages/Impact/Stats` (four, six) and `Pages/Impact/Sources` (shown, hidden); Playwright: the
      figures, no invented source, attendance or learners while owed, the header's round trips

## Comments

13 September 2026. `@oy/content`: `impactPageQuery` (one read: the singleton, its stats, outcomes with
their subjects, every program, the festival editions, the voices, the photographs, the newest governance
document of each kind, the board count, every partner and the settings); registry rows for the page's
stats and `IMPACT_SIX_PENDING` (listed only under `six`); the stega filter's Phase 7 option names.
`@oy/ui`: `StatStrip` `variant="framed"` (the white bordered grid inside the section, four across or six in
two rows of three, two across under 1000px) with `padPending` for the empty cells beside real figures (none
at all still shows the Pending line). `packages/web`: `buildImpactPage` (tested, 11 cases) and the route.
`Pages/Impact/Stats` (four, six) and `Pages/Impact/Sources` (shown, hidden: the lines, their chips and the
lead go together). Playwright for the whole page: seeded 20 passed, placeholder project 20 passed.
