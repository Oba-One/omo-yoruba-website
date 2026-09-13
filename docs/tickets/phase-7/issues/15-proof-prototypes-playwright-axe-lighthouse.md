# 15: Proof: the prototypes, Playwright and axe, Lighthouse

Labels: bug, infra
Status: open
Blocked by: 03, 04, 06, 07, 08, 09, 11, 12, 14

**What to build:** the four pages proven against the handoff before the code review: compared with their
prototypes at 375 and 1440 with what differs fixed or recorded; Playwright and axe green on every route in
both data modes; the register's mock values never standing in for an owed fact; Lighthouse numbers against
QUALITY section 3; every check passing.

- [ ] Prototype comparison at 375 and 1440 (the `design` preview on 4399), fixes, and an ADR for where a
      repo rule outranks a prototype
- [ ] Playwright and axe on the four routes, seeded and with the placeholder project (`--workers=1`); the
      routes in the targets spec and the heading-order check; the earlier suites green
- [ ] The routes in `lighthouserc.cjs`; lhci on the local production build, mobile and desktop, numbers
      recorded here
- [ ] `bun check`, `bun run build` and the Storybook build

## Comments
