# Phase 5: the Yoruba letters cut from latin-ext, verified

Date: 12 September 2026. Method: read wayfinder ticket 33, ADR 0026, Phase 5 ticket 01,
`packages/tokens/src/fonts.css`, `docs/research/fonts-source-serif-sans-subsets.md` (the Phase 1
note, cited below as "the Phase 1 note") and this session's scratch cutting script. Then the primary
sources: PyPI through `pip index versions` and the JSON API; fontTools `NEWS.rst` on `main`; the
fontTools subset documentation on readthedocs and the module source in two scratch venvs (fontTools
4.60.1 and 4.65.0, both on Python 3.14.2 with brotli 1.2.0 and zopfli 0.4.3); the woff2 files and
LICENSE files of `@fontsource-variable/source-sans-3` and `@fontsource-variable/source-serif-4`
5.3.0 in `packages/tokens/node_modules`; Adobe's `LICENSE.md` on the `release` branches; Google
Fonts' `OFL.txt` and `METADATA.pb` on `main`; openfontlicense.org (the OFL 1.1 text, OFL-FAQ
1.1-update7 of November 2023, and the "Webfonts and Reserved Font Names" and "Managing Reserved Font
Names" pages, both last updated 12 January 2026); CSS Fonts 4 (W3C Working Draft of 7 September
2026 and Editor's Draft of 11 September 2026); CSP Level 3 (Editor's Draft of 13 August 2026); the
installed Vite 8.2.2. The fonts were compared with fontTools (glyf, hmtx, gvar,
`varLib.instancer`, variable glyph sets) and a negative control; loading was tested in Chrome
152.0.7977.76 (this app's browser pane) and read from this session's Lighthouse reports for ticket
33; coverage was computed by script. Every scratch script and file lives in the session scratchpad;
nothing in the repo changed except this note.

## 1. fontTools: release, options, tables kept, the woff extra

- Current release. `pip index versions fonttools` (pip 25.3) reports `LATEST: 4.65.0` against
  `INSTALLED: 4.60.1`. The PyPI JSON API (https://pypi.org/pypi/fonttools/json) gives
  `info.version` 4.65.0, uploaded 2026-09-10, `requires_python` `>=3.10`; 4.60.1 was uploaded
  2025-09-29. Eight releases followed it: 4.61.0 (2025-11-28), 4.60.2 (2025-12-09, a backport),
  4.61.1 (2025-12-12), 4.62.0 (2026-03-09), 4.62.1 (2026-03-13), 4.63.0 (2026-05-14), 4.64.0
  (2026-08-31), 4.65.0 (2026-09-10). 4.60.1 is not current.
- What changed for subsetting, per `NEWS.rst` (https://github.com/fonttools/fonttools/blob/main/NEWS.rst):
  4.63.0 fixes a `recalcUnicodeRanges` crash in the subsetter for reserved OS/2 bits 123 to 127;
  4.64.0 keeps `palt` by default and fixes MATH and VARC pruning. The security fixes (CVE-2025-66034
  in the `varLib` command in 4.61.0, `eval` in TTX CFF parsing in 4.62.0, UFO paths, EBDT export and
  XXE in 4.64.0) sit in code the subsetter does not run. A diff of
  `fontTools/subset/__init__.py` between the two installs shows only formatting, the MATH and VARC
  fixes and the `palt` default.
- Output does not depend on the version: the four wght cuts are byte-identical from 4.60.1 and
  4.65.0, and across two runs of each (sha256 `48f53d27...`, `a1485bbd...`, `ef7a83d3...`,
  `475ab89e...` for Sans normal, Sans italic, Serif normal, Serif italic, 2,668, 2,772, 3,648 and
  3,932 bytes). They also equal the files the session's scratch script cut.
- Documentation. The options are documented in the module docstring
  (`fontvenv/lib/python3.14/site-packages/fontTools/subset/__init__.py`, lines 32 to 453 in 4.60.1,
  identical in 4.65.0); https://fonttools.readthedocs.io/en/latest/subset/index.html renders the
  same text (checked option by option; the page states no version). For the options used:
  - `--unicodes`: comma or whitespace separated hex code points or ranges, `U+` prefix optional
    (lines 92 to 98).
  - `--layout-features='*'`: keeps every feature; the default set is `calt`, `ccmp`, `clig`,
    `curs`, `dnom`, `frac`, `kern`, `liga`, `locl`, `mark`, `mkmk`, `numr`, `rclt`, `rlig`,
    `rvrn` plus script shaping features, and glyphs the kept features produce are added (lines 209
    to 232).
  - `--flavor=woff2`: needs the Brotli Python extension (lines 148 to 151).
  - `--name-IDs='*'`: the default keeps name IDs 0 to 6 only; `*` keeps all (lines 338 to 350).
    Here that keeps ID 14 (the OFL URL) and the axis and instance names from 256 up.
  - `--name-languages='*'`: the default keeps only langID 0x0409; `*` keeps all (lines 360 to 363).
    These files carry only 0x0409 records, so it changes nothing.
  - `--notdef-outline`: keeps the `.notdef` outline, which the docs say is not needed unless
    unsupported glyphs are shown; the default drops it (lines 186 to 193). Measured cost: 168, 148,
    72 and 144 bytes on the four files. A face whose `unicode-range` holds only mapped code points
    never shows `.notdef` (CSS Fonts 4 section 4.5: the effective character map is the range
    intersected with the cmap), so the option is harmless and optional.
  - Defaults that shape the result: glyph names dropped (`post` 3.0), hinting kept, bounds and the
    `head.modified` timestamp not recalculated, OS/2 Unicode and code page bits pruned, the legacy
    `kern` table dropped when GPOS exists (lines 240 to 425; `Options.__init__`, lines 3403 to
    3451).
- Variation tables are kept by default. `Options._no_subset_tables_default` (lines 3323 to 3344)
  lists `avar`, `BASE`, `fvar`, `gasp`, `head`, `hhea`, `maxp`, `vhea`, `OS/2`, `loca`, `name`,
  `cvt`, `fpgm`, `prep`, `VDMX`, `DSIG`, `CPAL`, `MVAR`, `cvar` and `STAT`: kept untouched. `gvar`,
  `HVAR` and `VVAR` have `subset_glyphs` methods (lines 2446 to 2549) and are cut down to the kept
  glyphs, not dropped. `_drop_tables_default` (lines 3313 to 3322) is `JSTF`, `DSIG`, `EBDT`,
  `EBLC`, `EBSC`, `PCLT`, `LTSH` and the Graphite tables; any other table the tool cannot subset is
  dropped unless `--passthrough-tables` is given (`_subset_glyphs`, lines 3771 to 3793). The
  docstring's list (lines 293 to 301) omits `avar`, `fvar` and `BASE` and spells `VDMX` as `VMDX`;
  the code decides. Verified on the outputs: all four cuts keep `fvar`, `avar`, `gvar`, `HVAR`,
  `STAT`, `gasp`, `prep` and `BASE`, and the Sans cuts keep `MVAR`, with the same `fvar` axes and
  `avar` maps as their sources.
- The `[woff]` extra. `fonttools-4.60.1.dist-info/METADATA` in the venv declares `Provides-Extra:
  woff` with `brotli>=1.0.1` on CPython, `brotlicffi>=0.8.0` on other interpreters and
  `zopfli>=0.1.4`. Brotli is what `--flavor=woff2` needs; zopfli only serves `--with-zopfli` for
  WOFF 1.0 (docstring lines 153 to 157).

## 2. The cuts draw the eight letters exactly as the latin-ext files

- The glyphs. In all four fontsource latin-ext files, U+0143, U+0144, U+01F8, U+01F9, U+1E3E,
  U+1E3F, U+1E62 and U+1E63 map to TrueType composite glyphs: the base letter (component flags
  0x204, round to grid and use my metrics) plus one mark placed by an x offset. Sans normal: Ń is N
  plus `uni0301.c` at x 330, ń is n plus `uni0301` at 280, Ḿ is M plus `uni0301.c` at 350, ḿ is m
  plus `uni0301` at 410, Ṣ is S plus `uni0323` at 268, ṣ is s plus `uni0323` at 210 (in Sans italic
  at 172, 8). The dot below is itself a composite of the dot above (`uni0307` in Sans), so each cut
  holds 21 glyphs: `.notdef`, the eight composites, M N S m n s and six marks. Subsetter log: the
  GSUB closure added nothing (9 glyphs before and after), the glyf closure added the 12 components.
- Method. For each code point, source against cut, recursively through every nested component and
  ignoring glyph names (the cut drops them): component offsets, flags and transforms; contours,
  coordinates, on-curve flags and instructions; hmtx advance and side bearing; the raw gvar tuple
  variations (axis regions and deltas). Then `fontTools.varLib.instancer.instantiateVariableFont` at
  wght 200, 400, 600, 700 and 900, comparing the static glyphs, their decomposed outlines and
  advances; full instancing sets advances from the gvar phantom points and drops HVAR
  (`varLib/instancer/__init__.py` lines 943 to 952 and 1125 to 1131 in 4.65.0). Then
  `TTFont.getGlyphSet(location={"wght": w})` for w from 200 to 900 in steps of 50, comparing
  decomposed outlines (gvar applied) and widths (HVAR applied, `ttLib/ttGlyphSet.py` lines 170 to
  181).
- Result: identical for all eight code points in all four pairs (160 instancer comparisons, 480
  glyph set comparisons). Example widths at wght 400, 600 and 700: Sans normal ṣ 419.14, 431.2,
  442.85 and Ń 646.72, 656.0, 664.96; Serif normal ṣ 465.0, 475.23, 486.95 and Ń 768.0, 757.77,
  746.05, the same in source and cut.
- Negative control, so the comparison can fail: three cuts compared with the source of the other
  style failed all 208 of 208 checks each; a copy of the Serif italic cut with one delta of the ṣ
  base glyph moved by one unit failed 7, in the raw gvar, at the instancer's wght 200 and in the
  glyph set from 200 to 350.
- Font-wide fields unchanged between source and cut: `head` units per em, bounding box, flags,
  mac style, revision and `modified`; `hhea` ascent, descent and line gap; OS/2 typo and win
  metrics, `fsSelection`, weight class, x-height, cap height and `xAvgCharWidth`; `post` italic
  angle and underline; `fvar` axes and instances; `avar`; `gasp`; `prep` (the only hinting table;
  no glyph carries instructions); `MVAR` records; `STAT`. Changed: OS/2 `ulUnicodeRange` pruned to
  bits 2, 3 and 29 (Sans) or 2 and 29 (Serif), `ulCodePageRange` to bit 0, first and last char index
  to 323 and 7779, and `post` 2.0 to 3.0 in the Sans files (glyph names).
- Layout tables. Sources: Sans GSUB `ccmp`, `liga`, `locl` and GPOS `kern`, `mark`, `mkmk`; Serif
  GSUB `ccmp`, `locl` and the same GPOS. Cuts: GSUB with its scripts but no feature or lookup, GPOS
  `kern` only (one lookup, pairs among the eight letters). The subsetter prunes GSUB and GPOS against
  the glyph set after the cmap and GSUB closure, before glyf adds the components (`subset_glyphs`
  sets `s.glyphs = s.glyphs_gsubed`, line 1979; closure order, lines 3659 to 3718), and removes
  lookups left empty and then features without lookups (`subset_lookups`, lines 1996 to 2015);
  scripts stay (comment at line 2235).
- What the dropped features did to these letters in the full files (walk of every lookup whose
  first input or base coverage holds one of them):
  - `ccmp` (Sans lookup 3, Serif lookup 5) is a chain context substitution with no backtrack, the
    eight precomposed letters among its inputs, and one combining mark as lookahead (Sans groups
    such as U+0323, U+0329, U+0331 and U+0300, U+0301, U+0304, U+0308). It calls a multiple
    substitution (Sans lookup 2, Serif lookup 0) that splits ṣ into s plus the dot below, ń into n
    plus the acute, and so on for all eight, so that GPOS `mark` can place the dot and a following
    tone mark on the plain letter (the mechanism the Phase 1 note found for ẹ and ọ). It fires only
    when a combining mark follows in the same run.
  - `locl`: no `locl` lookup takes any of the eight letters as input, so it never changed them.
  - `mark` and `mkmk` position combining marks on base glyphs and on other marks (Sans `mark`
    lookup 2 also lists Ń ń Ǹ ǹ as bases). They need a combining mark in the run.
  - `kern` is kept. Kerning against neighbouring letters never applied: those come from the latin
    file, and positioning does not cross font files, before or after this change (Phase 1 note,
    experiment 3).
- So the precomposed letters need no GSUB or GPOS: the composite glyph draws the mark. A combining
  mark is outside the cut's `unicode-range`, so no run in that face can contain one, and `ccmp`,
  `mark` and `mkmk` could never fire there. Decomposed sequences are where they matter: a base plus
  U+0300, U+0301 or U+0323 resolves the mark to the vietnamese file as before (Phase 1 note,
  cluster finding). One refinement from the browser test in section 4: when one of the eight letters
  itself carries a following combining mark (tested with U+0301, U+0304 and U+0329), Chromium also
  fetches the latin-ext file, under either CSS placement, because it retries the whole cluster on the
  next face that covers the letter. Such clusters then follow the path they follow today and only
  lose the saving (their rendering was not compared: Unverified). The word list and seed contain none
  (section 5). ADR 0026 says the subsets "carry no GSUB or GPOS": they carry an empty GSUB and a
  `kern`-only GPOS, which changes nothing above.

## 3. Licence: the fonts reserve the name "Source"

- The fontsource LICENSE files. `@fontsource-variable/source-sans-3/LICENSE` and
  `.../source-serif-4/LICENSE` are identical (4,314 bytes, sha256 `18aabf19...`): a first line
  "Google Inc.", then the OFL 1.1 text, which matches https://openfontlicense.org/documents/OFL.txt
  (compared from the licence title on, line endings and trailing spaces ignored). There is no
  Reserved Font Name line. `package.json` has `"license": "OFL-1.1"`, `"author": "Google Inc."`.
- The fonts themselves. Name ID 0 in all four latin-ext files, carried unchanged into the cuts:
  Sans "© 2023 Adobe (http://www.adobe.com/), with Reserved Font Name ‘Source’"; Serif "© 2014 -
  2021 Adobe Systems Incorporated (http://www.adobe.com/), with Reserved Font Name ‘Source’." There
  is no name ID 13; ID 14 is `http://scripts.sil.org/OFL`. The copyright line in the fontsource
  LICENSE is not the fonts' notice.
- Upstream. Adobe's `LICENSE.md` on the `release` branch of source-sans (copyright 2010-2024) and of
  source-serif (copyright 2014 - 2023) both declare the Reserved Font Name "Source" after the
  copyright line and call Source an Adobe trademark
  (https://github.com/adobe-fonts/source-sans/blob/release/LICENSE.md,
  https://github.com/adobe-fonts/source-serif/blob/release/LICENSE.md). Google Fonts'
  `ofl/sourcesans3/OFL.txt` repeats the declaration; `ofl/sourceserif4/OFL.txt` credits "The Source
  Serif 4 Project Authors" with no RFN, while its `METADATA.pb` copyright field and the font's name
  ID 0 keep it (https://github.com/google/fonts/tree/main/ofl/sourcesans3,
  https://github.com/google/fonts/tree/main/ofl/sourceserif4). The OFL defines a Reserved Font Name
  as a name specified after the copyright statement, so "Source" is reserved for both families.
- OFL 1.1 (https://openfontlicense.org/open-font-license-official-text/): deleting components
  makes a Modified Version (Definitions); every copy must carry the copyright notice and the licence,
  as a text file or as readable metadata (condition 2); a Modified Version may not use a Reserved
  Font Name without written permission, a restriction on "the primary font name as presented to
  the users" (condition 3); the licence stays OFL (condition 5).
- OFL-FAQ 1.1-update7 (https://openfontlicense.org/ofl-faq/):
  - 2.6: removing unused glyphs or smart code from a webfont is modification and normally rules out
    the RFN. 2.7 and 2.8 allow the RFN only for Functional Equivalence: the same full character
    inventory, the same smart behaviour and the original metadata. The cuts hold eight characters
    and lose `ccmp`, `mark` and `mkmk`, so that exception does not apply.
  - 3.1: when names are reserved, the internal names must change even for a small change; the
    copyright statements must stay.
  - 5.3: the primary name covers the font menu name and other mechanisms that specify a font in a
    document; a text reference to the original in a description or documentation is fine.
  - 5.4: no whole word of the RFN may be used, so no name containing "Source".
  - 1.10: a link to the OFL in font metadata is legally sufficient, the full text recommended.
- The webfonts paper (https://openfontlicense.org/webfonts-and-reserved-font-names/) places
  pre-subsetting by Unicode range, served as separate files or as `subset=latin-ext` style subsets
  of one named font, under Modified Versions with RFN restrictions. The RFN page
  (https://openfontlicense.org/ofl-reserved-font-names/) adds that RFN agreements normally do not
  transfer to other parties.
- Answer: subsetting requires renaming here. In these files the records other than ID 0 that
  contain "Source" are IDs 1, 3, 4 and 6 (there is no ID 16, 21 or 25); ID 0 with its RFN
  declaration and ID 14 must stay verbatim. The recipe in section 6 does this ("OY Yoruba Sans" and
  "OY Yoruba Serif" are proposals; any name without the word "Source" works).
- The CSS family name. FAQ 5.3's "mechanisms that specify a font in a document" reads naturally on
  a CSS `font-family`, so the conservative course is to declare the cut files under a family name
  without "Source" as well; the FAQ does not mention CSS, so this reading is Unverified. The
  fontsource files themselves are Google's pre-subsets and already carry the RFN under whatever
  arrangement Google has with Adobe (not stated in any file read here: Unverified); per the RFN page
  such an arrangement would not cover a further cut made in this repo.
- What ships beside the files: an `OFL.txt` with the fonts' own copyright notices (both name ID 0
  strings, RFN declarations included) followed by the OFL 1.1 text (condition 2). Copying the
  fontsource LICENSE alone would misstate the notice. The served woff2 keep ID 0 and ID 14, which
  FAQ 1.10 counts as sufficient in metadata. A FONTLOG is optional (FAQ section 6).

## 4. CSS: rule order, ranges, and what Chromium loads

- The rule. CSS Fonts 4 section 4.5.1, "Using character ranges to define composite fonts"
  (https://www.w3.org/TR/css-fonts-4/#composite-fonts, the same text in the Editor's Draft): when
  `@font-face` rules with the same family and style descriptors have overlapping ranges, they are
  checked in reverse order of definition, so "the last rule defined is the first to be checked".
  Section 5.2, "Matching font styles" (#font-style-matching): a face is loaded when its range
  includes the character, a composite face is walked in reverse rule order, and when no face has
  the glyph the next family in `font-family` is tried. Section 4.5: a user agent must not download
  or use a font for code points outside its range. So a cut that shares the family must be declared
  after latin-ext.
- Ranges, by set arithmetic on fontsource `unicode.json`: the eight code points sit inside latin-ext
  (U+0100-02BA and U+1E00-1E9F) and overlap neither vietnamese (whose nearest ranges are U+0128-0129
  and U+0168-0169 around U+0143, U+01AF-01B0 below U+01F8, and U+1EA0 above U+1E63) nor latin. The
  cut's place relative to the vietnamese rule does not matter.
- A second placement that needs no rule order: the cut as its own family listed first, for example
  `--font-body: "OY Yoruba Sans", "Source Sans 3", ...`. Section 5.2 then reaches the cut first for
  its eight letters and skips it for everything else. Line metrics do not move: section 5.2 defines
  the first available font as the first font whose `unicode-range` does not exclude U+0020, and the
  cut's range excludes it.
- Chromium test. Chrome 152.0.7977.76; one `srcdoc` iframe per case, so each is parsed like a page;
  each face has a unique URL. The cut is either an inlined `data:` font (the renamed Sans normal
  file) or a separate file at an unreachable TEST-NET address that never answers. Latin, latin-ext
  and vietnamese point at unreachable addresses too. A face that was requested reads `loading` in
  `document.fonts` and one never requested reads `unloaded`. Statuses were read between 1 and 4.5
  seconds after load (the cases with marks once, at 3 seconds), and repeated reads agreed.

| Case | Cut face | latin-ext requested |
| --- | --- | --- |
| No cut, text ṣ | none | yes |
| A: same family, rule after latin-ext, inlined, text ṣ | loaded | no |
| A: same family, separate file that never answers, text ṣ | loading | no |
| A: inlined, text Ł (U+0141) | not requested | yes |
| B: own family first, inlined, text ṣ | loaded | no |
| B: own family first, separate file that never answers, text ṣ | loading | no |
| No cut, "Ohun tí a ń ṣe" inserted by script after load | none | yes |
| A and B, inlined or separate file, the same sentence inserted by script | loaded or loading | no |
| A and B, separate file, the same sentence parsed | loading | no |
| A and B, inlined, ṣ plus U+0304, ṣ plus U+0301; A, ń plus U+0329 | loaded | yes |
| A, inlined, n plus U+0304 | not requested | no |

  Both placements behave the same in every case. A first harness that built all cases in one
  document by script, shared one `data:` URL between cut faces and used invalid `data:` fonts that
  fail at once for the other faces, showed latin-ext requested everywhere; its faces shared
  resources and failed instantly, so it was discarded. Firefox and Safari were not tested
  (Unverified).
- This session's Lighthouse reports (`@lhci/cli` 0.15.1, simulated throttling, production build)
  agree for placement A: with the weight-only files alone the homepage fetched
  `source-sans-3-latin-ext-wght-normal` (60,088 bytes) and `source-serif-4-latin-ext-wght-normal`
  (42,040 bytes); with the cuts declared after latin-ext it fetched neither and loaded two `data:`
  fonts of 2,668 and 3,648 bytes instead.
- Those were `data:` fonts because Vite inlined them. Vite 8.2.2 inlines an asset smaller than
  `build.assetsInlineLimit`, default 4096 bytes, as a base64 `data:` URL unless its URL carries
  `?no-inline` (`vite/dist/node/index.d.ts` lines 2130 to 2138; `DEFAULT_ASSETS_INLINE_LIMIT` at
  `dist/node/chunks/node.js` line 693; `shouldInline`, lines 21569 to 21587). All four cuts are
  below the limit. A scratch Vite 8.2.2 build confirmed both paths for CSS `url()`: a 2,668 byte
  font came out as `data:font/woff2;base64,...`, and the same kind of file with `?no-inline` came
  out as a hashed file with the query removed.
- Two consequences of inlining. The stylesheet grows on every page: in the Lighthouse reports the
  CSS went from 14,349 to 27,296 bytes transferred (86,626 to 104,846 decoded) while fonts fell from
  258,408 to 162,188 bytes, so every page, with or without the eight letters, now carries about
  12.9 KB more CSS. And `packages/web/src/lib/csp.ts` line 19 sets `font-src 'self'`: CSP Level 3
  section 6.7.2.8 (https://w3c.github.io/webappsec-csp/#match-url-to-source-expression) matches
  `'self'` only against the page's own origin or host, and its note says other schemes must be
  listed explicitly, so inlined fonts are reported under the current report-only policy and would
  be blocked once Phase 9 enforces it. A blocked face fails and matching moves to the next face,
  latin-ext (section 5.2), so pages would still render but lose the saving (not tested under
  enforcement: Unverified).

## 5. Coverage of the word list and the seed copy

Every character above U+00FF, with the file that renders it under the new rules. The answer is the
same for both families and both styles, and for both placements. Counts are occurrences in the
working tree on 12 September 2026 (the seed count includes an uncommitted caption added during the
session).

`packages/lint/yoruba-terms.json` (NFC):

| Code point | Character | Count, example | Resolves to |
| --- | --- | --- | --- |
| U+0300 | combining grave | 3, `káàbọ̀` | vietnamese |
| U+0301 | combining acute | 1, `Ẹgbẹ́` | vietnamese |
| U+1E63 | ṣ | 2, `aṣọ`, `ṣé` | cut |
| U+1EB8 | Ẹ | 3 | vietnamese |
| U+1EB9 | ẹ | 4 | vietnamese |
| U+1ECC | Ọ | 2 | vietnamese |
| U+1ECD | ọ | 3 | vietnamese |

`packages/content/scripts/seed-data.ts` (NFC):

| Code point | Character | Count, example | Resolves to |
| --- | --- | --- | --- |
| U+0144 | ń | 3, `Àgbájọ ọwọ́ la fi ń sọ̀yà.` (twice), `Ohun tí a ń ṣe` | cut |
| U+0300 | combining grave | 6 | vietnamese |
| U+0301 | combining acute | 7 | vietnamese |
| U+1E63 | ṣ | 5, `Àjọṣe`, `Iṣẹ́`, `àṣà` | cut |
| U+1EB8 | Ẹ | 6 | vietnamese |
| U+1EB9 | ẹ | 3 | vietnamese |
| U+1ECC | Ọ | 10 | vietnamese |
| U+1ECD | ọ | 22 | vietnamese |
| U+2022 | • | 8, photo captions | latin |

- The combining sequences are U+1EB9 or U+1ECD or U+1EB8 followed by U+0300 or U+0301 (word list 4,
  seed 13): base and mark both in vietnamese, as the Phase 1 note requires. None follows one of the
  eight letters.
- The capitals appear at render time: `.oy-kicker` uppercases its text
  (`packages/tokens/src/components.css` lines 6 to 14, `var(--font-body)`), so the seed kicker
  "Ohun tí a ń ṣe" renders Ń and Ṣ, both in the cut.
- No other latin-ext character. A scan of every tracked `.ts`, `.tsx`, `.astro`, `.css`, `.json`,
  `.md`, `.mdx`, `.html`, `.js` and `.mjs` file under `packages/` and `docs/design/` found no
  character that only latin-ext covers (inside latin-ext's range, outside latin, vietnamese and the
  eight). The eight code points therefore cover every latin-ext letter the content uses; a future
  one (for example a vowel with macron such as U+014D) would load latin-ext again, as intended.
- Outside this question: → (U+2192, the button arrow) and ✓ (U+2713, in the success copy) fall in
  none of the three ranges the site declares for Source and in neither the latin nor the latin-ext
  cmap, so they already come from a fallback font; this change does not affect them.

## 6. Recipe

Four files, not six: Sans and Serif, normal and italic, all weight-only. The script below was run
twice from the scratchpad against the repo's pinned files (`TOKENS_DIR` set to the repo's
`packages/tokens`, `OUT_DIR` to the scratchpad) and produced identical output both times:

| File | Bytes | sha256 |
| --- | --- | --- |
| `oy-yoruba-sans-wght-normal.woff2` | 2,696 | `941644cba97bcf959d20d3907c9cfc8201fca4abbde341e28ddf8b2f8a10433d` |
| `oy-yoruba-sans-wght-italic.woff2` | 2,752 | `411de686b944704e6294a07b11bca98d4203f0de092f6bfcf94ea56ef213e723` |
| `oy-yoruba-serif-wght-normal.woff2` | 3,672 | `230059fa3d4595d6fcca509f12792c6c5d6e2b104ce5436b3258a61f09b25979` |
| `oy-yoruba-serif-wght-italic.woff2` | 3,864 | `a7aea2b9de729fe6f24fc56ba19c78317d1c848ba761af910a779fb98a6564eb` |
| `OFL.txt` | 4,484 | `f58fda69b6d4edcda857bed0d573373971600660874d2adda8bff18870557148` |

- Why a script and not the `pyftsubset` line: the command line cannot rename. The script makes the
  same calls as the CLI's `main` (`load_font` with glyph names skipped, `Subsetter.populate`,
  `subset`, `save_font`; lines 3863 to 3902 and 4042 in 4.60.1) and renames between subsetting and
  saving. Without the rename it reproduces the CLI cut byte for byte (Sans normal, `48f53d27...`).
  Renaming leaves `head.modified` and the bounding box untouched because `load_font` opens the font
  with recalculation off.
- Checks built in: the fontsource version is 5.3.0 and the four inputs match their sha256; after
  renaming no name record but ID 0 contains "Source"; each output's cmap is exactly the eight code
  points; IDs 0 and 14 equal the source; every letter draws and advances as in the source at wght
  200 to 900 in steps of 50. The full comparison of section 2 also passed on these renamed files.
- Pins: fontTools 4.65.0 (current; same bytes as 4.60.1), brotli 1.2.0, zopfli 0.4.3 (pulled in by
  the extra, unused for woff2), Python 3.10 or later (fontTools `requires_python`). Nothing is added
  to `package.json`.

Proposed `packages/tokens/scripts/make-yoruba-subsets.sh`:

```bash
#!/usr/bin/env bash
# Cuts the Yoruba letters that fontsource ships in latin-ext (U+0143-0144, U+01F8-01F9,
# U+1E3E-1E3F, U+1E62-1E63) out of the pinned @fontsource-variable latin-ext wght files into four
# small woff2 files, renames them (OFL condition 3: the fonts reserve the name "Source"), checks
# that every letter draws exactly as in its source at wght 200 to 900, and writes OFL.txt beside
# them. Recipe and licence check: docs/research/phase-5-yoruba-font-subsets.md.
#
#   bash packages/tokens/scripts/make-yoruba-subsets.sh
#
# Needs python3 3.10 or later and PyPI access; installs nothing outside a temporary directory.
set -euo pipefail

TOKENS="${TOKENS_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
OUT="${OUT_DIR:-$TOKENS/src/fonts}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

"${PYTHON:-python3}" -m venv "$tmp/venv"
"$tmp/venv/bin/pip" install --quiet --disable-pip-version-check \
  "fonttools[woff]==4.65.0" "brotli==1.2.0" "zopfli==0.4.3"
mkdir -p "$OUT"

"$tmp/venv/bin/python" - "$TOKENS" "$OUT" <<'PY'
import hashlib
import json
import sys
from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

tokens, out = Path(sys.argv[1]), Path(sys.argv[2])
CODEPOINTS = sorted(subset.parse_unicodes("U+0143-0144,U+01F8-01F9,U+1E3E-1E3F,U+1E62-1E63"))
OPTIONS = ["--layout-features=*", "--flavor=woff2", "--name-IDs=*", "--name-languages=*", "--notdef-outline"]
FONTSOURCE = "5.3.0"
# package, names that carry the Reserved Font Name, the new names, output prefix
FAMILIES = [
    ("source-sans-3", "Source Sans 3", "SourceSans3", "OY Yoruba Sans", "OYYorubaSans", "oy-yoruba-sans"),
    ("source-serif-4", "Source Serif 4", "SourceSerif4", "OY Yoruba Serif", "OYYorubaSerif", "oy-yoruba-serif"),
]
INPUTS = {  # sha256 of the fontsource 5.3.0 files; a mismatch means re-verify before cutting
    "source-sans-3-latin-ext-wght-normal.woff2": "a85a7459bdb3cdc1136751e151a506bae653fc29ada3ca86237477df6f1b59e6",
    "source-sans-3-latin-ext-wght-italic.woff2": "6fe10a66ec416f77a26309b645471d032ad8175063bb605b886e9b7e57efaaa8",
    "source-serif-4-latin-ext-wght-normal.woff2": "41529a5b38008d9ea01e28ec18693a714a3216669ee477d83a5b9db999369625",
    "source-serif-4-latin-ext-wght-italic.woff2": "515639854d3566c43860d2005770645c590df8b43a0144c70fe2566c33015ede",
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def drawing(font, wght):
    glyphs, cmap, result = font.getGlyphSet(location={"wght": wght}), font.getBestCmap(), []
    for codepoint in CODEPOINTS:
        pen = DecomposingRecordingPen(glyphs)
        glyphs[cmap[codepoint]].draw(pen)
        result.append((pen.value, glyphs[cmap[codepoint]].width))
    return result


notices, licence = [], None
for package, family, ps_family, new_family, new_ps_family, prefix in FAMILIES:
    root = tokens / "node_modules" / "@fontsource-variable" / package
    version = json.loads((root / "package.json").read_text())["version"]
    if version != FONTSOURCE:
        sys.exit(f"{package} is {version}, the recipe was verified on {FONTSOURCE}")
    text = (root / "LICENSE").read_text()
    start = text.index("SIL OPEN FONT LICENSE Version 1.1")
    licence = text[text.rindex("\n", 0, start - 1) + 1:]
    for style in ("normal", "italic"):
        src = root / "files" / f"{package}-latin-ext-wght-{style}.woff2"
        dst = out / f"{prefix}-wght-{style}.woff2"
        if sha256(src) != INPUTS[src.name]:
            sys.exit(f"{src.name} is not the verified file")
        options = subset.Options()
        options.parse_opts(OPTIONS)
        font = subset.load_font(str(src), options, dontLoadGlyphNames=True)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=CODEPOINTS)
        subsetter.subset(font)
        name = font["name"]
        for record in name.names:
            if record.nameID == 0:  # the copyright notice and its RFN declaration stay verbatim
                continue
            old = record.toUnicode()
            new = old.replace(family, new_family).replace(ps_family, new_ps_family)
            if new != old:
                name.setName(new, record.nameID, record.platformID, record.platEncID, record.langID)
        left = [r.nameID for r in name.names if r.nameID != 0 and "Source" in r.toUnicode()]
        if left:
            sys.exit(f"{dst.name}: name IDs {left} still carry the Reserved Font Name")
        subset.save_font(font, str(dst), options)

        cut, original = TTFont(dst), TTFont(src)
        if sorted(cut.getBestCmap()) != CODEPOINTS:
            sys.exit(f"{dst.name}: cmap is not the eight letters")
        for name_id in (0, 14):
            if cut["name"].getDebugName(name_id) != original["name"].getDebugName(name_id):
                sys.exit(f"{dst.name}: name ID {name_id} differs from the source")
        for wght in range(200, 901, 50):
            if drawing(cut, wght) != drawing(original, wght):
                sys.exit(f"{dst.name}: draws differently from {src.name} at wght {wght}")
        notice = original["name"].getDebugName(0)
        if notice not in notices:
            notices.append(notice)
        print(f"{dst.name}  {dst.stat().st_size} bytes  sha256 {sha256(dst)}")

ofl = out / "OFL.txt"
ofl.write_text(
    "\n".join(notices)
    + "\n\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.\n"
    + "This license is copied below, and is also available with a FAQ at:\n"
    + "https://openfontlicense.org\n\n\n"
    + licence
)
print(f"OFL.txt  {ofl.stat().st_size} bytes")
PY
```

The `fonts.css` rules it pairs with, for placement B, with one block per file (Serif normal shown;
the Serif italic and the two Sans blocks differ only in family, style and file name):

```css
/* Ń ń Ǹ ǹ Ḿ ḿ Ṣ ṣ: cut from the fontsource latin-ext files by scripts/make-yoruba-subsets.sh and
   renamed, since the fonts reserve the name "Source" (OFL condition 3, licence in fonts/OFL.txt).
   First in the stacks, so these eight letters do not pull in latin-ext. */
@font-face {
  font-family: "OY Yoruba Serif";
  font-style: normal;
  font-weight: 200 900;
  font-display: swap;
  src: url("./fonts/oy-yoruba-serif-wght-normal.woff2?no-inline") format("woff2-variations");
  unicode-range: U+0143-0144, U+01F8-01F9, U+1E3E-1E3F, U+1E62-1E63;
}

:root {
  --font-display: "OY Yoruba Serif", "Source Serif 4", "Noto Serif", Georgia, serif;
  --font-body: "OY Yoruba Sans", "Source Sans 3", "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

For placement A, the same four blocks go directly after each family's latin-ext rule, and every
face of that family, the fontsource ones included, takes a family name without "Source".

## Recommendation

- Verdict on the cut: sound. fontTools keeps `fvar`, `avar`, `gvar`, `HVAR`, `STAT` and (in Sans)
  `MVAR`, the eight letters are composites that need no layout features, and they draw and advance
  exactly as in the fontsource files at every weight from 200 to 900. The eight code points cover every
  latin-ext letter in the word list, the seed copy and the rest of `packages/` and `docs/design/`.
- Rename before committing (contradicts the plan as written). The fonts' own copyright notice
  reserves "Source"; OFL condition 3, FAQ 2.6, 3.1 and 5.4 and the webfonts paper make a Unicode
  range cut a Modified Version that may not carry it. Rename name IDs 1, 3, 4 and 6, keep ID 0 and ID
  14, and commit `OFL.txt` with the fonts' notices beside the files. The script in section 6 does
  all of it and checks the drawing.
- Declare the renamed faces as their own family, first in `--font-display` and `--font-body`
  (placement B), rather than after latin-ext inside "Source Serif 4" and "Source Sans 3". It keeps
  the RFN off the modified files in CSS too (the conservative reading of FAQ 5.3), leaves the
  fontsource rules untouched, and loaded exactly like the plan's placement in every Chromium case
  tested. If one family name is preferred, rename the whole family instead. Either way, ADR 0026 and
  ticket 01 need the "declared after each family's latin-ext rule" sentence changed, and the ticket's
  test should pin the stack order (or the rename) in place of the rule order.
- Decide inlining before measuring again (not in the plan). Vite inlines all four files, which puts
  about 12.9 KB on every page's stylesheet and conflicts with `font-src 'self'` once Phase 9
  enforces the CSP. Recommended: `?no-inline` on the four URLs, then re-run lhci, since the 0.89
  mobile score in ADR 0026 was measured with inlined fonts. The alternative is keeping the inlining
  and adding `data:` to `font-src` in `packages/web/src/lib/csp.ts`.
- Pin fontTools 4.65.0 in the script rather than 4.60.1: identical output, current release.
  `--notdef-outline` is optional (72 to 168 bytes per file).
- Keep content NFC and marks off the eight letters: a combining mark after Ń ń Ǹ ǹ Ḿ ḿ Ṣ ṣ fetches
  latin-ext again (section 4). Today's content has none.
- Open for the owner: the two family names (proposals only), placement B or a whole-family rename,
  and inlining or `?no-inline`. Asking Adobe for a written RFN agreement (FAQ 5.8) is the only way to
  keep "Source" on the cut files.
