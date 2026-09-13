# 05: /gallery/[album]: the album page and the photo address

Labels: design, content
Status: resolved
Blocked by: 01, 03, 04

**What to build:** each album renders at `/gallery/<slug>` from Sanity (spec Q1, Q9, Q10, Q16; ADR 0037): the slim
header with the gallery's kicker, the album's title as the h1 and its facts line, "All albums" and the edition's
page, the credit line and consent note, the photographs, the Lightbox, and the credit and permissions section.
`?photo=<key>` serves the Lightbox open on that photograph; a key the album does not hold serves nothing open; an
unknown slug is a 404; a failed read is a 503 in the Pending form, never cached.

- [x] `packages/web`: `buildAlbumPage` (tested: the header facts and chips, the links, the credit and its chip, each
      photograph's href and edit attribute, the Lightbox photographs and their credits, the open key cleaned and
      matched, 404 and failure), the route with `cachePage` and the status codes
- [x] Presentation: the album's location opens its page; edit attributes on every photograph and the credit line
- [x] Playwright at 375 and 1440 in both data modes: the album page (seeded) or its 503 Pending form (placeholder);
      a tile opens the Lightbox and writes the address; Back closes it with focus on the tile; Forward reopens it;
      a shared photo address loads open and closing keeps the page; arrows and Escape; the dark background closes;
      no-JavaScript link controls; 404; axe with the Lightbox open

## Comments

13 September 2026. `buildAlbumPage` (`album-page.ts`) takes the query's data and the page's `?photo=`: the header
facts (the year or its chip, then the count), the links (`editionRoute` and the event page's name, the Collective
by its name), the credit and consent note, the tiles at 360px with the alt left empty beside the same caption,
the Lightbox's photographs at 1024px (the web-sized assets are about 1024 to 1100px wide, so a wider request
would fall back to the half-size candidate) with each photograph's own credit or the album's, the open key cleaned
and matched, and `eager: 0` under a served-open Lightbox. The route returns an empty 404 for no album, sets 503
for a failed read, and places the Lightbox first in the section. `AlbumIntro` (`@oy/ui/media`) holds the links, the
credit line and the consent note with the prototype's spacing, since the page owns no styling.

Found on the running site: cancelling the router's `astro:before-preparation` makes Astro 7.3.1 load the page in
full (`location.href = to.href`). The layout's head now carries a classic `popstate` guard registered before the
router's module; the Lightbox sets `window.oyHistoryGuard` and claims a traverse between two addresses of its own
album page, and the progress-bar change of ticket 04 is reverted. ADR 0037 and the spec's facts say so. Checked
by hand on `/gallery/gala-2025` (a tile, Right, Back with focus on the photograph's tile, Forward, Escape, all in
one document) and from a `/gallery` tile through the router (served open, Escape, Back to the gallery).

Playwright `e2e/album.spec.ts`: seeded 21 passed and 1 skipped (touch in the desktop project); placeholder project
10 passed and 12 skipped (the Lightbox needs an album). Both routes joined the 44px sweep (the served-open
Lightbox too) and the heading-order check.
