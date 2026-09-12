# 06: Past years and partners on /odunde

Labels: design
Status: open
Blocked by: 03

**What to build:** past years as the framed Photo Carousel (a plain custom element, ADR 0018): the
newest past festival album's first eight photographs with captions, previous and next, dots, count,
keyboard arrows, reduced motion, 44px targets, a no-JavaScript state; the album credit with a Pending
chip while unconfirmed; the lead with the attendance Pending chip. Then partners as text chips or logos
with a Pending chip when none exist, and the boxed handoff with Donate and Sponsor Odunde.

- [ ] `@oy/ui`: `PhotoCarousel` per `docs/research/phase-5-photo-carousel-custom-element.md` with a play function driving the keyboard; `PartnerRow` (chips, logos, Pending); `Handoff` gains the boxed form with up to two actions; stories and tests
- [ ] The query and `buildFestivalPage` carry the past album (asset references, the credit, the confirmation) and the partners scoped to Odunde
- [ ] Playwright: arrows and buttons move the slide and the count, the dots select, nothing auto-rotates, the no-JS state shows a photograph; axe with the carousel mid-way

## Comments
