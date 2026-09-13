# 07: Proof: the prototype, Playwright and axe, Lighthouse

Labels: bug, infra
Status: open
Blocked by: 03, 05, 06

**What to build:** both routes proven against the handoff before the code review: compared with `18 Photo
Gallery.dc.html` at 375 and 1440 in its mosaic, album and Lightbox states, with what differs fixed or recorded;
Playwright and axe green on both routes in both data modes; the register's inventions never standing in for an
owed fact; Lighthouse against QUALITY section 3 on a photograph-heavy page; every check passing.

- [ ] Prototype comparison at 375 and 1440 (the `design` preview on 4399), the open Lightbox included; fixes; an ADR
      for where a repo rule outranks the prototype
- [ ] Playwright and axe on both routes, seeded and with the placeholder project (`--workers=1`); the routes in the
      targets sweep and the heading-order check; the earlier suites green
- [ ] The routes in `lighthouserc.cjs`; lhci on the local production build, mobile and desktop, LCP and image sizes
      recorded here
- [ ] `bun check`, `bun run build` and the Storybook build
