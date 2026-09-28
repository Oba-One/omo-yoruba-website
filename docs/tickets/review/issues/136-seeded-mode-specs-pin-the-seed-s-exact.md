# 136: Seeded-mode specs pin the seed's exact words, titles and counts in the dataset members now edit

Labels: infra
Status: open
Blocked by: none

**Finding** (R136 in `docs/plans/review-alignment-and-quality.md`; e2e: seeded mode; minor; tests): The first real album, a new hero heading or a published price turns the local seeded run red without any defect, which trains people to ignore it just as members start editing. Verified by reading the three specs against the seed and the runbook's dataset facts.

**Evidence:** packages/web/e2e/home.spec.ts:44 decides the mode from the hero heading's seeded words and :51 fails on any dollar figure on the homepage; gallery.spec.ts:60-69 expects exactly three albums with 43, 6 and 19 photographs; album.spec.ts:11-19, 83-84 and 93 pin Gala 2025's keys and six photographs; the site and the Studio read development (docs/runbook.md:90-93), where open-work E19 and C3 add real albums and C2 changes the homepage

**What to build:** Use PLACEHOLDER_PROJECT for the mode, check shapes and order rather than the seed's values (as expectNoMockWhileOwed already does for mocks), and point fixed-content specs at seed-owned documents or a separate e2e dataset. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
