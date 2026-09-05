# Fonts: Source Serif 4 and Source Sans 3 coverage, subsets and packages

Date: 5 September 2026. Sources: named per bullet. Method: the Adobe release fonts (source-sans
3.052R OTF zip and source-serif 4.005R Desktop zip, fetched through the GitHub releases API) and
the woff2 files inside the fontsource 5.3.0 packages (installed with Bun 1.4.2 into a scratch
directory) were opened with fontTools 4.64.0 and shaped with uharfbuzz (HarfBuzz) in a Python 3.14
venv; the Google Fonts CSS was read in this session's Chromium 148 browser pane, which also ran
three font-loading experiments through `document.fonts`; the Astro, MDN, CSS Fonts 4, Vite and
fontsource pages were read in full where a summary fell short. Every pin below is exact.

## Glyphs and mark positioning in the fonts themselves

- The Adobe READMEs say nothing about character coverage. source-sans has the sections "Source
  Sans 3, Open source files, Getting involved, Releases"; source-serif has "Source Serif, Source
  files, Getting involved, Releases, Design information", and its wiki readme only says "an
  open-source typeface for setting text in many sizes, weights, and languages". Sources:
  https://github.com/adobe-fonts/source-sans/blob/release/README.md,
  https://github.com/adobe-fonts/source-serif/blob/release/README.md,
  https://github.com/adobe-fonts/source-serif/wiki/Source-Serif-Readme. Coverage was therefore
  verified in the binaries.
- Latest releases: source-sans 3.052R, "Fonts version 3.052 (OTF, TTF, VF, WOFF, WOFF2)",
  2023-04-04; source-serif 4.005R, "Fonts version 4.005 (OTF, TTF, WOFF, WOFF2, Variable)",
  2023-01-20, a technical update (the CFF2 variable fonts are now hinted) plus three minor fixes
  including "fix substitution for io + combining mark (#90)". Sources:
  https://github.com/adobe-fonts/source-sans/releases/tag/3.052R,
  https://github.com/adobe-fonts/source-serif/releases/tag/4.005R.
- cmap: SourceSans3-Regular, -Semibold and -Bold.otf (3.052) and SourceSerif4-Regular, -Semibold,
  -Bold.otf and SourceSerif4Variable-Roman.ttf (4.005) all map U+1EB8, U+1EB9, U+1ECC, U+1ECD,
  U+1E62, U+1E63, U+0300, U+0301, U+0323 and the Latin-1 vowels á à ó í é ú. Glyph names are
  `uni1EB8` and so on, with the marks `uni0300`, `uni0301`, `uni0323` (Sans) or `gravecomb`,
  `acutecomb`, `dotbelowcomb` (Serif). Method: `TTFont(path).getBestCmap()`.
- GPOS features: Sans `kern, mark, mkmk, size`; Serif `kern, mark, mkmk, size` (the variable TTF
  has `kern, mark, mkmk`). Method:
  `[r.FeatureTag for r in f['GPOS'].table.FeatureList.FeatureRecord]`.
- How the marks land: the precomposed underdot letters are in no mark-to-base coverage. Instead
  GSUB `ccmp` (contextual lookups calling a multiple substitution) decomposes `uni1EB9` to `e` +
  `uni0323`, `uni1ECD` to `o` + `uni0323`, `uni1EB8` to `E` + `uni0323`, `uni1ECC` to `O` +
  `uni0323`, `uni1E62` and `uni1E63` to `S` or `s` + `uni0323`, and GPOS mark-to-base then attaches
  the dot and the tone mark to the plain letter. Method: walk of the GSUB LookupList (types 2 and
  6) and of every GPOS MarkBasePos BaseCoverage.
- Shaping proof (uharfbuzz, 1000 units per em). SourceSans3-Regular: "ẹ́" (U+1EB9 U+0301) gives
  `e` advance 496, `uni0323` x offset -232, `uni0301` x offset -232, both centred on the base;
  "Ẹ́" gives `E`, dot at -227, acute at -237 with y offset +169 (raised over the capital); "ọ̀"
  gives `o`, dot -271, grave -271. Semibold: e 507, marks -241; Bold: e 518, marks -250.
  SourceSerif4-Semibold: e 515, dot -239, acute -238; capitals switch to `uni0301.cap` at -268.
  Bold and the variable Roman at wght 700 agree (e 521, dot -238, acute -242). A fully decomposed
  "e" + U+0323 + U+0301 shapes identically.
- The Google-subsetted woff2 files in fontsource shape identically to the Adobe binaries:
  `source-sans-3-vietnamese-wght-normal.woff2` at wght 700 gives e 518, dot -250, acute -250 and
  Ẹ́ acute -258 y +156, the same as SourceSans3-Bold.otf; the static 400, 600 and 700 files match
  Regular, Semibold and Bold; `source-serif-4-vietnamese-700-normal.woff2` gives e (renamed
  `glyph00010`) 547, dot -247, acute -252. The subsetter kept the un-cmapped base glyphs `e`, `o`,
  `E`, `O` through layout closure (176 glyphs for 115 cmap entries in the Sans vietnamese file),
  so `ccmp` and the anchors survive subsetting. Every subset woff2 checked (variable wght and
  opsz, static 400, 600 and 700; latin, latin-ext, vietnamese) carries GPOS `kern, mark, mkmk`.
- Build versions inside the woff2 name tables: Sans "Version 3.052" (Adobe's latest); Serif
  "Version 4.004" while Adobe's latest is 4.005. The 4.005 notes list only the hinting update and
  the minor fixes above, none touching underdot letters. Source: name ID 5 of the files and the
  4.005R release page.
- mkmk detail: Sans registers U+0300 and U+0301 as attaching marks but not U+0323 as a carrier, so
  a mark cannot stack on the dot below; Serif has the full chain. Not needed for the test string,
  where both marks attach to the base letter.

## Google Fonts CSS API subsets

- Request:
  https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap
  read in the browser pane (User-Agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
  AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.46388.4 Chrome/148.0.7778.280 Safari/537.36").
  `curl` was denied in this session; a non-browser fetch of the same URL returned one
  `format('truetype')` block per weight with no `unicode-range` at all, so the User-Agent decides
  what the API serves.
- Response: per weight, Source Sans 3 has seven blocks (cyrillic-ext, cyrillic, greek-ext, greek,
  vietnamese, latin-ext, latin) and Source Serif 4 six (no greek-ext), each
  `font-family: 'Source Sans 3'` or `'Source Serif 4'`, `font-style: normal`,
  `font-weight: 400`, `600` or `700`, `font-display: swap`,
  `src: url(https://fonts.gstatic.com/s/sourcesans3/v19/...woff2) format('woff2')` (Serif under
  `/s/sourceserif4/v14/`). The file URL for a subset is the same at every requested weight (Sans
  vietnamese: `nwpStKy2OAdR1K-IwhWudF-R3wAaZejf5HdF8Q.woff2` at 400, 600 and 700), so the API
  serves one variable file per subset and repeats it per weight. No `opsz` descriptor is emitted
  (CSS has none).

Unicode ranges, identical in the Google response and in fontsource's `unicode.json`:

| Subset | unicode-range | Test string code points it holds |
| --- | --- | --- |
| cyrillic-ext | U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F | none |
| cyrillic | U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116 | U+0301 (shared with vietnamese, which wins, see below) |
| greek-ext (Sans only) | U+1F00-1FFF | none |
| greek | U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF | none |
| vietnamese | U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB | Ẹ U+1EB8, ẹ U+1EB9, Ọ U+1ECC, ọ U+1ECD, U+0300, U+0301, U+0323 |
| latin-ext | U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF | Ṣ U+1E62, ṣ U+1E63 |
| latin | U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD | ASCII, À U+00C0, Ì U+00CC, à U+00E0, á U+00E1, é U+00E9, í U+00ED, ó U+00F3, ú U+00FA |

Per code point: U+1EB8, U+1EB9, U+1ECC, U+1ECD sit in vietnamese only (U+1EA0-1EF9); U+1E62 and
U+1E63 in latin-ext only (U+1E00-1E9F); U+0300 in vietnamese only; U+0301 in vietnamese and
cyrillic; U+0323 in vietnamese only; U+00E1 (á) and U+00F3 (ó) in latin only. U+0304, U+0308 and
U+0329 are listed in latin, latin-ext and vietnamese alike. The expectation in the ticket holds.

- The test string is already NFC: `unicodedata.normalize('NFC', s) == s` (72 code points; NFD
  would be 95). Its three combining clusters are U+1ECD U+0300, U+1EB9 U+0301 and U+1EB9 U+0300,
  each entirely inside the vietnamese range; every other accented letter is precomposed Latin-1.
- Overlap rule: "If the unicode ranges overlap for a set of @font-face rules with the same family
  and style descriptor values, the rules are ordered in the reverse order they were defined; the
  last rule defined is the first to be checked for a given character." Initial value
  `U+0-10FFFF`. Source: https://drafts.csswg.org/css-fonts-4/#unicode-range-desc. Google and
  fontsource both emit vietnamese after cyrillic, so vietnamese is checked first for U+0301.
- Cluster rule: "When text contains characters such as combining marks, ideally the base
  character should be rendered using the same font as the mark, this assures proper placement of
  the mark." and "Fonts may only support precomposed forms and not the decomposed sequence of base
  character plus combining marks. Authors should always tailor their choice of fonts to their
  content, including whether that content contains normalized or denormalized character
  streams." Source: https://drafts.csswg.org/css-fonts-4/#cluster-matching.
- Browser experiments (Chromium 148, the Google CSS injected as a `<style>` on its own document,
  `document.fonts` statuses read after `document.fonts.ready` plus three seconds):
  1. The full test string in Source Sans 3 400 and Source Serif 4 600: `loaded` = vietnamese,
     latin-ext and latin for both families; cyrillic, cyrillic-ext, greek, greek-ext and every
     unused weight stayed `unloaded`.
  2. Only "ẹ́ ọ̀" in Sans 400: vietnamese (and latin, for the space) loaded, cyrillic stayed
     `unloaded`, so U+0301 came from the vietnamese face, the same file as ẹ, and the anchors
     above apply.
  3. Decomposed "e" + U+0301 in Sans 400: latin (for e) and vietnamese (for U+0301) both loaded:
     base and mark come from two different font files, and OpenType positioning cannot act across
     files. Keep content NFC so that é stays U+00E9 (latin) and ẹ́ stays U+1EB9 U+0301
     (vietnamese). The rendered position of a split cluster was not measured (Unverified).

## fontsource packages, 5.3.0

Registry check with `npm view <pkg> version time license` on 5 September 2026.

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `@fontsource-variable/source-serif-4` | 5.3.0 | 5.3.0 (2026-07-19) | Latest; Google Fonts build v14 (font version 4.004), wght and opsz axes, six subsets. |
| `@fontsource-variable/source-sans-3` | 5.3.0 | 5.3.0 (2026-07-19) | Latest; Google Fonts build v19 (font version 3.052), wght axis, seven subsets. |
| `@fontsource/source-serif-4` | 5.3.0 | 5.3.0 (2026-07-19) | Static per-weight alternative, same v14 build; only if static files are chosen. |
| `@fontsource/source-sans-3` | 5.3.0 | 5.3.0 (2026-07-19) | Static per-weight alternative, same v19 build; only if static files are chosen. |
| `@fontsource/noto-serif`, `@fontsource/noto-sans` | not pinned | 5.3.0 (2026-07-19) | Only if the session decides to ship Noto files (see the Noto section). |
| `@fontsource-variable/noto-serif`, `@fontsource-variable/noto-sans` | not pinned | 5.3.0 (2026-07-19) | Same, variable (wght, wdth). |

Common to the four Source packages (from `package.json` and the package files):

- `license: "OFL-1.1"`, `author: "Google Inc."`, `repository` fontsource/font-files
  (`directory: fonts/variable/source-serif-4`, `fonts/google/source-sans-3` and so on),
  `homepage` https://fontsource.org/fonts/source-serif-4 and https://fontsource.org/fonts/source-sans-3.
- `LICENSE` at the package root (4,314 bytes: "This Font Software is licensed under the SIL Open
  Font License, Version 1.1", copyright holder line "Google Inc."), also exported as `./LICENSE`.
- `exports`: `"."` (types `./index.d.css.ts`, sass and default `./index.css`), `"./LICENSE"`,
  `"./*"` and `"./*.css"` (any CSS file), `"./files/*"`, `"./files/*.woff"`, `"./files/*.woff2"`,
  `"./package.json"`, `"./metadata.json"`, `"./unicode.json"`, `"./scss"`. `main: index.css`,
  `types: index.d.css.ts`. There is no `style` field.
- `metadata.json`: Serif `version: "v14"`, `lastModified: "2025-09-11"`, subsets cyrillic,
  cyrillic-ext, greek, latin, latin-ext, vietnamese, weights 200 to 900, styles italic and normal,
  variable axes ital 0 to 1, opsz 8 to 60 (default 14 there, 20 in the files' fvar), wght 200 to
  900; Sans `version: "v19"`, `lastModified: "2025-09-05"`, the same subsets plus greek-ext, axes
  ital and wght. `source: https://github.com/google/fonts`, `type: google`, `defSubset: latin`.
- `unicode.json` holds the ranges of the table above, one key per subset.

Variable packages:

- CSS entry files. `@fontsource-variable/source-serif-4`: `index.css`, `wght.css`,
  `wght-italic.css`, `opsz.css`, `opsz-italic.css`, `standard.css`, `standard-italic.css`.
  `@fontsource-variable/source-sans-3`: `index.css`, `wght.css`, `wght-italic.css`. There is no
  `full.css` in either, and no per-subset file (`latin.css`, `latin-ext.css`, `vietnamese.css` do
  not exist in the variable packages; the fontsource subsets page says the per-subset method "is
  unavailable for variable fonts", https://fontsource.org/docs/getting-started/subsets).
- `index.css` is byte-for-byte `wght.css` (2,313 bytes Serif, 2,582 bytes Sans). Each rule
  reads, for the vietnamese subset of Serif: `font-family: 'Source Serif 4 Variable';
  font-style: normal; font-display: swap; font-weight: 200 900;
  src: url(./files/source-serif-4-vietnamese-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0102-0103,...,U+1EA0-1EF9,U+20AB;` and for Sans
  `font-family: 'Source Sans 3 Variable'` with `./files/source-sans-3-<subset>-wght-normal.woff2`.
  The latin and latin-ext rules differ only in file name and range. `opsz.css` and `standard.css`
  use `-opsz-` and `-standard-` files with the same descriptors (there is no CSS descriptor for
  optical size; browsers apply the axis through `font-optical-sizing: auto`). Rule order in every
  file: cyrillic-ext, cyrillic, greek(-ext), vietnamese, latin-ext, latin.
- The family strings are exactly `'Source Serif 4 Variable'` and `'Source Sans 3 Variable'`
  (also in the package README: `font-family: "Source Sans 3 Variable";`). A `font-family` stack
  must match whatever the loaded `@font-face` rules declare; hand-written rules may use any name.
- `files/` woff2, bytes. Serif (36 files): latin-wght-normal 50,824; latin-ext-wght-normal
  42,040; vietnamese-wght-normal 13,448; latin-opsz-normal 122,360; latin-ext-opsz-normal
  100,872; vietnamese-opsz-normal 29,652; the `-standard-` files have the same sizes as `-opsz-`;
  italics 51,516, 44,260, 13,932 (wght) and 130,188, 110,324, 32,184 (opsz); cyrillic(-ext) and
  greek 18,064 to 93,440. Sans (14 files): latin-wght-normal 28,740; latin-ext-wght-normal
  60,088; vietnamese-wght-normal 10,324; italics 28,532, 59,496, 10,724; cyrillic(-ext) and
  greek(-ext) 9,784 to 18,496.
- fvar inside the files: Sans wght 200 to 900 with default 200 (the name table reads "Source
  Sans 3 ExtraLight"); Serif wght default 400; the opsz files carry wght plus opsz 8 to 60 with
  default 20. CSS `font-weight` drives the axis, so the defaults do not show.
- Fontsource variable docs: "Each import includes the wght axis as multiple imports of different
  axes are not supported." Source: https://fontsource.org/docs/getting-started/variable.

Static packages (`@fontsource/source-serif-4`, `@fontsource/source-sans-3`):

- CSS entry files: `<weight>.css` and `<weight>-italic.css` for 200, 300, 400, 500, 600, 700, 800
  and 900 (all subsets, with `unicode-range`); `<subset>-<weight>.css` and
  `<subset>-<weight>-italic.css` (one face, no `unicode-range`); `<subset>.css` and
  `<subset>-italic.css` (all eight weights of one subset, no `unicode-range`); `index.css` is
  weight 400 normal for all subsets. Family strings `'Source Serif 4'` and `'Source Sans 3'`;
  `src: url(...woff2) format('woff2'), url(...woff) format('woff')`; `font-display: swap`.
- The per-subset files really have no `unicode-range` (grep over `latin-*.css` and
  `vietnamese-*.css`: 0 matches), so loading `latin-400.css` plus `vietnamese-400.css` gives two
  faces with the default range `U+0-10FFFF`; per the overlap rule the browser checks the later one
  first and must download it to learn whether the glyph exists. Fontsource: "We do not recommend
  using this method unless you have a specific reason to do so"; "The default CSS utilises the
  unicode-range property to only load the characters that are used on the page". Source:
  https://fontsource.org/docs/getting-started/subsets.
- `files/`: Serif 192 files, 3.0 MB; Sans 224 files, 3.3 MB. Needed woff2, bytes: Sans latin
  400/600/700 15,696 / 15,668 / 15,596; latin-ext 33,024 / 32,704 / 32,956; vietnamese 6,216 /
  6,220 / 6,136. Serif latin 600/700 21,532 / 21,716; latin-ext 18,376 / 18,496; vietnamese
  6,444 / 6,472 (400: 20,088 / 17,828 / 6,236).
- Install docs: `import "@fontsource/open-sans"` "will import the most common weight, which is
  400 for most fonts"; other weights are separate imports such as `300.css`. Source:
  https://fontsource.org/docs/getting-started/install.

Byte totals for latin + latin-ext + vietnamese, normal style, from the file sizes above:

| Set | Bytes |
| --- | --- |
| Source Sans 3 variable wght (all weights) | 99,152 |
| Source Serif 4 variable wght (all weights) | 106,312 |
| Source Serif 4 variable opsz (wght plus opsz) | 252,884 (the wght-only set is 58 percent smaller) |
| Source Sans 3 static 400 + 600 + 700 | 164,216 |
| Source Serif 4 static 600 + 700 | 93,036 |
| Both families, variable wght | 205,464 |
| Both families, static (Sans 400/600/700, Serif 600/700) | 257,252 |

## Noto fallbacks

- `@fontsource/noto-serif` 5.3.0: subsets cyrillic, cyrillic-ext, greek, greek-ext, latin,
  latin-ext, math, vietnamese; weights 100 to 900; Google build v33 (2025-09-06); 288 files,
  7.6 MB. latin + latin-ext + vietnamese woff2: 400 79,876 B, 600 88,168 B, 700 86,548 B.
- `@fontsource/noto-sans` 5.3.0: subsets cyrillic, cyrillic-ext, devanagari, greek, greek-ext,
  latin, latin-ext, vietnamese; v42 (2025-09-11); 288 files, 7.5 MB. Trio: 400 74,076 B,
  600 79,532 B, 700 78,308 B.
- Variable: `@fontsource-variable/noto-serif` (axes wght and wdth; CSS `wght`, `wdth`,
  `standard`; 48 files, 4.7 MB): latin-wght 36,756, latin-ext-wght 186,552, vietnamese-wght
  14,704. `@fontsource-variable/noto-sans`: 35,820, 167,960, 14,456.
- Noto's vietnamese and latin-ext woff2 (font version 2.015) map the same nine code points and
  carry GPOS `mark, mkmk` (Sans also `dist`); their `unicode-range` values equal the Source ones.
  License OFL-1.1, "Copyright 2022 The Noto Project Authors
  (https://github.com/notofonts/latin-greek-cyrillic)".
- Where Noto exists locally. Google's Noto page says "Noto includes fonts for nearly all of the
  world's writing systems" and "All Noto fonts are licensed under the Open Font License"; it does
  not name Android or ChromeOS, so "ships with Android and ChromeOS" is Unverified from Google's
  page (https://fonts.google.com/noto). Android's system font table does list it:
  `<family name="serif">` has `NotoSerif-Regular.ttf`, `NotoSerif-Bold.ttf`,
  `NotoSerif-Italic.ttf`, `NotoSerif-BoldItalic.ttf`; `<family name="sans-serif">` is Roboto;
  there is no Latin "Noto Sans" family (only script families such as NotoSansArmenian); the
  aliases `georgia`, `times`, `palatino` and `baskerville` point at serif. Source:
  https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/data/fonts/fonts.xml.
  Whether Chrome for Android matches the CSS name "Noto Serif" (fonts.xml names the family
  "serif") is Unverified; the generic `serif` does reach it. ChromeOS: Unverified.
- This Mac (macOS 27.0): no Noto Sans or Noto Serif Latin faces, only script-specific Noto files.
  Georgia (Version 5.00x-4) maps all nine code points but has no GPOS table at all; the system
  font SF (22.0d3e2) and New York map all nine with GPOS but without `mark` or `mkmk`; Helvetica
  has the glyphs with AAT `morx` only; Times New Roman and Arial have the glyphs plus GPOS `mark,
  mkmk`. Method: fontTools over /System/Library/Fonts and its Supplemental folder. So on macOS
  the stack falls from Source straight to Georgia or system-ui: no tofu, but a tone mark on an
  underdot vowel gets no anchor in Georgia (rendering Unverified). Windows: Unverified.
- Trade-off, facts only. Naming Noto in the stack costs no bytes and helps where Noto is installed
  (Android serif; not macOS; Windows unverified). Shipping Noto through `@font-face` adds about
  75 to 88 KB per weight per family of candidate downloads and needs its own `unicode-range`
  rules; whether a browser fetches a later web-font family while the first is still loading under
  `font-display: swap` is not stated on the MDN or spec pages read here (Unverified).

## Astro 7 Fonts API

- Stable: the v6 upgrade guide lists `fonts` among the experimental flags that became stable, the
  v7 guide has no fonts changes, and the config reference shows a top-level `fonts` (Type
  `Array<FontFamily>`, Default `[]`) with no experimental badge. Sources:
  https://docs.astro.build/en/guides/upgrade-to/v6/, https://docs.astro.build/en/guides/upgrade-to/v7/,
  https://docs.astro.build/en/reference/configuration-reference/#fonts.
  https://docs.astro.build/en/reference/experimental-flags/fonts/ returned the fonts guide.
- Config shape (config reference): `font.provider: FontProvider`; `font.name: string`;
  `font.cssVariable: string` ("starting with --"); `font.fallbacks: Array<string>`, default
  `["sans-serif"]`; `font.optimizedFallbacks: boolean`, default `true`; `font.weights`, default
  `[400]`, variable range as `["100 900"]`; `font.styles`, default `["normal", "italic"]`;
  `font.subsets: Array<string>`, default `["latin"]`, "Defines a list of font subsets to
  preload."; `font.formats`, default `["woff2"]`; `font.options` (provider specific);
  `font.display`, default `"swap"`; `font.unicodeRange: Array<string>`; `font.stretch`;
  `font.featureSettings`; `font.variationSettings`. Example:
  `fonts: [{ provider: fontProviders.google(), name: "Roboto", cssVariable: "--font-roboto" }]`.
- Local provider (guide): `provider: fontProviders.local()`, `options: { variants: [{ src:
  ['./src/assets/fonts/DistantGalaxy.woff2'], weight: 'normal', style: 'normal' }] }`; variable
  as `weight: "100 900"`; weight and style are inferred from the first source when omitted. In
  astro 7.3.1 `dist/assets/fonts/providers/local.d.ts`, `Variant extends FamilyProperties` with
  `src: [RawSource, ...]` where a source is "a path relative to the root, a package import, or a
  URL" or `{ url, tech }`, and `FamilyProperties` is `display`, `stretch`, `featureSettings`,
  `variationSettings`, `unicodeRange` (`dist/assets/fonts/types.d.ts`), so a local variant can
  carry its own `unicodeRange` and `display`. Source: the installed astro 7.3.1 package.
- Providers: "Adobe, Bunny, Fontshare, Fontsource, Google, Google Icons and NPM, as well as for
  using your own local font files" (guide). `subsets` is a family option for every provider; the
  guide's examples use `subsets: ["latin", "cyrillic"]` and `["latin", "latin-ext"]` with the
  comment "Download only font files for characters used on the page". Is `vietnamese` valid:
  Astro's schema is `subsets: z.tuple([z.string()], z.string())` (any non-empty list of strings,
  `dist/assets/fonts/config.js`); astro 7.3.1 depends on `unifont ~0.7.5` (0.7.5 installed);
  unifont's fontsource provider keeps
  `options.subsets.filter(subset => font.subsets.includes(subset))` against the fontsource API,
  which lists vietnamese for both families, and reads
  `unicodeRange: fontDetail.unicodeRange[subset]`;
  its google provider keeps CSS groups where `options.subsets.includes(group.subset)`, the group
  name coming from the `/* vietnamese */` comment, fetching with a Chrome 121 User-Agent. So
  `vietnamese` works for both providers. Sources:
  https://github.com/unjs/unifont/blob/main/src/providers/fontsource.ts and
  https://github.com/unjs/unifont/blob/main/src/providers/google.ts.
- Fallbacks (guide): "Fallback fonts are used when the primary font has not yet loaded, contains
  missing characters, or cannot be loaded for any reason." "Astro automatically tries to generate
  optimized fallback fonts from the last defined fallback if it is a generic font family. It uses
  sans-serif by default"; "You can also opt out of the default optimization by setting
  font.optimizedFallbacks to false". Config reference: "Specify at least a generic family name
  matching the intended appearance of your font."
- `<Font />`: `import { Font } from "astro:assets"`; "The `<Font />` component outputs style tags
  and can optionally output preload links for a given font family"; props `cssVariable`
  (required) and `preload`, type `boolean | { weight?: string | number; style?: string; subset?:
  string }[]`, default `false`; "Added in: astro@6.0.0"; placed in the page `<head>`. Source:
  https://docs.astro.build/en/reference/modules/astro-assets/#font-. In 7.3.1
  `components/Font.astro` emits
  `<link rel="preload" href={url} as="font" type="font/..." crossorigin />` for the files kept by
  `filterPreloads(data.preloads, preload)`.
- Virtual module: the module reference calls `astro:assets` a virtual module; in 7.3.1
  `dist/assets/consts.js` has `VIRTUAL_MODULE_ID = "astro:assets"`, resolved by the `astro:assets`
  Vite plugin (`resolveId` in `dist/assets/vite-plugin-assets.js`), whose generated module has
  `export { default as Font } from "astro/components/Font.astro"` and
  `export * from "virtual:astro:assets/fonts/runtime"`; the fetching runs in the `astro:fonts`
  Vite plugin (`dist/assets/fonts/vite-plugin-fonts.js`, `buildStart`, from
  `settings.config.fonts`). Outside Astro's Vite pipeline (Storybook's own Vite) neither id
  resolves, which is why the brief says Storybook stubs the module and the tokens package ships a
  plain `fonts.css`. The handoff's name `astro:fonts` is the Vite plugin's name; the import is
  `astro:assets`.
- Privacy and caching (guide): "The Fonts API focuses on performance and privacy by downloading
  and caching fonts so they're served from your site. This can avoid sending user data to
  third-party sites"; "During builds, font files are copied to the _astro/fonts output directory,
  so they can benefit from HTTP caching of static assets (usually a year)."

## font-display, preload and unicode-range together

- MDN unicode-range: "If the page doesn't use any character in this range, the font is not
  downloaded; if it uses at least one, the whole font is downloaded." Initial value
  `U+0-10FFFF`; Baseline widely available since July 2015. Source:
  https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range.
- CSS Fonts 4 loading step: "If the font resource has not been loaded and the range of characters
  defined by the unicode-range descriptor value includes the character in question, load the
  font." and, for composite faces, the reverse-order rule quoted above. Source:
  https://drafts.csswg.org/css-fonts-4/#font-matching-algorithm.
- MDN font-display: `swap` "Gives the font face an extremely small block period and an infinite
  swap period." `font-display` is a descriptor of each `@font-face` rule, so every subset face has
  its own timeline; Baseline since January 2020. Source:
  https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display.
- Preload: "Font preloading should be done sparingly, as it can block the loading of other
  important resources or download fonts that are unnecessary for the current page. Consider
  preloading only the most essential fonts, necessary for displaying content visible above the
  fold." (Astro guide); the `preload` prop can name a `subset`. Fontsource: "Only preload
  critical fonts and subsets that are essential for the initial page display, such as the latin
  subset only." (https://fontsource.org/docs/getting-started/preload). A preload link fetches
  without regard to `unicode-range`, so a preloaded subset file the page never uses is a wasted
  download; no primary page read here states that interaction in one sentence (Unverified as a
  quote).
- Neither MDN nor the Astro docs describe any further coupling between `font-display: swap` and
  `unicode-range`: each subset face swaps independently when its own file arrives.
- `format("woff2-variations")` (used by fontsource and by `packages/tokens/src/fonts.css`) is a
  legacy string that MDN maps to `format(woff2) tech(variations)`. Source:
  https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src.
- Vite: "Vite is pre-configured to support CSS @import inlining via postcss-import. Vite aliases
  are also respected for CSS @import. In addition, all CSS url() references, even if the imported
  files are in different directories, are always automatically rebased to ensure correctness."
  (https://vite.dev/guide/features). Verified locally with Vite 8.2.2: a `fonts.css` with
  `src: url("@fontsource-variable/source-sans-3/files/source-sans-3-vietnamese-wght-normal.woff2")`
  built to `dist/assets/source-sans-3-vietnamese-wght-normal-C1uRvKPU.woff2` with the url
  rewritten; the minifier shortened the range to `U+102-103,U+1EA0-1EF9`.

## Answer for wayfinder ticket 19

- Subsets: latin, latin-ext and vietnamese, for both families and every weight used. Verified
  three ways: the cmap of those three woff2 files covers every code point of the test string;
  the Chromium experiment loaded exactly those three faces and nothing else; the shaping of the
  vietnamese files places the tone marks on ẹ, ọ, Ẹ, Ọ exactly as Adobe's full fonts do at 400,
  600 and 700. Cyrillic, cyrillic-ext, greek and greek-ext are never needed by this content.
- Content rule that follows: store and render Yoruba text in NFC. The test string is NFC as
  given. A decomposed base plus mark (for example e + U+0301) splits across the latin and
  vietnamese files and loses the anchors (experiment 3).
- Local files versus a provider, facts: Google's CSS API serves the same v19 and v14 builds, but
  needs `fonts.googleapis.com` and `fonts.gstatic.com` in the CSP (docs/runbook.md and phase 1
  ticket 03 want no font origin), varies by User-Agent, sends a request per visitor to Google
  (the Astro guide's privacy sentence) and is unavailable to Storybook offline. The fontsource
  files are the same Google builds under OFL-1.1, three woff2 per family per style, served from
  the site's origin and cacheable for a year; Astro's Fonts API can later consume the same files
  through `fontProviders.fontsource()` with `subsets: ["latin", "latin-ext", "vietnamese"]` or
  through `fontProviders.local()` with per-variant `unicodeRange`, while Storybook keeps the
  plain `fonts.css` because `astro:assets` is a virtual module.
- The `fonts.css` shape: hand-written `@font-face` rules pointing at
  `@fontsource-variable/source-sans-3/files/source-sans-3-{latin,latin-ext,vietnamese}-wght-normal.woff2`
  and `@fontsource-variable/source-serif-4/files/source-serif-4-{latin,latin-ext,vietnamese}-{wght|opsz}-normal.woff2`,
  `font-weight: 200 900`, `font-display: swap`, the three `unicode-range` values from
  `unicode.json`; the order of the three does not matter for the test string, and vietnamese must
  stay after cyrillic if cyrillic is ever added. Importing fontsource's own `wght.css` would also
  work but declares the family as `'Source Sans 3 Variable'` and `'Source Serif 4 Variable'` and
  adds four faces that never download. Do not import the static per-subset files: no
  `unicode-range`.
- Sizes to budget: variable wght 205,464 B for both families (all weights); static 257,252 B for
  Sans 400/600/700 and Serif 600/700; the Serif opsz files raise the Serif share from 106,312 to
  252,884 B.

## Open questions for the session

- Serif optical size: the opsz files cost 252,884 B against 106,312 B for wght only; headings run
  20 to 64 px and the axis default is 20. Is optical sizing wanted (the handoff's Google Fonts
  request asked for `opsz,wght@8..60`)?
- Italics: `packages/tokens/src/fonts.css` currently declares italic faces (six more files); the
  brief lists no italic use.
- Family name strings: `'Source Serif 4'` and `'Source Sans 3'` (current `fonts.css`) versus
  fontsource's `'... Variable'`; pick one and keep the stacks and any later Astro `name` aligned.
- Noto: names only, or shipped files with their own `unicode-range` rules; Android reaches Noto
  Serif through `serif` and has no Latin Noto Sans; macOS has neither; Windows unverified.
- Whether Chrome for Android matches the family name "Noto Serif" (Unverified).
- Preload policy: the hero carries vietnamese-range letters, so a latin-only preload leaves the
  underdot vowels to swap in later; decide per family which of the three files to preload, if any.
- NFC enforcement: where to normalise (Sanity input, the loader, or the `packages/lint` Yoruba
  check).
- Whether Astro's local provider merges several entries of the same family with different
  `unicodeRange` values the way the guide's "Granular font configuration" merges weights and
  styles (Unverified).
