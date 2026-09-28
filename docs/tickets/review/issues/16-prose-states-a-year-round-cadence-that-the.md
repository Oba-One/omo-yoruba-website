# 16: Prose states a year-round cadence that the cards and the year strip show as Pending

Labels: content
Status: open
Blocked by: none

**Finding** (R16 in `docs/plans/review-alignment-and-quality.md`; /programs, /programs/cultural-collective; minor; content): The register marks every program's cadence as invented and the pages rightly show the cadence chips, but the seeded prose repeats the same claim in words, so a family reads that Àgbàlá Ọmọde runs through the year while the card beside it says the cadence is owed. The seed already removed "monthly" and "robotics" from the same sentences, so these read as oversights.

**Evidence:** seed-data.ts:636 (Kids & STEM: "Àgbàlá Ọmọde ... runs at the Odunde Festival and through the year"), :644 (Àgbàlá Ọmọde: "at the festival and through the year"), :779 (/programs/cultural-collective header: "host events through the year"). The same pages show "Pending: the cadence" on the Kids & STEM and Collective cards, "Pending: when it runs" for both in the year strip, and "Pending from you: the next Collective events"; packages/content/src/pending.ts:430 says "Year-round" is invented.

**What to build:** Cut "and through the year" from the two Kids & STEM lines and "host events through the year" from the Collective line until the owner confirms the cadence (T40), or have the owner confirm them. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work C6 (T40 covers the cards and year strip, not the prose); this ticket adds the review's evidence.

## Comments
