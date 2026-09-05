# 07: PatternBand and ImagePlaceholder

Labels: design
Status: resolved
Blocked by: 04

**What to build:** `PatternBand` places one texture where a band asks for it: the àdìrẹ dot field
overlay, the chevron row, the motif column or the batik wash, with an opacity override, using the
SVGs shipped in `@oy/tokens`. `ImagePlaceholder` stands in wherever a photo is missing: gradient or
àdìrẹ fill, a caption naming the future photo, a fixed aspect ratio, square corners, `role="img"`
with a label. Stories show every pattern and tone, the placeholder at a card's width and in a dark
band.




- [x] `src/bands/PatternBand/PatternBand.astro` with `pattern` and `opacity`; stories Default,
      Chevron, Motif, Batik, OnDark
- [x] `src/media/ImagePlaceholder/ImagePlaceholder.astro` with `what`, `aspect`, `tone`; stories
      Default, each tone, Pending, OnDark
- [x] No pattern reaches into `docs/design`; every URL comes from a token
- [x] Tests render the stories and check the aria label and aspect ratio
