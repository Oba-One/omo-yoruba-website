# 05: Impact: the page, its header and the headline numbers

Labels: design, content
Status: open
Blocked by: none

**What to build:** `/impact` renders from Sanity with its slim header (gold "Sponsor or partner", outline
"Talk to us") and the headline numbers (spec Q5): the page's stats in the prototype's framed grid, four
or six by `stats`, each with its source line or the chip "a source line under the figure"; under `six`
the empty cells each carry the registry's chip for attendance and learners served; `sources: hidden`
hides every source line, their chips and the lead that promises them.

- [ ] `@oy/content`: registry rows for the page's stats and the `six` condition (named constant);
      `impactPageQuery`; the stega filter's Phase 7 option names; TypeGen
- [ ] `@oy/ui`: `StatStrip` gains the framed grid (four, six, collapsing as drawn); stories and tests
- [ ] `packages/web`: the builder and the route with `cachePage`; tested
- [ ] `Pages/Impact/Stats` (four, six) and `Pages/Impact/Sources` (shown, hidden); Playwright: the
      figures, no invented source, attendance or learners while owed, the header's round trips

## Comments
