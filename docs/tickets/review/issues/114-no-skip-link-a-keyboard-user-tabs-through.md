# 114: No skip link: a keyboard user tabs through the logo and eight nav controls on every page before the content (judgement)

Labels: bug
Status: open
Blocked by: none

**Finding** (R114 in `docs/plans/review-alignment-and-quality.md`; SiteNav; minor; a11y-perf): Landmarks meet WCAG 2.4.1 technically, but sighted keyboard users (the elder test's audience) get no bypass. Judgement call: the handoff never asked for one, yet every page already carries the id.

**Evidence:** packages/ui/src/navigation/SiteNav/SiteNav.astro:34-95 (no skip link); every route wraps its content in <main id="main"> (git grep in packages/web/src/pages: 13 of 13), a target nothing links to

**What to build:** Add a visually hidden 'Skip to the content' link to #main as the nav's first child, shown on focus. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
