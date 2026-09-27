# 66: The Gallery option stories leave out the section's Open the photo gallery line

Labels: design, later
Status: open
Blocked by: none

**Finding** (R66 in `docs/plans/review-alignment-and-quality.md`; Storybook Pages/Homepage/Gallery; polish; drift): ROUTES section 5 asks for one page-section story per option so the owner can compare options without touching content; these stories show the mosaic without the section's closing action, so they understate each option's height. The page itself is correct.

**Evidence:** packages/ui/src/pages/homepage/sections.ts:116-142 builds the section from SectionHead and PhotoMosaic only; packages/web/src/pages/index.astro:120-123 and the prototype (docs/design/design/02 Homepage.dc.html:297) close it with the button and 'Odunde, the Gala, and the language lessons, year by year.' The Five and Three story captures are 72px shorter than the prototype's section (807 against 879, 525 against 597): test-results/review/home-events/pairs/home-1440-gallery-five.png and home-1440-gallery-three.png.

**What to build:** Add the line-shape Handoff to the gallery section builder so each count's story shows the section as the page draws it. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
