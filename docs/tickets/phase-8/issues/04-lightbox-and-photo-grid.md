# 04: The Lightbox and the album page's photographs

Labels: design
Status: open
Blocked by: none

**What to build:** the album page's two interactive parts in `@oy/ui` (spec Q2, Q3, Q10 to Q12; ADR 0037, ADR
0038). The photographs as a grid of `PhotoTile` links to their photo addresses, captions always or on hover. The
Lightbox as the inline `oy-lightbox` element over a `<dialog>`: served open on a photo address with link
controls that work without JavaScript; with it, opened from a photograph, moving with Left and Right, the
buttons or a swipe, closing with ×, Escape or the dark background, focus back on the tile of the photograph on
screen; the whole photograph, its caption, its credit with the chip and the count; the history entry pushed on
open, replaced on each move, popped by Back without the router's refetch; `lightbox_opened` announced.

- [ ] `PhotoTile` as a link (`href`, the photo key) with the hover-only caption; `PhotoGrid` (`media/`) with the
      Pending line
- [ ] `Lightbox` (`media/`): markup, the served-open state, the element script guarded by `customElements.get`,
      `data-ready`, listeners per connection with an AbortController (ADR 0018)
- [ ] Stories: closed, open on a photograph, open at 375, a photograph that fails to load, an unconfirmed and a
      photograph's own credit, one photograph; play functions waiting for `data-ready` for the keyboard, the
      buttons, Escape and the focus return
- [ ] Tests on the markup: names, the hidden figures, the link controls, the count, lazy images, no glyph chevrons
- [ ] The layout's progress bar ignores a cancelled preparation
