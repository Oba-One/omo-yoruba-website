# 121: The no-lift test checks two selectors, so a lift or photo zoom added anywhere else passes; one assertion is duplicated

Labels: infra
Status: open
Blocked by: none

**Finding** (R121 in `docs/plans/review-alignment-and-quality.md`; packages/tokens (index.test.ts); minor; tests): AGENTS.md forbids a hover lift and a photo zoom anywhere, and the test's name claims that, but it would stay green if .oy-zone:hover or a component added a transform. A manual sweep today finds none, which makes this the right moment to lock it.

**Evidence:** packages/tokens/src/index.test.ts:66-72 (only .oy-btn:hover and .oy-card:hover, .oy-path:hover); :47-48 (the same not.toMatch(/images\/patterns/) twice); no check reads the components' scoped styles

**What to build:** Sweep every :hover rule in the port and in the .astro styles for translate, scale or box-shadow (allowing the arrow slide and the rule draw) and fail on any other; delete the duplicate line. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
