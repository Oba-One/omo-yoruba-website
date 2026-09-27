# 70: Previous and next stay at the 1080px column's edges, far from portrait and 4:3 photographs

Labels: design, later
Status: open
Blocked by: none

**Finding** (R70 in `docs/plans/review-alignment-and-quality.md`; Lightbox at 1440; polish; drift): ADR 0040 says the buttons now sit 18px beside the photograph as the prototype's centred row draws them; that holds for 3:2 photographs, since the prototype crops every photograph to 3:2 and the site shows it whole (Q11). With a portrait photograph the buttons float about 300px away, which reads as detached controls.

**Evidence:** packages/ui/src/media/Lightbox/Lightbox.astro:536 (grid columns minmax(94px, 1fr) minmax(0, 1080px) minmax(94px, 1fr); the buttons sit 18px outside the column). scratchpad/review/gallery/gaps.mjs at 1440: Odunde 2026, 35 of 43 photographs 18px from previous and 8 portrait photographs 308px; End-of-Year Gala 2025, 5 of 6 at 58px and 1 at 277px; summer camp all 18px. Captures: test-results/review/gallery/site-viewer-odunde-portrait-1440.png (buttons at x 110 and 1278, the photograph from 470 to 970), test-results/review/gallery/site-viewer-gala-1440.png.

**What to build:** Let the stage shrink to the shown photograph (the buttons in a centred row with the frame) so they stay 18px beside it, or record in ADR 0040 that they hold the column. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
