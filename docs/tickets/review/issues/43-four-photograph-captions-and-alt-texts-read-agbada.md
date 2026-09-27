# 43: Four photograph captions and alt texts read `agbada` without its marks

Labels: content
Status: open
Blocked by: none

**Finding** (R43 in `docs/plans/review-alignment-and-quality.md`; /gallery/[album] (photograph captions and alt text in development); minor; content): AGENTS.md asks for full diacritics on every Yoruba word; four photographs on the album pages and in the Lightbox read `agbada` bare, in the caption a visitor sees and the alt text a screen reader speaks. The seed marks new captions correctly, so only a revision reaches the stored ones.

**Evidence:** bun run --filter @oy/content query on development: the Odunde 2026 and Gala 2025 albums hold `an elder in a pale aṣọ òkè agbada`, `an elder in white agbada`, `six guests in agbada, gèlè` and `a man in embroidered agbada` as both caption and alt; packages/content/scripts/register.ts:71-80 (markCaption) marks them as agbádá today, so they were seeded before the term joined packages/lint/yoruba-terms.json:14, and the seed never revises a value it wrote.

**What to build:** Add seed revisions (ADR 0035) for the four captions and alt texts, from the bare to the marked spelling, and run bun seed on development; the album pages and the Lightbox then read agbádá. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
