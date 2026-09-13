# 12: Proof: the prototypes, Playwright and axe, Lighthouse

Labels: bug, infra
Status: resolved
Blocked by: 02, 03, 04, 05, 06, 07, 08, 09, 10, 11

**What to build:** the three program pages proven against the handoff before the code review: compared
with their prototypes at 375 and 1440 with what differs fixed or recorded; Playwright and axe green on
every route, seeded and as CI runs them; the register's mock values never standing in for an owed fact;
Lighthouse numbers reported against QUALITY section 3; every check passing.

- [x] Prototype comparison at 375 and 1440 (the `design` preview on 4399), fixes, and an ADR for where a
      repo rule outranks a prototype
- [x] Playwright and axe on the three routes, seeded and with the placeholder project (`--workers=1`);
      `expectNoMockWhileOwed` with the register's values; the routes in the targets spec and the
      heading-order check; the earlier suites green
- [x] The routes in `lighthouserc.cjs`; lhci on the local production build, mobile and desktop, numbers
      recorded here
- [x] `bun check`, `bun run build` and the Storybook build (play functions finishing in the canvas)

## Comments

13 September 2026. The three pages and their prototypes captured at 375 and 1440 (Chrome DevTools MCP,
full pages at a device pixel ratio of 1 after a scroll pass, `test-results/phase6-compare/`, the
prototypes on the `design` preview) and compared section by section. ADR 0033 records what differs by
rule. Fixed: the photographs beside the Collective's argument and Cultural Exchange are 280px as drawn
(`PhotoTile` `height`, which the initiatives now use for 340px); Kids & STEM's prose runs at 74ch
(`Prose` `measure="wide"`); "Hide details" sits right under 720px (block-level); the questions parents
ask sit in the prototype's 900px wrap (`Section` `width="narrow"`); a handoff box on an alternate ground
takes white instead of vanishing into its own tint; a placeholder quote's brackets hold to their words.
Not taken as intent: the Collective prototype's paper grounds and dark row borders, which come from its
runtime drawing the sections outside `.oy-home` (the other two prototypes draw the `adire` tint).

Playwright, whole suite, `--workers=1`, after the fixes, with the three routes in the targets sweep and the
heading-order check: seeded 174 passed and 8 skipped; placeholder project (CI) 149 passed and 33 skipped.
`bun check` green (121 files, 645 tests); `bun run build` green; the Storybook build green, its 13 play
functions finishing in the canvas and every new Phase 6 story rendering without an error.

lhci on the local production build (`.vercel/output` served with brotli and an edge cache, the env loaded
by `node --env-file`), three runs each, the run with the median performance (performance, accessibility,
best practices, SEO; LCP; CLS):

| Route | Mobile | Desktop |
| --- | --- | --- |
| `/` | 0.96, 1, 0.93, 1; 2.66 s; 0.033 | 1, 1, 0.93, 1; 0.62 s; 0.001 |
| `/odunde` | 0.96, 1, 0.93, 1; 2.53 s; 0.060 | 1, 1, 0.93, 1; 0.60 s; 0.001 |
| `/gala` | 0.97, 1, 0.93, 1; 2.29 s; 0.063 | 1, 1, 0.93, 1; 0.56 s; 0.001 |
| `/programs` | 0.97, 1, 0.93, 1; 2.44 s; 0 | 1, 1, 0.93, 1; 0.51 s; 0.001 |
| `/programs/yoruba-lessons` | 0.99, 1, 0.93, 1; 1.91 s; 0.019 | 1, 1, 0.93, 1; 0.47 s; 0.001 |
| `/programs/cultural-collective` | 0.99, 1, 0.93, 1; 1.84 s; 0.003 | 1, 1, 0.93, 1; 0.51 s; 0.001 |

Against QUALITY section 3: the three program pages meet performance 90+, accessibility and SEO 100, LCP
under 2.5 s, CLS under 0.05 and script 12 KB (budget 60 KB) on both presets. Best practices is 0.93 on
every route and preset, as since Phase 4: the missing favicon's 404 (wayfinder ticket 32) and the
report-only CSP issue. The earlier routes carry their Phase 5 findings: `/` misses mobile LCP by 0.16 s,
and `/odunde` and `/gala` shift 0.060 and 0.063 on mobile when the web fonts swap in under the glance band
(the same elements and values as Phase 5's single runs, which this machine now hits on every run, so the
aggregate fails; wayfinder ticket 35's metric-matched fallback faces).
