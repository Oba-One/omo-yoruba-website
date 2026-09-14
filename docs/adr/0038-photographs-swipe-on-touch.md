# Photographs swipe on touch, in the Lightbox and the photo carousel

Decided with the owner on 13 September 2026 (Phase 8 grill, `docs/tickets/phase-8/spec.md`, Q3), answering the
swipe question wayfinder ticket 37 carried from ADR 0027 and
`docs/research/phase-5-photo-carousel-custom-element.md` (section F). ROUTES section 3 and the Interaction
Inventory ask swipe of the Lightbox; the research note asked that the Lightbox decide once for both
components, since they step through photographs the same way.

Both `oy-lightbox` and `oy-photo-carousel` move to the next or previous photograph on one gesture:

- a single touch that travels at least 40px sideways, further sideways than vertically, from its start on the
  stage to its end;
- read from passive `touchstart` and `touchend` listeners on the stage (`touchcancel` forgets the start), so a
  mouse drag never swipes and a pen swipes wherever the browser reports it as touch;
- ignored while the page is pinch-zoomed (`visualViewport.scale` above 1), so a zoomed reader pans instead;
- with no `touch-action` rule and no `preventDefault()`: vertical scrolling and pinch zoom stay the
  browser's.

The previous and next buttons remain the single-pointer alternative WCAG 2.5.1 asks for. Ticket 37's other
four answers (the dots as tabs, the drawn chevrons, the count's case, eight photographs) stay open for the
owner.

## Considered options

- Pointer events with `touch-action: pan-y pinch-zoom`, the research note's minimal version: the browser would
  hand horizontal movement to the script, but a zoomed reader could no longer pan sideways with a gesture that
  starts on the stage, which in the full-screen Lightbox is almost the whole screen.
- Pointer events with no `touch-action`: the browser may claim a horizontal touch drag for its own gestures
  (panning, history navigation) and send `pointercancel` before the pointer lifts, so the swipe could be lost
  on a phone.
- Swipe in the Lightbox only: the carousel's stage is a photograph in the page too, and a reader who swipes
  one would expect the other to follow.
- No swipe: the buttons meet 2.5.1, but the inventory asks for it and a phone reader reaches for it first.

## Consequences

- ADR 0027's "Swipe. None." is superseded; its other answers stand.
- The gesture is a few lines in each element's inline script: ADR 0018 keeps those scripts unbundled, so the
  two copies stay identical and each component's test names the thresholds.
- Playwright dispatches synthetic touch events at 375 (the mobile project has touch); a play function cannot
  create a trusted touch, so the stories prove the buttons and keys and Playwright proves the swipe.
- A swipe is not discrete input, so the photograph's fade after it is the only movement that follows; the
  frame keeps its size, so nothing counts toward layout shift.
