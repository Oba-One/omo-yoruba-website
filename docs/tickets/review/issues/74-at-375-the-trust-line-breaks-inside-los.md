# 74: At 375 the trust line breaks inside 'Los Angeles'

Labels: design, later
Status: open
Blocked by: none

**Finding** (R74 in `docs/plans/review-alignment-and-quality.md`; SiteFooter; polish; drift): The single-line wording follows CONTEXT.md's trust line, which is right, but on a phone the city splits across lines on every page.

**Evidence:** scratchpad chrome/footer2.mjs at 375: rows '501(c)(3) nonprofit since 1997 • EIN XX-XXXXXXX • Los' and 'Angeles, CA' (test-results/review/chrome/footer-site-impact-375-full.png); the prototype breaks after the EIN. SiteFooter.astro:82-83.

**What to build:** Keep each segment whole (a no-wrap span per segment, or a non-breaking space in 'Los Angeles, CA') so the line wraps at a bullet. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
