# 06: Swipe on the photo carousel

Labels: design
Status: open
Blocked by: 04

**What to build:** the event pages' photo carousel moves on the same swipe as the Lightbox (spec Q3, ADR 0038):
one touch, at least 40px sideways and further sideways than down, ignored while the page is pinch-zoomed, with no
change to scrolling or zoom. Wayfinder ticket 37's swipe answer is recorded; its other four answers stay open.

- [ ] `oy-photo-carousel`: the gesture on the stage, identical to the Lightbox's; the component test names the
      thresholds; ADR 0027's swipe line points to ADR 0038
- [ ] Playwright: a synthetic swipe moves the carousel at 375 on `/odunde`, a short or vertical one does not,
      skipped where the Studio holds fewer than two photographs
- [ ] Wayfinder ticket 37 notes the swipe answer
