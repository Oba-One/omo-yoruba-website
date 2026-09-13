# 06: Past years and partners on /odunde

Labels: design
Status: resolved
Blocked by: 03

**What to build:** past years as the framed Photo Carousel (a plain custom element, ADR 0018): the
newest past festival album's first eight photographs with captions, previous and next, dots, count,
keyboard arrows, reduced motion, 44px targets, a no-JavaScript state; the album credit with a Pending
chip while unconfirmed; the lead with the attendance Pending chip. Then partners as text chips or logos
with a Pending chip when none exist, and the boxed handoff with Donate and Sponsor Odunde.

- [x] `@oy/ui`: `PhotoCarousel` per `docs/research/phase-5-photo-carousel-custom-element.md` with a play function driving the keyboard; `PartnerRow` (chips, logos, Pending); `Handoff` gains the boxed form with up to two actions; stories and tests
- [x] The query and `buildFestivalPage` carry the past album (asset references, the credit, the confirmation) and the partners scoped to Odunde
- [x] Playwright: arrows and buttons move the slide and the count, the dots select, nothing auto-rotates, the no-JS state shows a photograph; axe with the carousel mid-way

## Comments

12 September 2026. `media/PhotoCarousel` is the research note's tabbed carousel as an inline custom
element: the first photograph server-rendered, the rest `hidden`, the dots as 44px tabs with one tab
stop, drawn chevrons, Left and Right on the tabs and the buttons, Home and End on the tabs, a 0.2s fade
that reduced motion drops, the neighbours warmed as the carousel nears the viewport, nothing on load.
ADR 0027 records the five choices the research left open, each settled by a rule that outranks the
prototype (44px targets, the glyph set, uppercase only for kickers and chips, swipe left to the
Lightbox). Four play stories drive the buttons and the keyboard and finish clean in the canvas.
`content/PartnerRow` (chips, logos, links, the Pending line), `media/CreditLine` ("Photographs: Red
Carpet Media" with the chip until the credit is confirmed) and `SectionHead`'s note (the past years'
lead gains the attendance chip) complete the two sections; the page closes with the boxed handoff, gold
Donate and Sponsor Odunde. The registry gains a presence row, "the photo albums", for the carousel's
empty stage. Under 720px the count moves up beside the caption so eight dots never leave it on a row
of its own. The development dataset has the Odunde 2026 album (43 photographs, the first eight shown),
no attendance figure and no partners, so the page shows both chips and the partners' Pending line.

