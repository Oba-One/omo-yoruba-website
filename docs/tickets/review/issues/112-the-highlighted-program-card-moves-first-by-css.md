# 112: The highlighted program card moves first by CSS order, so tab and reading order differ from what is seen, the pattern ADR 0025 rejected

Labels: bug
Status: open
Blocked by: none

**Finding** (R112 in `docs/plans/review-alignment-and-quality.md`; ProgramCard, NewsCard; minor; a11y-perf): With highlight set to the Collective, the Collective card is drawn first but its quiet link is reached after the Lessons card's, a WCAG 2.4.3 and 1.3.2 mismatch for keyboard and screen reader users. The repo already decided the lead take-part row moves in the markup for this reason; the program highlight and the news date kept the prototype's CSS order.

**Evidence:** packages/ui/src/cards/ProgramCard/ProgramCard.astro:99-105 (order: -1 under .oy-home[data-highlight]); packages/web/src/lib/sanity/homepage.ts:86-88 sets data-highlight but never reorders the programs; docs/adr/0025-take-part-rows-live-on-the-page-singleton.md:9-11 and docs/tickets/phase-5/spec.md:52 require moving in the markup; NewsCard.astro:59-61 moves the date above the kicker and title the same way Also: packages/ui/src/cards/ProgramCard/ProgramCard.astro:99-105 ports the prototype's order:-1 (docs/design/design/02 Homepage.dc.html:40). In Storybook pages-homepage-highlight--collective at 1440 (test-results/review/home-events/stories/story-home-highlight-collective-1440.png) the DOM order is Lessons (x 552), Collective (x 194), Kids & STEM (x 910), so Tab goes middle card, left card, right card. packages/web/src/lib/sanity/homepage.ts:117 passes the programs in Studio order.

**What to build:** Put the highlighted program first in buildHomepage's list and drop the order rule from ProgramCard; render NewsCard's date before the kicker in the markup. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
