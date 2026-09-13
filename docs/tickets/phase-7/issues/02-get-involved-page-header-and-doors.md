# 02: Get Involved: the page, its header and the doors

Labels: design, content
Status: open
Blocked by: 01

**What to build:** `/get-involved` renders from Sanity with its slim header and the four door cards
(spec Q1, Q2): member, volunteer, vendor and partner, each with its photograph or a placeholder, its chip
above the title, its blurb and bullets or their chips, and its action; `doors` draws them as cards or in
the row form (photograph left); the first door gold only while the header holds no action; each card
anchored by its key (`#member`, `#volunteer`, `#vendor`, `#partner`), which the footer's links reach.

- [ ] `@oy/content`: `vendor` among the door keys; the seed's vendor door ("Sell at Odunde", "Apply for a
      booth" opening `vendor`, the Odunde 2026 suya vendor photograph); revisions for the page's door list
      and its header action; `getInvolvedPageQuery`; TypeGen
- [ ] `@oy/ui`: `DoorCard` gains the row form, the chip label and an anchor id; `PathRow` the vendor chip;
      stories and tests
- [ ] `packages/web`: the builder (layout, header, doors with their edit attributes, the gold rule) and
      the route with `cachePage`; tested
- [ ] `Pages/GetInvolved/Doors` (cards, rows); Playwright in both data modes: one h1, the doors in order
      or their Pending line, each trigger's round trip, one gold per view, no dues, roles, fees, dates or
      mock names while owed

## Comments
