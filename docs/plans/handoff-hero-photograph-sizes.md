# The hero photographs on phones, 11 October 2026

Open-work E26: the homepage hero and the two event pages' headers looked soft on a phone. They now ask for
the photograph at the width a phone draws it, and the photographs are served at quality 50, which takes
back most of what the wider file costs the page's largest paint. The owner chose that from four options,
after the table below and three sheets of crops were sent to them (ADR 0055). Pull request 48, for the
owner to merge.

## What changed

- `@oy/ui`: `photoBandSizes` in `media/image.ts` works a photograph's `sizes` out from its band's
  `min-height` and its own aspect ratio; `Hero` and `PageHeader` use it. The two bands' heights are in
  `page/photo-bands.ts`, repeated from the tokens' `oy-components.css`, and `photo-bands.test.ts` reads
  the stylesheet and fails when the two part. Each component has a `StudioPhotograph` story, the
  photograph as the site passes it, since a plain file carries no `sizes`.
- `@oy/web`: `BAND_PHOTOGRAPH` in `lib/sanity/view.ts` builds the hero's and the headers' files at
  quality 50; every other photograph keeps the builder's 80.

## What a browser draws and fetches

Read in Chromium and WebKit from the production build, at a device pixel ratio of 3, 2 and 1.75.

| Page | The band on a phone | The photograph is drawn | `sizes` now says |
| --- | --- | --- | --- |
| `/` | 640px, its minimum, at every width to 760 | 1129px wide (301vw at 375) | `(max-width: 760px) 1129px, (max-width: 1165px) 1165px, 100vw` |
| `/odunde` | 506 to 609px, where the minimum is 430 | 955 to 1149px | `(max-width: 760px) 812px, (max-width: 887px) 887px, 100vw` |
| `/gala` | 499 to 588px, where the minimum is 430 | 749 to 882px | `(max-width: 645px) 645px, 100vw` |

The homepage's is exact. A header's is a floor, because its copy makes the band taller than its minimum.
Only these three pages draw a photograph behind their header.

The browser takes the narrowest file with at least its own pixel ratio, else the widest. On a phone:

| Page | 3x before, now | 2x before, now | 1.75x (Lighthouse's phone) before, now |
| --- | --- | --- | --- |
| `/` | 1440w, 2880w | 1440w, 2880w | 1440w, 2160w |
| `/odunde` | 1440w, 2880w | 1440w, 2160w | 1440w, 1440w |
| `/gala` | 1440w, 2160w | 1440w, 1440w | 1440w, 1440w |

The widths `createImageSet` offers (720, 1440, 2160 and 2880px) are enough for a 2x phone and give a 3x
phone 2.55 image pixels to the CSS pixel on the homepage, where it had 1.27. No wider file was added: at
3387px it is 634 KB at quality 80 for a difference nobody sees. The floor leaves one case as it was: a 2x
phone on the Gala still takes the 1440px file, 1.6 to 1.9 image pixels to the CSS pixel.

## What it costs

Largest Contentful Paint, the median of five runs, Lighthouse 12.6.1 with its simulated slow 4G.

| Route | The mobile preset (412 at 1.75): before, full quality, quality 50 | A 3x phone (390 at 3): before, full quality, quality 50 |
| --- | --- | --- |
| `/` | 3.40 s, 4.22 s, 3.36 s | 3.43 s, 5.13 s, 3.65 s |
| `/odunde` | 2.88 s, 2.85 s, 2.42 s | 2.84 s, 4.32 s, 3.20 s |
| `/gala` | 2.91 s, 2.91 s, 2.44 s | 2.95 s, 3.64 s, 2.78 s |

The photographs in AVIF, in KB:

| Width | Homepage at 80, 65, 50 | Odunde at 80, 65, 50 | Gala at 80, 50 |
| --- | --- | --- | --- |
| 1440 | 145, 93, 59 | 121, not read, 49 | 145, 57 |
| 2160 | 302, 191, 121 | 255, 161, 101 | 290, 121 |
| 2880 | 490, 314, 199 | 417, 265, 166 | not read, 196 |

On the preset the performance score went 0.89, 0.85, 0.89 for `/`, 0.94, 0.93, 0.95 for `/odunde` and
0.94, 0.93, 0.96 for `/gala`. The 3x runs were taken with the machine under a load of 20 to 39, which
moves the score and not the simulated paint, so their scores are not recorded.

## How it was measured

- `bun --env-file=<the main checkout's packages/web/.env> run build` from `packages/web`, then
  `.vercel/output` copied aside for each of three builds: `main`, the `sizes` alone, and the `sizes`
  with quality 50. A scratch server answered static files with brotli and everything else through the
  render function's `fetch`, keeping each answer that carried a CDN cache header (the runbook's
  Lighthouse section; E14 still owes that script to the repo).
- `lhci collect` with the repo's `lighthouserc.cjs` settings, narrowed to the three routes, five runs
  each. The 3x column swaps the preset's screen for 390 by 844 at 3, because Lighthouse's own phone is
  1.75x and takes a narrower file than the phones the softness shows on.
- The geometry and the file each density takes came from a Playwright script that reads the image's
  box, its natural size and `currentSrc` at each width.
- The crops the owner saw: Playwright screenshots at 390 wide and 3x of the page before, after, and
  after with the photograph's address rewritten to quality 65 and 50.

Three facts that cost time:

- Sanity makes an AVIF the first time its address is asked for and answers that first request with a
  WebP one and a half to two times the weight (`s-maxage=10`). Ask for every candidate until it answers
  `image/avif` before weighing or timing it.
- Vitest hands a test an empty string for an imported stylesheet, `?raw` included, and Vite rewrites
  `new URL(file, import.meta.url)` in a happy-dom test to an address that is no file's. A test that has
  to read a stylesheet resolves it from `import.meta.dirname`.
- The homepage's mobile LCP was already 3.4 s that morning, not September's 2.7 s: the hero photograph
  chosen on 11 October is 4000px wide, so a phone's file went from 36 KB to 145 KB.

## Checked

- `bun check`: typecheck, lint, 1,232 unit tests and the toolchain pins. `bun run build`.
- The two new stories in Storybook at 375 and 1440 wide: the hero's photograph drawn 967px wide on a
  phone and saying so, no sideways overflow, no console error. axe, with the rules Storybook's own panel
  runs, found nothing on the header story at either width, nor on the hero story at 1440 wide or in six
  more runs at 375. The hero story's very first load after Storybook started reported one contrast node,
  which did not come back; axe cannot judge the copy over the scrim's gradient on it or on `Default`.
- The production build in Chromium and WebKit, before and after, at ten widths and three densities.
- The stylesheet test, by changing a band's lower height, its upper height and its breakpoint in the
  tokens in turn: it failed each time, and the stylesheet went back as it was.
- The change was reviewed on both axes (standards and spec) before the commit, and their findings applied.

## Left

- E12: the homepage is at 3.4 s against 2.5 s on the mobile preset. Lighthouse counts none of that as
  the photograph loading: at 121 to 145 KB it has arrived, and the paint waits on what comes before it
  (render delay; ticket 35 names the stylesheet and the fonts). If the photograph has to give more on a
  3x phone, the next step is a crop for phones, a `<picture>` source holding only the third of the
  photograph a phone shows: 99 KB at quality 50 at full density.
- Chromatic will show two new stories, `Page/Hero/StudioPhotograph` and
  `Page/PageHeader/StudioPhotograph`, for the owner to accept.
- The glossary has no entry for a photo band. The Studio and the design handoff use the word for an event
  page's header and call the homepage's the hero; this change's code uses it for both (`PhotoBand`,
  `photoBandSizes`). For `/domain-modeling`.
- A header's `sizes` could only be made exact by fixing the band's height on phones, which is a design
  change, or by the crop for phones above.
- A photograph chosen later gets its AVIF at each width on its first request, as any new image does.
