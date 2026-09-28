# 53: The Lightbox and the carousel read each description twice or three times; the grid's hear-it-once rule stops at the tiles

Labels: infra
Status: open
Blocked by: none

**Finding** (R53 in `docs/plans/review-alignment-and-quality.md`; Lightbox, PhotoCarousel (accessible text); minor; consistency): Spec Q10 decided a screen reader should hear a photograph's description once while captions are the register's descriptions (ticket 44); the rule was applied to the album grid only. Reading the open Lightbox with a screen reader repeats every description, and each carousel slide repeats its caption. The duplication ends when the owner writes short captions, which is why it is minor.

**Evidence:** scratchpad/review/gallery/dup.mjs: 6 of 6 Lightbox frames on /gallery/gala-2025 and 8 of 8 carousel slides on /odunde carry an alt identical to their caption; the dialog's ariaSnapshot reads the description as the image, the caption paragraph and the status line ('1 of 6. Three women...'). packages/ui/src/media/Lightbox/Lightbox.astro:106 and packages/ui/src/media/PhotoCarousel/PhotoCarousel.astro:64 keep the alt, where packages/web/src/lib/sanity/album-page.ts:106-110 empties a grid tile's alt for the same case (spec Q10).

**What to build:** Apply the grid's rule to the Lightbox's frames and the carousel's slides while the caption says what the alt says, so the description is heard once beside the visible caption. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
