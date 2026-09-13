# 03: /gallery: the albums, the soon state, and photography credit and permissions

Labels: design, content
Status: resolved
Blocked by: 01, 02

**What to build:** `/gallery` renders from Sanity (spec Q4 to Q8, Q13 to Q15): the slim header, the albums in
the mosaic newest year first with each tile linking to its album's first photo address (`open: viewer`) or its
page (`grid`), and the credit and permissions section every gallery route closes with (the prototype's heading
and lead, the Credits row, the owner's consent policy or its chip, the general inbox or its chip with a quiet
"Send a message"). `soon` replaces the albums with the sentence and links to both event pages; no album with a
photograph shows the Pending line.

- [x] `packages/web`: `buildGalleryPage` (tested: order, lines, hrefs by option, soon, Pending, the section's
      rows, edit attributes), the route with `cachePage`, the layout options on the body
- [x] The credit and permissions section composed from library parts, shared with the album page
- [x] `@oy/ui`: page-section stories `Pages/Gallery/Open`, `Captions` and `State` in `PageRoot`, with fixtures of
      the register's photographs and Pending states only; the section's story
- [x] Playwright on `/gallery` at 375 and 1440 in both data modes: one h1, nothing open on load, the albums in
      order with their lines and hrefs (seeded) or the Pending line (placeholder), the section's chips, no
      prototype invention while owed

## Comments

13 September 2026. `buildGalleryPage` (`packages/web/src/lib/sanity/gallery-page.ts`) orders the albums with
`byNewestAlbum`, builds each tile's line with `albumLine` from the cleaned title, links it by the `open` option
(`albumHref`), frames the cover or the first photograph at 720px, and returns the soon sentence with the two
event pages' names from the route map; `galleryCredits` (`gallery-credits.ts`) builds the section's rows for
both routes, and `GalleryCredits.astro` (`packages/web/src/components/`) arranges them from library parts with no
styling. The route edits the `state` option on the albums section, `open` on a wrapper and `captions` on the
grid. Page-section stories: `Pages/Gallery/Open` (the album page with the Lightbox served open, or its grid),
`Captions` and `State`, the album body a story-only `AlbumSection.astro`. Tests: the builder 12, the stories 5.
Playwright `e2e/gallery.spec.ts`: seeded 12 passed; placeholder project 10 passed and 2 skipped (a tile to follow
needs an album).
