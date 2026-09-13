# Source Serif 4 ships weight-only, and the Yoruba letters of latin-ext come from small subsets

Decided with the owner on 12 September 2026 (wayfinder ticket 33, Phase 5 grill), revisiting what
ticket 19 left open. The homepage missed the mobile Lighthouse budget with 472 KB of fonts. Source
Serif 4 now loads the fontsource weight-only files instead of the optical-size files, so headings lose
the display cut the handoff asked for (253 KB to 106 KB for the upright, 130 KB to 52 KB for the
italic). The Yoruba letters that live in the latin-ext range (Ń ń, Ǹ ǹ, Ḿ ḿ, Ṣ ṣ) come from four
subsets of 3 to 4 KB, cut once from the pinned fontsource files with fontTools by
`packages/tokens/scripts/make-yoruba-subsets.sh`, which checks that every letter draws and advances
as in its source at every weight. The fonts reserve the name "Source" (their copyright notice), so
the cut files are renamed and declared as their own families, "OY Yoruba Serif" and "OY Yoruba
Sans", first in `--font-display` and `--font-body` with a unicode-range of those eight letters; any
other latin-ext character still loads the full fontsource file, so coverage is unchanged. The four
URLs carry `?no-inline`: Vite would otherwise inline files under 4 KB into every page's stylesheet,
where the Phase 9 `font-src 'self'` would block them. Measured on the local production build,
median of three: mobile performance 0.95 (0.94 to 0.96) with LCP 2.7 s and CLS 0.034, desktop 0.99
with LCP 0.73 s, fonts 159 KB (from 0.77, 5.9 s and 472 KB before ticket 33).

## Considered options

- Keep the optical-size files and add only the subsets: no visual change, but mobile stayed at 0.82
  with LCP 3.9 s.
- The subsets inside the "Source" families, after each latin-ext rule: the same loading, but it
  would put the reserved name on modified files in the CSS, which the OFL FAQ reads against.
- Inline the stylesheets as well: mobile reached 0.95 and LCP 2.49 s, but the font swap then landed
  after first paint and desktop CLS rose to 0.23; it waits on metric-matched fallback faces.
- The Astro Fonts API: its providers pick a family's named subsets (latin, latin-ext, vietnamese) and
  cut no new ones (`docs/research/fonts-source-serif-sans-subsets.md`), so the Yoruba letters would
  still arrive with the whole of latin-ext.

## Consequences

- Upgrading `@fontsource-variable/source-serif-4` or `source-sans-3` means re-running the subset
  script (`docs/research/phase-5-yoruba-font-subsets.md` holds the recipe and the licence check).
- The subsets carry no GSUB or GPOS; the precomposed letters are composite glyphs and draw the same,
  and combining marks resolve to the vietnamese subset as before (keep content NFC, ticket 19).
- The mobile LCP budget (2.5 s) is still missed by about 0.2 s; metric-matched fallback faces and
  inlined stylesheets are wayfinder ticket 35.
- A combining mark typed after one of the eight letters loads latin-ext again; today's content has
  none (keep content NFC and the marks on the vowels).
- The cut files keep the fonts' copyright notice and licence link in their name table, and
  `src/fonts/OFL.txt` carries both notices and the licence.
