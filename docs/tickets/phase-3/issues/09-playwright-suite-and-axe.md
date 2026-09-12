# 09: Playwright proves the five states, the focus rules and axe with each dialog open

Labels: infra
Status: open
Blocked by: 01, 08

**What to build:** the e2e suite in `packages/web/e2e`: for each of the eight kinds, open from a
trigger, submit empty (the summary and the field sentences appear, a typed value survives),
fill and submit (the busy label, then the success block with the close button focused), Escape
closes and focus returns to the trigger; the newsletter's four states; the mobile menu's trap,
Escape and focus return; the Events dropdown on hover, focus and Escape; no dialog open on load
on every route; `#give` opens the Give Dialog and the fallback appears when the embed request is
blocked; the reduced-motion cross-fade; axe at 375 and 1440 on the layout with each dialog
open, zero violations; every `a`, `button`, `input`, `select` and `textarea` at 375 has a 44px
box. The action requests are intercepted so CI writes nothing.

- [ ] Every spec passes locally against `astro dev` and in the CI job with the placeholder variables
- [ ] Axe reports zero violations in every checked state
- [ ] The intercepted success answer uses the action's own encoding, so the modal renders it as it would a real one
