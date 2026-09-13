# 05: /gallery/[album]: the album page and the photo address

Labels: design, content
Status: open
Blocked by: 01, 03, 04

**What to build:** each album renders at `/gallery/<slug>` from Sanity (spec Q1, Q9, Q10, Q16; ADR 0037): the slim
header with the gallery's kicker, the album's title as the h1 and its facts line, "All albums" and the edition's
page, the credit line and consent note, the photographs, the Lightbox, and the credit and permissions section.
`?photo=<key>` serves the Lightbox open on that photograph; a key the album does not hold serves nothing open; an
unknown slug is a 404; a failed read is a 503 in the Pending form, never cached.

- [ ] `packages/web`: `buildAlbumPage` (tested: the header facts and chips, the links, the credit and its chip, each
      photograph's href and edit attribute, the Lightbox photographs and their credits, the open key cleaned and
      matched, 404 and failure), the route with `cachePage` and the status codes
- [ ] Presentation: the album's location opens its page; edit attributes on every photograph and the credit line
- [ ] Playwright at 375 and 1440 in both data modes: the album page (seeded) or its 503 Pending form (placeholder);
      a tile opens the Lightbox and writes the address; Back closes it with focus on the tile; Forward reopens it;
      a shared photo address loads open and closing keeps the page; arrows and Escape; the dark background closes;
      no-JavaScript link controls; 404; axe with the Lightbox open
