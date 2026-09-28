# 07: Homepage photo tiles have 6px corners where the homepage prototype draws them square

Labels: design, later
Status: open
Blocked by: none

**Finding** (R07 in `docs/plans/review-alignment-and-quality.md`; / (PhotoMosaic); polish; drift): Since the Phase 4 homepage parts (commit eb06c2d) the mosaic has carried Impact's class, and the ported rule rounds every homepage tile. The component's own contract, the component map and the homepage prototype all say square corners (polish pass 2: image containers square). Verified with getComputedStyle and a zoomed crop.

**Evidence:** Measured at 1440: site #gallery figure border-top-left-radius 6px, prototype 0px; zoomed corner test-results/review/home-events/pairs/home-mosaic-corner.png. packages/ui/src/media/PhotoMosaic/PhotoMosaic.astro:35 always adds oy-mosaic, so packages/tokens/src/oy-components.css:2490-2493 (.oy-mosaic .v2-mo radius 6px, Impact's six-tile rule from docs/design/design/oy-components.css:545) reaches the homepage; 02 Homepage.dc.html:28-37 styles .v2-mosaic with no radius. PhotoTile.astro:5 and COMPONENT-MAP (PhotoTile) say square corners.

**What to build:** Scope the radius to Impact's six-tile mosaic (.oy-mosaic[data-count='6'] .v2-mo), or add oy-mosaic only for six, so the homepage tiles stay square. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
