# 13: Donate: the page, give now and the trust block

Labels: design, content
Status: resolved
Blocked by: none

**What to build:** `/donate` renders from Sanity with its slim header (the one gold "Give now" and the
outline "Partner or sponsor"; spec Q14), the Give now section at `#give` (the heading, the seeded blurb,
the four facts with the Zeffy ones owed, no button) and the trust block (spec Q17): tax status, the EIN,
deductible from the tax line, the receipt from the give-now fact, then the box to Impact. `#give` still
opens the Give Dialog on load.

- [x] `@oy/content`: `donatePage.giveNow.facts[]` and `taxLine` seeded; the give-now fact's registry row;
      `donatePageQuery`; TypeGen
- [x] `packages/web`: the builder and the route with `cachePage`; tested
- [x] Playwright: one "Give now", the dialog from the header and on `/donate#give`, no fee, receipt or
      monthly claim while owed, no EIN the settings do not hold

## Comments

13 September 2026. The section is `#give-now`, not `#give`: the Give Dialog keeps `#give`, and a section
with the same id would leave the page with two elements answering the fragment (Playwright counts one).
The seed fills the four give-now labels with only "If the form fails" valued ("The dialog offers contact
and a mailing address instead.", which the Give Dialog already does), so Fees, Receipt and Monthly show the
one chip "how your Zeffy form handles this", read from a condition row. The trust block builds Tax status
(501(c)(3), since 1997), the EIN or its chip, Deductible from the seeded tax line ("To the extent allowed by
law") and Receipt only while a give-now fact carries that label. Both data modes pass `e2e/donate.spec.ts`.
