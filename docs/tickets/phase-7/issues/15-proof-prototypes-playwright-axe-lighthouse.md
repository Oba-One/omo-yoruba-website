# 15: Proof: the prototypes, Playwright and axe, Lighthouse

Labels: bug, infra
Status: resolved
Blocked by: 03, 04, 06, 07, 08, 09, 11, 12, 14

**What to build:** the four pages proven against the handoff before the code review: compared with their
prototypes at 375 and 1440 with what differs fixed or recorded; Playwright and axe green on every route in
both data modes; the register's mock values never standing in for an owed fact; Lighthouse numbers against
QUALITY section 3; every check passing.

- [x] Prototype comparison at 375 and 1440 (the `design` preview on 4399), fixes, and an ADR for where a
      repo rule outranks a prototype
- [x] Playwright and axe on the four routes, seeded and with the placeholder project (`--workers=1`); the
      routes in the targets spec and the heading-order check; the earlier suites green
- [x] The routes in `lighthouserc.cjs`; lhci on the local production build, mobile and desktop, numbers
      recorded here
- [x] `bun check`, `bun run build` and the Storybook build

## Comments

13 September 2026. The four pages and their prototypes captured at 375 and 1440 (Chrome DevTools MCP, full
pages at a device pixel ratio of 1 after a scroll pass, `test-results/phase7-compare/`, the prototypes on
the `design` preview) and compared section by section; Our Story's timeline, hidden on the dataset, through
`Pages/OurStory/Timeline` beside the prototype's section forced visible. ADR 0036 records what differs by
rule. Fixed: the door card's label (a paragraph the card's rules set at 15px and grew beside a taller card;
now the prototype's span), the door bullets, Impact's six photographs at 375 (a wide first tile left the
sixth alone), a glance strip opening a split's aside (20px low), `SectionHead`'s lead (12px, 64ch, 1.7) and
its heading's 6px only under a kicker, the dark closing band's swatch, Donate's centred give-now split,
Impact's headline order and the associations figure's full label, and Our Story's "Volunteer" chip, the last
two written by the seed (a revision and a missing field). Not taken as intent: People and History's paper
grounds and dark row borders (its runtime draws those sections outside `.oy-home`) and Donate's give-now
split running off the screen at 375 (inline columns overriding the tokens' stacking).

Playwright, whole suite, `--workers=1`, with the four routes in the targets sweep and the heading-order
check: seeded 246 passed and 8 skipped; placeholder project (as CI runs it) 217 passed and 37 skipped. After
the last fix (the centred split), Donate and Our Story again: 36 passed in each mode. `bun check` green (131
files, 747 tests); `bun run build` green; the Storybook build green, its 58 Phase 7 stories prerendered
without an error.

lhci on the local production build (`.vercel/output` served with brotli and an edge cache, the env loaded
by `node --env-file`), three runs each, the run with the median performance (performance, accessibility,
best practices, SEO; LCP; CLS):

| Route | Mobile | Desktop |
| --- | --- | --- |
| `/` | 0.95, 1, 0.93, 1; 2.73 s; 0.034 | 1, 1, 0.93, 1; 0.63 s; 0.001 |
| `/odunde` | 0.96, 1, 0.93, 1; 2.53 s; 0.060 | 1, 1, 0.93, 1; 0.68 s; 0.001 |
| `/gala` | 0.96, 1, 0.93, 1; 2.46 s; 0.063 | 1, 1, 0.93, 1; 0.58 s; 0.001 |
| `/programs` | 0.97, 1, 0.93, 1; 2.43 s; 0 | 1, 1, 0.93, 1; 0.51 s; 0.001 |
| `/programs/yoruba-lessons` | 0.99, 1, 0.93, 1; 1.91 s; 0.019 | 1, 1, 0.93, 1; 0.49 s; 0.001 |
| `/programs/cultural-collective` | 0.98, 1, 0.93, 1; 1.99 s; 0 | 1, 1, 0.93, 1; 0.65 s; 0.001 |
| `/get-involved` | 0.97, 1, 0.93, 1; 2.44 s; 0.020 | 1, 1, 0.93, 1; 0.55 s; 0.001 |
| `/impact` | 0.98, 1, 0.93, 1; 2.13 s; 0 | 1, 1, 0.93, 1; 0.59 s; 0.001 |
| `/our-story` | 0.96, 1, 0.93, 1; 2.04 s; 0 | 1, 1, 0.93, 1; 0.57 s; 0.002 |
| `/donate` | 0.96, 1, 0.93, 1; 2.17 s; 0 | 1, 1, 0.93, 1; 0.53 s; 0.001 |

Against QUALITY section 3: the four trust pages meet performance 90+, accessibility and SEO 100, LCP under
2.5 s, CLS under 0.05 and script 12 KB (budget 60 KB) on both presets. Best practices is 0.93 on every route
and preset, as since Phase 4: a 404 in the console (the missing favicon, wayfinder ticket 32) and the
report-only CSP's issue. The earlier routes carry their findings: `/` misses mobile LCP by 0.23 s and
`/odunde` by 0.03 s, and `/odunde` and `/gala` shift 0.060 and 0.063 on mobile when the web fonts swap in
under the glance band (wayfinder ticket 35). The Lighthouse runs used the build before the centred split,
a CSS rule with nothing to load.
