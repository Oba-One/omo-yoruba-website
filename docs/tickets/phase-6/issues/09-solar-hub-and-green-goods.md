# 09: Solar Hub and Green Goods

Labels: design, content
Status: resolved
Blocked by: 08

**What to build:** `/programs/cultural-collective` shows each initiative in its own section (spec Q10):
the status pill from its status line or the chip (hidden by `status`), the member-led pill, the heading,
the blurb or its chip, the four facts (status, serves, since, next) each value or its own chip, and the
initiative's photograph or a placeholder naming it; the copy beside the photograph or above it by
`initiatives`.

- [x] `@oy/content`: the initiative's registry rows per field; the query reads the initiatives in order;
      TypeGen
- [x] `@oy/ui`: the initiative section (pills, facts through `GlanceStrip` inside a column, photograph or
      placeholder, side and stacked) with its Pending states and exemptions; stories and tests
- [x] `packages/web`: the builder carries the initiatives and both options; tested
- [x] `Pages/Collective/Initiatives` (side, stacked) and `Pages/Collective/Status` (shown, hidden)
      stories; Playwright: no invented status, date, reach or product on the page while owed

## Comments

13 September 2026. `@oy/content`: the initiative's one registry row splits per field ("the status", "the
status line", "who it serves", "when it started", "what comes next", "a photograph of the project",
beside "what the initiative is"); `collectivePageQuery` reads `initiatives[]` in the page's order.
`@oy/ui`: `Initiative` (the status pill with its dot or the chip, neither under `status` hidden; the
member-led pill; the heading; the blurb or its chip; the four facts; the photograph at the prototype's
340px or the placeholder naming the project; `side` and `stacked`, both stacking under 900px), carrying
the collective scope itself so its greens hold in any story; `GlanceStrip` without its band for a column,
its cell drawn by `GlanceCell` for both forms. Stories `Page/Initiative` (pending, filled, stacked, status
hidden), `Pages/Collective/Initiatives` (side, stacked) and `Pages/Collective/Status` (shown, hidden).
`packages/web`: the builder carries each named initiative with its section id from the name, the grounds
alternating from white, the status value in words (cleaned of stega first) and both options; tested.
Playwright: 18 passed seeded and 18 with the placeholder project, none of the prototype's status lines,
reach, dates, next steps or products on the page while their chips show. Not drawn: `proceedsReturn`.
