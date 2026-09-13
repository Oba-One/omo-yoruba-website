# 04: The Lightbox and the album page's photographs

Labels: design
Status: resolved
Blocked by: none

**What to build:** the album page's two interactive parts in `@oy/ui` (spec Q2, Q3, Q10 to Q12; ADR 0037, ADR
0038). The photographs as a grid of `PhotoTile` links to their photo addresses, captions always or on hover. The
Lightbox as the inline `oy-lightbox` element over a `<dialog>`: served open on a photo address with link
controls that work without JavaScript; with it, opened from a photograph, moving with Left and Right, the
buttons or a swipe, closing with ×, Escape or the dark background, focus back on the tile of the photograph on
screen; the whole photograph, its caption, its credit with the chip and the count; the history entry pushed on
open, replaced on each move, popped by Back without the router's refetch; `lightbox_opened` announced.

- [x] `PhotoTile` as a link (`href`, the photo key) with the hover-only caption; `PhotoGrid` (`media/`) with the
      Pending line
- [x] `Lightbox` (`media/`): markup, the served-open state, the element script guarded by `customElements.get`,
      `data-ready`, listeners per connection with an AbortController (ADR 0018)
- [x] Stories: closed, open on a photograph, open at 375, a photograph that fails to load, an unconfirmed and a
      photograph's own credit, one photograph; play functions waiting for `data-ready` for the keyboard, the
      buttons, Escape and the focus return
- [x] Tests on the markup: names, the hidden figures, the link controls, the count, lazy images, no glyph chevrons
- [x] The layout's progress bar ignores a cancelled preparation

## Comments

13 September 2026. `PhotoTile` is unchanged but for `eager` and `priority`: `PhotoGrid` (`media/`) wraps each tile
in the link rather than giving `PhotoTile` an href, so the other pages' tiles stay figures. Each link carries
`data-lightbox`, `data-photo` and `data-astro-reload` (the router skips it, and the Lightbox's handler claims the
click whatever order the listeners run in); the gold edge is an `::after` inset shadow, since the photograph covers
the link's own border. `CreditLine` gains `as="span"` for the Lightbox's bar. `Lightbox` (`media/`): every photograph
a hidden frame (`data-key`, `data-position`) with a caption row per photograph in one grid cell, so the bar keeps
the longest caption's height; the served-open dialog has link controls and the script makes it modal once
(`adoptServedOpen`). The history: `pushState(null)` on a tile's open, `replaceState(history.state)` on each move,
`history.back()` to close a pushed entry (a `leaving` flag holds a second Escape), `replaceState` to the album's
address on a page that arrived open; `popstate` syncs the dialog to the address, and `astro:before-preparation` is
cancelled for a traverse between two addresses of the album's own path. Escape is handled on keydown as the other
dialogs do, since a story's synthetic key never fires `cancel`; a native close the page could not hold back keeps
the address in step. The swipe is passive touch events on the stage (40px, further sideways than down, ignored above
a `visualViewport.scale` of 1.01). The layout's progress bar now sets `data-loading` a microtask later and only for a
preparation nobody cancelled. Stories: the served-open default, 375, a later photograph, an own credit, one
photograph, a failed image, closed, and play functions for a tile's open, move and Escape with focus return, the
wrapping buttons, modifiers and the background close (all finish in the canvas). Tests: `media/` 51 passed. The
component map rows describe `PhotoGrid`, `Lightbox`, `PhotoTile` and `CreditLine`.
