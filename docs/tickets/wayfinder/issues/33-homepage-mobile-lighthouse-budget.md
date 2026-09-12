# Bring the homepage under the mobile Lighthouse budget

Type: task
Status: open
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
