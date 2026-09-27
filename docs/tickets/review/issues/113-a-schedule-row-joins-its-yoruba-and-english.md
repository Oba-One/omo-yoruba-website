# 113: A schedule row joins its Yoruba and English halves into one string, so the Yoruba half is not marked lang="yo"

Labels: bug
Status: open
Blocked by: none

**Finding** (R113 in `docs/plans/review-alignment-and-quality.md`; ScheduleRow; minor; a11y-perf): Screen readers read the Yoruba half of every festival and Gala running-order row with English pronunciation rules (WCAG 3.1.2). Every other bilingual part in the library keeps the halves apart for this reason.

**Evidence:** packages/ui/src/content/ScheduleRow/ScheduleRow.astro:37 ([yo, en].join(' • ')), :44 (<b>{title}</b>), while the same row's zone tag is marked at :47; Kicker.astro:37, PhotoTile.astro:83, Hero.astro:112 and ProverbLine.astro:21 mark their Yoruba halves

**What to build:** Render the title as a span with lang="yo" for the Yoruba half, the gold dot hidden from assistive technology and a span for the English, as Kicker does. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
