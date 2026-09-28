# 126: Some ideas are built or named two ways: the card shell, the page root, card-or-row, the empty-state wording prop and the gold flag

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R126 in `docs/plans/review-alignment-and-quality.md`; packages/ui (one way to do each thing); polish; judgement): Baseline smells, not defects. Each second name or copy makes the next agent guess which one is current.

**Evidence:** EnquiryCard.astro:54-75 writes the .oy-card shell by hand instead of Card (no margin reset, no .v2-card hover); HomeRoot.astro and PageRoot.astro are the same story-only root (PageRoot.astro:6-7); DoorCard.astro:39 layout: 'card' | 'row' vs OutcomeCard.astro:31 variant: 'card' | 'row'; StatStrip.astro:31-32 what vs pending on FactList, Timeline, EntryList, AlbumGrid; PathRow.astro:35-38 takes both primary and variant; NotFound.astro:13-16 names its links Door, the CONTEXT term for a Get Involved entry point (CONTEXT.md:129-133)

**What to build:** Build EnquiryCard on Card, fold HomeRoot into PageRoot, settle on one prop name per idea (layout for card or row, pending for a list's empty line, variant for the button) and rename NotFound's type to a link. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
