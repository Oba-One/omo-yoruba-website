# 02: Get Involved: the page, its header and the doors

Labels: design, content
Status: resolved
Blocked by: 01

**What to build:** `/get-involved` renders from Sanity with its slim header and the four door cards
(spec Q1, Q2): member, volunteer, vendor and partner, each with its photograph or a placeholder, its chip
above the title, its blurb and bullets or their chips, and its action; `doors` draws them as cards or in
the row form (photograph left); the first door gold only while the header holds no action; each card
anchored by its key (`#member`, `#volunteer`, `#vendor`, `#partner`), which the footer's links reach.

- [x] `@oy/content`: `vendor` among the door keys; the seed's vendor door ("Sell at Odunde", "Apply for a
      booth" opening `vendor`, the Odunde 2026 suya vendor photograph); revisions for the page's door list
      and its header action; `getInvolvedPageQuery`; TypeGen
- [x] `@oy/ui`: `DoorCard` gains the row form, the chip label and an anchor id; `PathRow` the vendor chip;
      stories and tests
- [x] `packages/web`: the builder (layout, header, doors with their edit attributes, the gold rule) and
      the route with `cachePage`; tested
- [x] `Pages/GetInvolved/Doors` (cards, rows); Playwright in both data modes: one h1, the doors in order
      or their Pending line, each trigger's round trip, one gold per view, no dues, roles, fees, dates or
      mock names while owed

## Comments

13 September 2026. `@oy/content`: a plain `doors` module (`DOOR_KEYS` with `vendor`, `DOOR_CHIPS`,
`DOOR_ACCENTS`, `isDoorKey`) that the schema, `PathRow` and `DoorCard` share; the seed's vendor door ("Sell
at Odunde", "Apply for a booth", the suya vendor at Ọjà Balógun framed at 50% 40%), Get Involved's doors in
the new order and no header action, with the two revisions; `getInvolvedPageQuery` in
`queries/trust-pages.ts` (the settings sub-read names its type, so TypeGen types it alone); header rows for
the four trust pages; the Phase 7 option names in the stega filter. `bun seed` on `development`: 1 created
(the vendor door), 1 updated, 2 earlier seed values revised. `@oy/ui`: `DoorCard` gains `layout="row"` (the
photograph fills the row at 260px, stacking under 820px), `label` (the door's chip) and `id`; `Card` a
`fill` media height and `id`; `CardGrid` one column; `Handoff` a chip for a missing line; stories and
tests. `packages/web`: `buildGetInvolvedPage` (tested) and the route. `Pages/GetInvolved/Doors` (cards,
rows). Playwright: seeded 16 passed; placeholder project 12 passed and 4 skipped (the doors, the footer
anchor and the give box need the Studio's doors).
