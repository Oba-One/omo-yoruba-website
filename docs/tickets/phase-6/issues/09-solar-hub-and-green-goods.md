# 09: Solar Hub and Green Goods

Labels: design, content
Status: open
Blocked by: 08

**What to build:** `/programs/cultural-collective` shows each initiative in its own section (spec Q10):
the status pill from its status line or the chip (hidden by `status`), the member-led pill, the heading,
the blurb or its chip, the four facts (status, serves, since, next) each value or its own chip, and the
initiative's photograph or a placeholder naming it; the copy beside the photograph or above it by
`initiatives`.

- [ ] `@oy/content`: the initiative's registry rows per field; the query reads the initiatives in order;
      TypeGen
- [ ] `@oy/ui`: the initiative section (pills, facts through `GlanceStrip` inside a column, photograph or
      placeholder, side and stacked) with its Pending states and exemptions; stories and tests
- [ ] `packages/web`: the builder carries the initiatives and both options; tested
- [ ] `Pages/Collective/Initiatives` (side, stacked) and `Pages/Collective/Status` (shown, hidden)
      stories; Playwright: no invented status, date, reach or product on the page while owed

## Comments
