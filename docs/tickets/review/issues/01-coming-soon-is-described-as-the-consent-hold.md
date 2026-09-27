# 01: Coming soon is described as the consent hold, but album pages, photo addresses and past years keep every photograph public

Labels: infra
Status: open
Blocked by: none

**Finding** (R01 in `docs/plans/review-alignment-and-quality.md`; galleryPage state switch (Studio description, open-work D5); blocker; docs): ADR 0039 made soon an editor's 'not ready yet' switch that swaps the mosaic for one sentence; the Studio simplification later described it to administrators as the holding pattern while photo consent is settled. An administrator who flips it to protect identifiable children would still publish every album page, every shareable photo address and the event pages' carousels, which is misleading for the one decision (D5) about children's faces. Verified by reading both routes' builders and the event page builders; the switch was compared through the Pages/Gallery/State stories.

**Evidence:** packages/content/src/layout-options.ts:201 ('Coming soon hides the albums behind one sentence pointing to the Odunde and Gala pages, while photo consent is settled.', added in ccce495). packages/web/src/lib/sanity/album-page.ts:50 reads only the captions option and packages/web/src/pages/gallery/[album].astro never reads state, so /gallery/<album> and every ?photo= address serve all 68 photographs under soon (spec Q14: 'Album pages render under either state'); festival-page.ts and gala-page.ts never read galleryPage, so past years keep the first eight photographs of each album, the pages the soon sentence sends readers to. docs/plans/open-work.md:25 (D5) and docs/plans/four-week-plan.md:43 and :121 lean on 'the gallery stays state: soon'. The development dataset holds state: built today (/gallery serves the mosaic, test-results/review/gallery/site-gallery-1440.png).

**What to build:** The owner decides what the consent hold is: either soon also withdraws the album pages and photo addresses (the soon sentence or a 404) and the past-years photographs, or layout-options.ts:201, D5 and the plan say soon hides only the gallery's index and the hold is unpublishing albums; then set the switch the plan asks for. Size M. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work D5; this ticket adds the review's evidence.

## Comments
