# 14: Kicker-less heads (Odunde partners, Gala honorees) leave 30px under the lead where the prototypes set 22px

Labels: design, later
Status: open
Blocked by: none

**Finding** (R14 in `docs/plans/review-alignment-and-quality.md`; /odunde, /gala (SectionHead); polish; drift): The prototypes draw these two heads as a bare h2 and lead with margin-bottom 22px, not as .oy-sec-head, so the shared head's 30px sets the partner row and the honorees grid 8px lower than drawn. In the same partners block the box then sits 4px tighter than drawn (Handoff.astro:82 margin-top 20px against 08 Odunde Festival.dc.html:265 margin-top:24px).

**Evidence:** Measured at 1440: /odunde partners lead bottom 5082, partner block top 5112 (30px); prototype docs/design/design/08 Odunde Festival.dc.html:257 lead margin-bottom:22px, row 22px under it (5927 to 5949). /gala honorees lead bottom 2351, next block 30px under it; prototype 09 End-of-Year Gala.dc.html:168 margin-bottom:22px. packages/tokens/src/base.css:102-108 (.oy-sec-head margin-bottom 30px). Captures test-results/review/home-events/pairs/odunde-1440-partners.png and gala-1440-honorees.png.

**What to build:** Let SectionHead close at 22px when it has no kicker and ends on a lead (or take a spacing prop from these two pages), matching the prototypes' bare h2 and lead. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
