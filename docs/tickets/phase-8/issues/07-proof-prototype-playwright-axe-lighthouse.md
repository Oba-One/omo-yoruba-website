# 07: Proof: the prototype, Playwright and axe, Lighthouse

Labels: bug, infra
Status: resolved
Blocked by: 03, 05, 06

**What to build:** both routes proven against the handoff before the code review: compared with `18 Photo
Gallery.dc.html` at 375 and 1440 in its mosaic, album and Lightbox states, with what differs fixed or recorded;
Playwright and axe green on both routes in both data modes; the register's inventions never standing in for an
owed fact; Lighthouse against QUALITY section 3 on a photograph-heavy page; every check passing.

- [x] Prototype comparison at 375 and 1440 (the `design` preview on 4399), the open Lightbox included; fixes; an ADR
      for where a repo rule outranks the prototype
- [x] Playwright and axe on both routes, seeded and with the placeholder project (`--workers=1`); the routes in the
      targets sweep and the heading-order check; the earlier suites green
- [x] The routes in `lighthouserc.cjs`; lhci on the local production build, mobile and desktop, LCP and image sizes
      recorded here
- [x] `bun check`, `bun run build` and the Storybook build

## Comments

13 September 2026. Compared with `18 Photo Gallery.dc.html` at 375 and 1440 (captures in `test-results/phase8-compare/`):
the mosaic, the album grid and the Lightbox match the prototype's geometry, and the one difference fixed was the
Lightbox's previous and next, now beside the photograph. ADR 0040 records what stays different and why, and the runbook
names the prototype runtime's `sc-interp` trap.

Playwright with `--workers=1`, after the code review's fixes: seeded 281 passed and 11 skipped (project-conditional:
touch in the desktop project, the menu and the target sweeps by viewport, the write test without `E2E_WRITE`); the
placeholder project 254 passed and 38 skipped, every gallery and album test asserting the 503 form or the Pending line
there. Both routes are in the 44px sweep (the served-open Lightbox too) and the heading-order check; axe is clean with
the Lightbox closed and open.

Lighthouse (lhci 0.15.1, `lighthouserc.cjs` with the two routes appended) on the local production build, three runs per
route, before the review:

- Mobile: every route accessibility 1, SEO 1, best practices 0.93 on every route (the `/favicon.ico` 404 and the
  report-only CSP, wayfinder tickets 32 and 13). `/gallery` performance 0.92 to 0.95, LCP 2.25 to 3.01 s (the lead
  cover, three covers at 720px, 169 KB of images), CLS 0. `/gallery/odunde-2026` performance 0.90 to 0.93, LCP 3.01 to
  3.06 s: the first three photographs loaded eagerly and 15 lazy ones inside Chrome's distance threshold, 18 at 720px,
  911 KB. The homepage's 2.67 to 2.82 s is ticket 35; the other routes' medians stay at or under 2.55 s.
- Desktop: every route performance 0.97 to 1, `/gallery` LCP 0.74 to 0.75 s, the album page 0.66 to 0.77 s.
- Script 12 KB gzipped on every route (budget 60 KB).

The fixes (spec, "Performance"): an album page fetches only its first photograph at once, and the grid's tiles are
cropped to 16:9 at the CDN. Five mobile runs of the album page: performance 0.93 to 0.95, LCP 2.46 to 2.79 s (three
under 2.5 s), 16 photographs at 720 by 405 pixels, 673 KB; desktop performance 0.97 to 1, LCP 0.65 to 1.05 s (the
slow run on the CDN's first crops), 43 photographs in 536 KB where they had been 702 KB. `/gallery` on mobile after the
first fix: performance 0.87 to 0.95, LCP 2.31 to 2.94 s over five runs. What remains is the site-wide stylesheet and
font cost before first paint (ticket 35); lhci's assertion passes on the best run of both gallery routes and fails on
best practices everywhere, as before this phase.

`bun check` after the review: 141 test files, 833 tests; `bun run build` passes; the Storybook build prerenders 593
stories, the two empty ones by design (an incomplete action, a confirmed credit with no name).
