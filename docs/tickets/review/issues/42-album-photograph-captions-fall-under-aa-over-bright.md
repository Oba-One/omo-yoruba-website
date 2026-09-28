# 42: Album photograph captions fall under AA over bright photographs; the scrim is lighter than the prototype's

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R42 in `docs/plans/review-alignment-and-quality.md`; PhotoTile in PhotoGrid (/gallery/[album]); major; drift): PhotoTile's scrim was drawn for the homepage mosaic's one-line captions (Phase 4); the album grid reuses it with the dataset's descriptions, which run to two lines (accepted by ADR 0040) and climb into the gradient's nearly transparent top. White 13px text then sits over bright plazas, pale agbádá and white walls: 18 of 43 Odunde tiles have at least a tenth of their text pixels under 4.5:1, where the prototype's own tiles pass on 42 of 43. This fails the elder test (AA) on the page most visited for photographs, and axe reports it only as incomplete.

**Evidence:** packages/ui/src/media/PhotoTile/PhotoTile.astro:119-122 (padding 36px 16px 12px; linear-gradient(180deg, transparent, var(--surface-dark) 130%), so 77% at the caption's foot; 13px/600 white) against 18 Photo Gallery.dc.html:38 (.gy-photo figcaption to rgba(20,29,64,.88) at 100%, 12.5px). Pixel check scratchpad/review/gallery/caption-contrast.mjs (glyphs hidden, white against every pixel of each text line box): /gallery/odunde-2026 at 1440, 18 of 43 captions with a 10th percentile under 4.5:1 (tile 17 median 4.42 with 53% of pixels under 4.5:1; tile 15 13% under 3:1), 19 of 43 at 375; /gallery/gala-2025 2 of 6 (tile 6 p10 3.67). The prototype's captions measured the same way: 1 of 43 and 0 of 6. axe color-contrast on .oy-photo-grid: 43 incomplete ('background gradient'), 0 passes, so the gate cannot see it. Captures: test-results/review/gallery/site-odunde-tile-17-1440.png, test-results/review/gallery/site-odunde-tile-15-1440.png, test-results/review/gallery/site-album-gala-1440.png against test-results/review/gallery/proto-album-gala-1440.png. Also: Pixel-sampled under each caption line with the text hidden (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/photo-contrast.txt): /gallery/odunde-2026 "An elder in a pale aṣọ òkè agbádá and cap" mean 4.46:1 (375), lightest decile 3.27:1; "A man in a purple and teal print shirt" lightest decile 2.91:1; / "Ọjà Balógun • Vendors at the market" 3.93:1; /odunde figure "Festival day • Leimert Park" 4.17:1; /impact "Odunde • 2026" 4.0:1; /gallery "43 photographs" 4.25:1. packages/ui/src/media/PhotoTile/PhotoTile.astro:120 sets linear-gradient(180deg, transparent, var(--surface-dark) 130%), about 77% at the bottom edge, where the prototype mosaic sets rgba(20, 29, 64, .84) (docs/design/design/oy-components.css:548).

**What to build:** Give the album grid's captions the prototype's scrim (to indigo-900 at 88% at the foot, starting higher for two-line captions), through a PhotoTile scrim variant that PhotoGrid sets, then re-measure; teach the E15 contrast helper to sample text over photographs, since axe leaves it incomplete. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Ready: the prototype's scrim is the target, measured before and after.
