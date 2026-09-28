# 51: Covers and carousel slides frame at the centre instead of the prototype's focus points, cutting heads on the wide tiles

Labels: design
Status: open
Blocked by: none

**Finding** (R51 in `docs/plans/review-alignment-and-quality.md`; Album covers and past-years slides (seed, Studio hotspots); minor; drift): The site turns a hotspot into object-position, but no album image carries one, so the 516 by 208 wide tiles of the three-album mosaic and the 2:1 carousel stage crop 4:3 group photographs from the centre. The Gala's cover and first slide lose the tops of the geles that the prototype's 50% 30% and 50% 35% keep. No ADR records the difference; ADR 0040 and ADR 0027 cover the mosaic's and the carousel's geometry, not the framing.

**Evidence:** scratchpad/review/gallery/covers.mjs: every cover on /gallery renders object-position 50% 50% at 375 and 1440 (no hotspot); the prototype sets 50% 68% (Odunde), 50% 30% (Gala), 50% 40% (camp) (18 Photo Gallery.dc.html:139, :184, :250). scratchpad/review/gallery/carousel.mjs: /gala slide 1 at 50% 50% against 09 End-of-Year Gala.dc.html:251 (50% 35%), /odunde slide 1 at 50% 50% against 08 Odunde Festival.dc.html:299 (50% 55%). packages/content/scripts/seed-data.ts:370-377 writes the covers and photographs with no focus, where image() (:76-99) carries the prototype's framing as a hotspot for other images. Captures: test-results/review/gallery/site-gala-tile-50-50-1440.png (the right gèlè cut at the top edge) against test-results/review/gallery/site-gala-tile-50-30-simulated-1440.png, test-results/review/gallery/site-gala-carousel-1440.png against test-results/review/gallery/proto-gala-carousel-1440.png. The lead tile's 26px title at 375 has a 10th percentile of 3.04 against the plaza (scratchpad/review/gallery/lead-lines.mjs).

**What to build:** Set hotspots on the three covers and on the photographs past years shows from the prototype's positions, in the Studio or through a seed revision that passes focus as image() does elsewhere. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
