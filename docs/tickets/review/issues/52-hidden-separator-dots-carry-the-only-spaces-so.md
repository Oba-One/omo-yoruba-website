# 52: Hidden separator dots carry the only spaces, so screen readers get joined words and a merged year and count

Labels: bug
Status: open
Blocked by: none

**Finding** (R52 in `docs/plans/review-alignment-and-quality.md`; AlbumTile, PhotoTile, Lightbox (accessible text); minor; a11y-perf): Today the gallery shows the join in the Lightbox bar on every photograph; the album tile's line shows no year yet because each dated album names its year in its title, but as soon as an album gets a year its title does not carry (the summer camp, open-work C3) a screen reader will read the year and the count as one number (an album of 19 photographs from 2019 would read '201919 photographs'). Verified in the component stories and on the live routes.

**Evidence:** CDP accessibility tree and ariaSnapshot (scratchpad/review/gallery/names.mjs, names2.mjs): the media-albumtile--with-year story's link is named 'End-of-Year Gala 20256 photographs' (packages/ui/src/media/AlbumTile/AlbumTile.astro:81-87); the Lightbox bar reads '...stand together in the hallPhotographs: Members and volunteers...' (packages/ui/src/media/Lightbox/Lightbox.astro:144-155); PhotoTile's caption reads 'ỌdúndéFestival day at Leimert Park' (media-phototile--default) and 'ÀjọṣePartners and friends at the table' on /impact (packages/ui/src/media/PhotoTile/PhotoTile.astro:83-87). In each the dot span holds ' • ' and is aria-hidden. The page header's facts line is unaffected ('Pending: the year of the album 19 photographs').

**What to build:** Keep the spaces outside the hidden dot ({' '}<span aria-hidden="true">•</span>{' '}) in the three components, and add a test on each one's accessible text. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
