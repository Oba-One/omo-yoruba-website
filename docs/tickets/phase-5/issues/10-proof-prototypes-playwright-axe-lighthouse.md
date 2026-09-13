# 10: Proof: the prototypes, Playwright, axe and Lighthouse

Labels: design, infra
Status: resolved
Blocked by: 01, 08, 09

**What to build:** both pages compared side by side with `08 Odunde Festival.dc.html` and `09
End-of-Year Gala.dc.html` at 375 and 1440 (prototypes served over HTTP, captures with the Chrome
DevTools MCP into `test-results/`), what differs fixed, and an ADR recording where a repo rule
outranks a prototype. Playwright and axe on both routes at both widths, passing with the seeded
dataset and the way CI runs them (placeholder project), with the Phase 3 and 4 suites green.
`/odunde` and `/gala` appended to `lighthouserc.cjs`, lhci on the local production build, numbers
reported against QUALITY section 3.

- [x] Captures of both pages and prototypes at 375 and 1440, the differences listed and fixed or recorded
- [x] ADR: the event pages follow their prototypes except where a repo rule outranks them
- [x] `bun e2e` green twice (seeded, placeholder), `bun check` green
- [x] lhci numbers for `/`, `/odunde`, `/gala` on both presets

## Comments

12 September 2026. Both pages and prototypes captured at 375 and 1440 (`test-results/cmp/`, the
prototypes served by the new `design` entry of `.claude/launch.json`) and compared section by section;
the tiers and the festival schedule, empty in the dataset, against their page-section stories. What
differs is Pending content or a rule that outranks the prototype (ADR 0028). Fixed: a wrapped header
facts line ended on its dot (a clipping box now hides the dot that starts a line), long chips wrapped as
ovals (16px corners), a split's head sat 30px above its prose (16px), the schedule toggle sat left (it
sits right). Lighthouse found one more: `/odunde` scored accessibility 0.99 because the footer's h4s
followed its last h2 (heading-order, a best-practice rule the WCAG-tagged axe runs skip); the footer's
headings are h2 with the same look, and `a11y.spec.ts` now runs heading-order on the three routes.

Playwright, whole suite, `--workers=1`: seeded 116 passed and 8 skipped; placeholder project (CI) 91
passed and 33 skipped (the specs that need Studio data). `bun check` green (106 files, 526 tests).

lhci on the local production build after the fixes, three runs each, the run with the median
performance (performance, accessibility, best practices, SEO; LCP; CLS):

| Route | Mobile | Desktop |
| --- | --- | --- |
| `/` | 0.95, 1, 0.93, 1; 2.69 s; 0.033 | 0.99, 1, 0.93, 1; 0.77 s; 0.016 |
| `/odunde` | 0.95, 1, 0.93, 1; 2.56 s; 0.071 | 1, 1, 0.93, 1; 0.71 s; 0.001 |
| `/gala` | 0.95, 1, 0.93, 1; 2.49 s; 0.063 | 1, 1, 0.93, 1; 0.65 s; 0.007 |

Against QUALITY section 3: performance 90+ and accessibility and SEO 100 met on every route and preset;
script 12 KB on each (budget 60 KB). Best practices 0.93 everywhere, as since Phase 4: the missing
favicon (ticket 32) and the report-only CSP findings. Mobile LCP misses 2.5 s by 0.06 s on `/odunde` and
0.19 s on `/` (the header photograph and fonts, ticket 35). Mobile CLS: single runs shift 0.06 to 0.07
on the event pages when the fonts swap in (other runs 0), which lhci's aggregate passes; the header's
facts layout is not the cause (37px taller with the fallback faces before and after this ticket), so it
joins ticket 35's metric-matched fallback faces.

