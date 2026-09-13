# Bring the homepage under the mobile Lighthouse budget

Type: task
Status: resolved
Owner: no
Labels: infra, design
Phase: 5
Blocked by: none

## Question

Measured on 12 September 2026 with `@lhci/cli` 0.15.1 against the production build served locally
with brotli and an in-memory edge cache (`docs/plans/handoff-phase-4.md`): mobile performance 0.67
to 0.77 with a simulated LCP of about 6.0 s against the 2.5 s budget, desktop 0.97 to 0.98 (LCP
1.1 s), best practices 0.93 on both. The LCP element is the 36 KB hero photograph; what stretches it
on slow 4G:

- `packages/ui/src/navigation/Logo/logo-mark.png` is 175 KB (235 by 560) drawn at 17 by 40 in the
  nav and fetched at high priority; `logo-lockup-light.png` is 84 KB (583 by 180) drawn at 188 by 58
  in the footer and not lazy. Right-size both (2x the drawn size, WebP or optimised PNG) without
  switching the library to `astro:assets` unless Storybook still works (AGENTS.md: stop and ask
  before a framework pivot).
- About 470 KB of font files load up front (Source Serif 4 latin, latin-ext, vietnamese and italic;
  Source Sans 3 latin, latin-ext, vietnamese). The Yoruba marks need latin-ext and vietnamese, so
  keep the coverage; read ticket 19 and `docs/research/fonts-source-serif-sans-subsets.md` first,
  then look at what loads before first paint, `font-display`, and the italic.
- The favicon 404 costs best practices; add the icon once ticket 32 is answered. The report-only
  CSP's inspector issues stay until Phase 9 (ADR 0011).

Measure the way the runbook's Lighthouse section describes (`LIGHTHOUSE_BASE_URL`,
`LIGHTHOUSE_PRESET`, never `LHCI_*`), both presets, before and after, and record the numbers here.

## Answer

Resolved 12 September 2026 in Phase 5 (`docs/tickets/phase-5/issues/01-fonts-weight-only-serif-and-yoruba-subsets.md`,
ADR 0026). Measured with `@lhci/cli` 0.15.1 against the production build served locally (brotli, an
in-memory edge cache, Playwright's Chrome for Testing), three runs per preset, the homepage only:

| Build | Preset | Performance (runs) | LCP (median) | FCP | CLS | Fonts | Total | Best practices |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Before (main, 0132bd9) | mobile | 0.69, 0.77, 0.79 | 5.9 s | 2.0 s | 0.032 | 472 KB | 943 KB | 0.93 |
| Before | desktop | 0.98, 0.98, 0.98 | 1.1 s | 0.5 s | 0.001 | 472 KB | 1,141 KB | 0.93 |
| Logos right-sized (a553051) | mobile | 0.82, 0.82, 0.83 | 4.5 s | 2.1 s | 0.031 | 472 KB | 691 KB | 0.93 |
| Logos right-sized | desktop | 0.99, 0.99, 0.99 | 0.9 s | 0.6 s | 0.001 | 472 KB | 890 KB | 0.93 |
| After: logos, weight-only Serif, Yoruba subsets | mobile | 0.94, 0.95, 0.96 | 2.7 s | 1.4 s | 0.034 | 159 KB | 378 KB | 0.93 |
| After | desktop | 0.99, 0.99, 1.00 | 0.7 s | 0.6 s | 0.001 | 159 KB | 577 KB | 0.93 |

- The logos: the nav mark and the footer lockup are WebP at twice and three times the drawn size (2 to
  30 KB), with width and height, the lockup lazy.
- The fonts, the owner's choice after a side-by-side of the two Serif cuts: Source Serif 4 from the
  weight-only files (no optical size axis), and the eight Yoruba letters of latin-ext from renamed
  subsets first in the stacks, served as files (`?no-inline`). Coverage is unchanged: any other
  latin-ext character still loads the full file. What loaded before first paint on the homepage was
  seven files, the Serif italic and both latin-ext files among them for two words in italic and the
  letters ń and ṣ; now it is six files of 159 KB.
- Also measured and not taken: inlined stylesheets reached 0.95 with LCP 2.49 s over inlined font
  files, but moved the font swap after first paint (desktop CLS 0.23).
- Left: the mobile LCP is about 0.2 s over its 2.5 s budget (wayfinder ticket 35); best practices stays
  at 0.93 for the favicon 404 (ticket 32) and the report-only CSP's issues (Phase 9, ADR 0011).
