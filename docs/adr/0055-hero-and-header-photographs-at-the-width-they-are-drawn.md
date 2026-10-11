# The hero and header photographs are asked for at the width they are drawn, at quality 50

Decided by the owner on 11 October 2026, from the measurements below (open-work E26). The homepage hero and the
photo band of an event page's header lay their photograph behind the copy with `object-fit: cover`, in a band that
is taller than a phone is wide. The photograph is therefore scaled by the band's height: 1129px wide in the
homepage's 640px band on every phone, about three screens. Both components told the browser `sizes="100vw"`, so a
phone with three device pixels to the CSS pixel fetched the 1440px file and drew 1.27 image pixels where it had
three to fill, and the photograph was soft.

What this change builds:

- `photoBandSizes` (`@oy/ui`, `media/image.ts`) works `sizes` out from the band's `min-height` and the photograph's
  own aspect ratio. The homepage's reads `(max-width: 760px) 1129px, (max-width: 1165px) 1165px, 100vw`, which is
  what Chromium and WebKit draw to within 2px. The heights are the tokens' (`.v2-hero` and `.oy-phead--photo` in
  `oy-components.css`), repeated in `page/photo-bands.ts` because `sizes` cannot read a stylesheet;
  `photo-bands.test.ts` reads the stylesheet and fails when the two part.
- `BAND_PHOTOGRAPH` (`@oy/web`, `lib/sanity/view.ts`) builds those photographs' files at quality 50. Every other
  photograph keeps the builder's 80, and the widths are the ones a full-width photograph already had.

The true `sizes` alone moves a phone to a file two to three times the weight, and the photograph is each page's
largest paint. Largest Contentful Paint, the median of five runs on the production build served locally, Lighthouse 12.6.1
with its simulated slow 4G:

| Route | The mobile preset (412 wide at 1.75): before, full quality, quality 50 | A 3x phone (390 wide at 3): before, full quality, quality 50 |
| --- | --- | --- |
| `/` | 3.40 s, 4.22 s, 3.36 s | 3.43 s, 5.13 s, 3.65 s |
| `/odunde` | 2.88 s, 2.85 s, 2.42 s | 2.84 s, 4.32 s, 3.20 s |
| `/gala` | 2.91 s, 2.91 s, 2.44 s | 2.95 s, 3.64 s, 2.78 s |

The homepage's photograph is 145 KB at 1440px and 490 KB at 2880px at quality 80, and 199 KB at 2880px at quality
50. In crops of a 3x phone's screen magnified three times, the 2880px file at 50 differs from the same file at 80
only in the finest weave of a cloth, and both are far sharper than the 1440px file. Those crops and this table went
to the owner with four options, and the owner chose quality 50.

At quality 50 a 3x phone still pays for the sharper file: 0.2 s on the homepage and 0.4 s on the Odunde page. The
mobile preset, whose phone is 1.75x, shows none of that.

## Considered options

- **The true `sizes` at full quality:** the sharpest files, and the middle figures above: the homepage 0.8 s slower
  on the preset and 1.7 s on a 3x phone, with the 2.5 s budget already missed (E12).
- **Quality 65:** no difference from 80 in the crops; 314 KB at 2880px, so about 4.3 s on a 3x phone by the file
  sizes (not measured).
- **Leaving `100vw`:** no cost, and the photograph stays soft on every phone.
- **A wider file for 3x phones:** the widths stop at 2880px, 2.55 image pixels to the CSS pixel on the homepage
  where a 3x phone could show 3. A 3387px file is 634 KB at quality 80 and 260 KB at 50, for a difference nobody
  sees.
- **The lower quality on the dense files only:** it would keep a 1x desktop's 1440px file at quality 80, and needs
  an option in the builder. The 1x desktop crop at 50 showed too little loss to build it.
- **A crop for phones** (a `<picture>` source holding only the third of the photograph a phone shows): a 3x phone
  would get full density from a 99 KB file at quality 50. It reaches into three packages and a second framing
  rule, and is the next step if the photograph still costs a 3x phone too much.
- **`max()` in `sizes`:** one entry for each side of the breakpoint. Plain lengths under `max-width` conditions say
  the same in the grammar every browser has read since `sizes` shipped.

## Consequences

- A band's copy can make it taller than its `min-height`, so a page header's `sizes` is the least its photograph is
  drawn at: the Odunde page says 812px where a phone draws 955 to 1149px, and the Gala 645px for 749 to 882px. A
  3x phone takes the 2880px file on Odunde and the 2160px one on the Gala all the same. A 2x phone takes a wider
  file on the homepage and on Odunde, and the Gala's stays the 1440px one. The homepage's band is exactly its
  `min-height` with today's copy.
- Screens from 761 to 1165px wide (tablets) draw the homepage's photograph 1165px wide, and now ask for that too.
- Desktops get the lighter files as well: 59 KB where a 1x screen fetched 145 KB, 199 KB where a 2x screen fetched
  490 KB. Desktop LCP was not measured; the file a desktop takes is as wide as before.
- A band's height changed in the tokens has to change in `photo-bands.ts`; the test names the selector. The test
  reads the band's own two rules, so a height that reaches the band another way is not caught.
- The code calls both bands photo bands. The Studio and the design handoff use that word for an event page's
  header and call the homepage's the hero, and CONTEXT.md has no entry for either.
- Sanity makes an AVIF the first time its address is asked for and answers that first request with a WebP one and
  a half to two times the weight. The three photographs in place were asked for at quality 50 on 11 October, so
  their AVIFs exist; a newly chosen photograph's first visitor at each width gets the stand-in once.
- E12 stays open for the homepage: 3.4 s against 2.5 s on the mobile preset, before and after. It was 2.7 s in
  September, when the hero was an 1100px photograph whose one file weighed 36 KB.
