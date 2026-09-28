# 36: With the timeline hidden, How it began and the board sit on the same white ground, 176px apart

Labels: design, later
Status: open
Blocked by: none

**Finding** (R36 in `docs/plans/review-alignment-and-quality.md`; /our-story (grounds while the timeline is hidden); polish; drift): Every other page alternates white and tint, and this page did too with its timeline. The site hides the timeline by default until its entries are confirmed, so the break in rhythm is what visitors see today. It follows the prototype's hidden variant, which the prototype never showed by default.

**Evidence:** test-results/review/site/measure-all.json story@1440: section#origin white, pt 88, pb 88, then section#board white; capture story-origin-board-1440.png. The prototype hides the timeline the same way (docs/design/design/15 People and History.dc.html:26-27, 63), where the timeline section is the tint between them.

**What to build:** While the timeline is hidden, alternate the remaining grounds (board on the tint, staff white, contact on the tint, take part white), or settle D21 and show the timeline. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work D21; this ticket adds the review's evidence.

## Comments
