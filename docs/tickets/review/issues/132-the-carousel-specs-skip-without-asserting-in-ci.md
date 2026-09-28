# 132: The carousel specs skip without asserting in CI, and in a seeded run a regression that drops the photographs passes

Labels: infra
Status: open
Blocked by: none

**Finding** (R132 in `docs/plans/review-alignment-and-quality.md`; e2e: past years; minor; tests): In CI the carousel spec asserts nothing at all. In a seeded run, a query or builder regression that loses the past edition's album renders the placeholder: odunde.spec takes its empty branch and every carousel test skips, so the suite stays green while the page lost its photographs. Verified by reading both specs and the seed counts album.spec and gallery.spec rely on.

**Evidence:** packages/web/e2e/carousel.spec.ts:15, 139 and 162 skip whenever no oy-photo-carousel renders, keyed to the element rather than PLACEHOLDER_PROJECT; packages/web/e2e/odunde.spec.ts:177-183 accepts the placeholder whenever no slide renders; the seed holds Odunde 2026 (43 photographs) and Gala 2025 (6); packages/web/README.md:69-70 asks every spec to assert something in both branches; docs/runbook.md:349-351 records the skip

**What to build:** Skip on PLACEHOLDER_PROJECT and assert the placeholder line there; in seeded runs assert the carousel and at least two slides on /odunde and /gala before the behaviour checks. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
