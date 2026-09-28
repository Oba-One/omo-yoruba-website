# 10: The hero's Get involved goes to /get-involved; the prototype jumps to the page's own Raise your hand

Labels: design, later
Status: open
Blocked by: none

**Finding** (R10 in `docs/plans/review-alignment-and-quality.md`; / (Hero); polish; drift): ADR 0023 does not record it. The Get Involved page offers more ways in, so either destination is defensible, but the difference changes where the hero's second button takes a first-time visitor and nothing says it was chosen.

**Evidence:** Live /: 'Get involved' href /get-involved, seeded at packages/content/scripts/seed-data.ts:480; docs/design/design/02 Homepage.dc.html:72 href='#get-involved', the homepage section id the site also keeps (packages/web/src/pages/index.astro:126).

**What to build:** Seed the secondary action as #get-involved if the owner wants the prototype's in-page jump, or keep the Get Involved page and record the choice in ADR 0023. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
