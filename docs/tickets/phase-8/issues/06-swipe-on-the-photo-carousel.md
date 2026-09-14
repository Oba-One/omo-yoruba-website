# 06: Swipe on the photo carousel

Labels: design
Status: resolved
Blocked by: 04

**What to build:** the event pages' photo carousel moves on the same swipe as the Lightbox (spec Q3, ADR 0038):
one touch, at least 40px sideways and further sideways than down, ignored while the page is pinch-zoomed, with no
change to scrolling or zoom. Wayfinder ticket 37's swipe answer is recorded; its other four answers stay open.

- [x] `oy-photo-carousel`: the gesture on the stage, identical to the Lightbox's; the component test names the
      thresholds; ADR 0027's swipe line points to ADR 0038
- [x] Playwright: a synthetic swipe moves the carousel at 375 on `/odunde`, a short or vertical one does not,
      skipped where the Studio holds fewer than two photographs
- [x] Wayfinder ticket 37 notes the swipe answer

## Comments

13 September 2026. `oy-photo-carousel` carries the Lightbox's gesture on `.oy-carousel-stage`: passive touch events,
`SWIPE = 40`, further sideways than down, ignored above a `visualViewport.scale` of 1.01, moving through the same
`show()` the buttons use (so the dot, the count and the fade follow). The component test names the thresholds; the
component map row and ADR 0027's swipe line point to ADR 0038; wayfinder ticket 37 records answer 1 and leaves
the other four open. Playwright `e2e/carousel.spec.ts` (mobile project, seeded): 14 passed and 1 skipped, the new
swipe test on `/odunde` and `/gala` among them.
