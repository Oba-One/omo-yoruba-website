# 20: Chips under labelled facts do not name the fact: Àgbàlá Ọmọde's Ages asks for 'ages and what they build', the Lessons Ages for 'a glance fact'

Labels: content, later
Status: open
Blocked by: none

**Finding** (R20 in `docs/plans/review-alignment-and-quality.md`; /programs Kids & STEM, /programs/yoruba-lessons at a glance; polish; content): Spec Q3 chose the shared wording so every chip reads true, but ADR 0031 says Àgbàlá Ọmọde builds nothing, so its chip asks for something it will never have. ADR 0031 split Cultural Exchange's row per fact for exactly this reason. Both wordings match the registry today, so the wording is the owner's call.

**Evidence:** packages/web/src/lib/sanity/programs-page.ts:61 gives every sub-program fact the one wording from packages/content/src/pending.ts:416-421 ('ages and what they build'), so Àgbàlá Ọmọde's only fact (Ages, packages/content/scripts/seed-data.ts:651) shows it (test-results/review/programs/s10-1440-section-kids.png); the Lessons glance's empty Ages shows 'a glance fact' (pending.ts:451-456, s11-1440-main-nth-child-2.png).

**What to build:** Let a free fact's chip name its own label ('the ages', 'what they build'), or split the rows per label as ADR 0031 did for Cultural Exchange. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
