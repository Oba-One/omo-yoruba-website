# The photo carousel's controls: keep the rules' answers or change them

Type: grilling
Status: open
Owner: yes
Labels: design
Phase: 5
Blocked by: none

## Question

The research note (`docs/research/phase-5-photo-carousel-custom-element.md`) left five choices to the
owner. ADR 0027 answered each with the rule that outranks the prototype, so the carousel ships and any
answer can be reversed:

1. Swipe: none until the Lightbox (Phase 8) decides for both.
2. The dots are 44px tabs with the 12px dot drawn inside, not the prototype's 12px dots on a 20px
   pitch; the alternative is decorative dots with previous, next and the count as the only controls.
3. The chevrons are drawn (the glyph set has no ‹ ›); the tabs are named "Photo 2", not "Photo 2 of 6".
4. The count reads "1 of 8", not uppercase; the caption keeps 15px and the count 12.5px.
5. Eight photographs, so eight dots take two rows at 375 (the count moves up beside the caption); the
   carousel could take six instead.

## Comments

13 September 2026 (Phase 8). Answer 1 is settled with the owner in the gallery grill (`docs/tickets/phase-8/spec.md`,
Q3; ADR 0038): the Lightbox and the carousel both move on one touch swipe, at least 40px sideways and further
sideways than down, ignored while the page is pinch-zoomed, with no change to scrolling or zoom; the buttons stay.
Answers 2 to 5 (the dots as tabs, the drawn chevrons, the count's case, eight photographs) are still the owner's.
