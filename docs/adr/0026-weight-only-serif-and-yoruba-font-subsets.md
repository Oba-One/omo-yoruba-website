# Source Serif 4 ships weight-only, and the Yoruba letters of latin-ext come from small subsets

Decided with the owner on 12 September 2026 (wayfinder ticket 33, Phase 5 grill), revisiting what
ticket 19 left open. The homepage missed the mobile Lighthouse budget with 472 KB of fonts. Source
Serif 4 now loads the fontsource weight-only files instead of the optical-size files, so headings lose
the display cut the handoff asked for (253 KB to 106 KB for the upright, 130 KB to 52 KB for the
italic). The Yoruba letters that live in the latin-ext range (Ń ń, Ǹ ǹ, Ḿ ḿ, Ṣ ṣ) come from subsets of
a few KB each, cut once from the pinned fontsource files with fontTools and committed to `@oy/tokens`,
declared after each family's latin-ext rule so the browser checks them first; any other latin-ext
character still loads the full file, so coverage is unchanged. Measured together on the local
production build: fonts 152 KB, mobile performance 0.89, LCP 3.0 s (from 0.77 and 5.9 s before
ticket 33).

## Considered options

- Keep the optical-size files and add only the subsets: no visual change, but mobile stayed at 0.82
  with LCP 3.9 s.
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
- The LCP budget on mobile (2.5 s) is still missed on the homepage; the fallback metrics are a
  follow-up ticket.
