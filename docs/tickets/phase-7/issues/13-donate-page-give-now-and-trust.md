# 13: Donate: the page, give now and the trust block

Labels: design, content
Status: open
Blocked by: none

**What to build:** `/donate` renders from Sanity with its slim header (the one gold "Give now" and the
outline "Partner or sponsor"; spec Q14), the Give now section at `#give` (the heading, the seeded blurb,
the four facts with the Zeffy ones owed, no button) and the trust block (spec Q17): tax status, the EIN,
deductible from the tax line, the receipt from the give-now fact, then the box to Impact. `#give` still
opens the Give Dialog on load.

- [ ] `@oy/content`: `donatePage.giveNow.facts[]` and `taxLine` seeded; the give-now fact's registry row;
      `donatePageQuery`; TypeGen
- [ ] `packages/web`: the builder and the route with `cachePage`; tested
- [ ] Playwright: one "Give now", the dialog from the header and on `/donate#give`, no fee, receipt or
      monthly claim while owed, no EIN the settings do not hold

## Comments
