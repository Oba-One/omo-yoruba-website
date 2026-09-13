# The photo carousel is APG's tabbed carousel, and the repo's rules outrank the prototype's controls

Decided on 12 September 2026 while building ticket 06 of Phase 5, from
`docs/research/phase-5-photo-carousel-custom-element.md`. The research left five choices to the owner;
each has an answer in a rule that outranks the prototype (AGENTS.md, the component map, ADR 0018), so
the carousel ships with those answers and the owner can reverse any of them on review.

`PhotoCarousel` (`packages/ui/src/media/PhotoCarousel`) is an inline custom element, `oy-photo-carousel`,
over server-rendered markup (ADR 0018). It follows the tabbed carousel of the W3C APG: a group named by
the section heading with `aria-roledescription="carousel"`, the slides as tab panels inside a polite
live region, the prototype's dots completed as tabs with one tab stop, Left and Right on the tabs and
on previous and next, Home and End on the tabs, and no rotation. Where `Photo Carousel.dc.html`
differs, the site departs from it:

- **Dots.** The prototype draws 12px dots on a 20px pitch. The elder test asks for 44px targets, so each
  dot is a 44px tab with the 12px dot drawn inside; eight dots take one row at 1440 and two at 375,
  where the count moves up beside the caption.
- **Chevrons.** The prototype shows ‹ and ›, outside the glyph set (• → ✓ ×). The buttons draw their
  chevrons with borders, as SiteNav draws its caret; their names stay "Previous photo" and "Next photo".
- **Count.** The prototype sets "1 OF 6" in uppercase. Uppercase is for kickers and path chips only, so
  the count reads "1 of 8". The caption keeps the port's 15px and the count its 12.5px bold: neither is
  body copy, as PhotoTile's 13px caption already is not.
- **Tab names.** "Photo 2" instead of "Photo 2 of 6": the tabs pattern carries the position, which the
  pattern calls unnecessary in a name.
- **Swipe.** None. The component map lists swipe for the Lightbox, not the carousel, and the buttons
  meet WCAG 2.5.1 without it; the Lightbox (Phase 8) decides for both.
- **One slide at a time.** The prototype stacks every slide at opacity 0 behind a .35s fade and hides the
  inactive ones only with `aria-hidden`. The site renders the inactive slides `hidden`, fades the
  incoming one in over 0.2s (the conventions' range), not at all under reduced motion, and hides the
  outgoing slide when the fade ends. Every caption sits in one grid cell, so the bar keeps the longest
  caption's height and no dot moves under a finger when the photograph changes.
- **Without JavaScript.** The first photograph and its caption show; the controls keep their boxes but
  stay invisible until the element marks itself ready, so the upgrade shifts nothing. The section's
  "All Odunde albums" link is the way to the other photographs.

## Considered options

- The prototype's markup as drawn (a region, a tablist whose tabs control nothing, ‹ ›, 12px dots):
  rejected; it breaks the glyph rule and the 44px rule, and its tabs expose no panels.
- APG's basic carousel, the dots decorative: keeps the prototype's spacing but drops direct picking,
  which the prototype offers.
- A scroll-snap strip: every photograph reachable without JavaScript and native swipe, but the strip
  needs its own tab stop, keeps every slide in the accessibility tree and turns the fade into a slide.

## Consequences

- The research's open questions for the owner are answered here; the handoff lists them for review.
- `packages/web/e2e/carousel.spec.ts` drives both kinds of control, the tablist keys, reduced motion, no
  rotation, a client-side navigation and the no-JavaScript state, and skips when the Studio holds fewer
  than two photographs (CI's placeholder project).
- The Gala's past galas (ticket 09) reuse the component with its own id and heading.
