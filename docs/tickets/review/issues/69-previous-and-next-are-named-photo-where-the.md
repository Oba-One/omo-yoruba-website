# 69: Previous and next are named 'photo' where the gallery prototype and the page say 'photograph'

Labels: design, later
Status: open
Blocked by: none

**Finding** (R69 in `docs/plans/review-alignment-and-quality.md`; Lightbox; polish; drift): Only screen reader users hear the difference, but the gallery's own words are 'photographs' everywhere (the count, the credit, the kicker), and the prototype names these buttons that way. No ADR records the change.

**Evidence:** packages/ui/src/media/Lightbox/Lightbox.astro:123 and :134 (aria-label 'Previous photo', 'Next photo'); 18 Photo Gallery.dc.html:119 and :124 ('Previous photograph', 'Next photograph'). ADR 0027 kept 'photo' for the carousel, whose own prototype says 'photo' (Photo Carousel.dc.html:30-31); ADR 0040 does not mention the Lightbox's names.

**What to build:** Name them 'Previous photograph' and 'Next photograph', as the prototype does, in the markup, the stories and the e2e locators. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
