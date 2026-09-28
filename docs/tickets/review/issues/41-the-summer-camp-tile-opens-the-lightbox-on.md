# 41: The summer camp tile opens the Lightbox on a different photograph from the cover it shows

Labels: design
Status: open
Blocked by: none

**Finding** (R41 in `docs/plans/review-alignment-and-quality.md`; AlbumGrid under open: viewer (/gallery); minor; drift): Spec Q4 says viewer opens the album's first photograph, which matches the prototype only while the cover is the first photograph; the seed chose the art class photograph as the summer camp's cover and the register's order puts community-dance first. A reader clicks children holding drawings and lands on an unrelated lecture-hall photograph. Odunde 2026 and End-of-Year Gala 2025 are unaffected because their covers are their first photographs.

**Evidence:** packages/web/src/lib/sanity/gallery-page.ts:45-52 draws the cover (image: album.cover ?? album.firstPhoto) but links to the first photograph (href uses firstPhoto). scratchpad/review/gallery/camp.mjs: the Summer camp tile shows summer-camp-kids-art-class and links to /gallery/summer-camp?photo=community-dance, which opens '1 of 19' on 'A woman in green print and gèlè laughs with her arms out as the room sings'; the cover is photograph 6 of 19. In the prototype the cover is photograph 1, so viewer opens the photograph the tile shows (18 Photo Gallery.dc.html:192-193, :251). Captures: test-results/review/gallery/site-camp-tile-1440.png, test-results/review/gallery/site-camp-opens-1440.png.

**What to build:** Under viewer, link a tile to its cover's photograph when the cover is one of the album's photographs (match the asset reference in galleryPageQuery), else the first; meanwhile moving the summer camp's cover photograph first in the album fixes the one case. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
