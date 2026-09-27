# 106: The four page-list queries still read the retired documents, and nothing tracks removing that after the migration day

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R106 in `docs/plans/review-alignment-and-quality.md`; packages/content (queries); polish; docs): Transitional code is right until the migration runs, but with no row it will outlive it; until then the To do's list rows also count each reference item as owing every field (a reference holds none). Development still holds the Collective's two initiatives as references and two editions still name their albums.

**Evidence:** packages/content/src/queries/program-pages.ts:91-104 and trust-pages.ts:57-65, :127-130, :175-178 read each item as a reference or an object (coalesce(@->, @)); docs/tickets/studio-simplification/issues/10-page-lists.md:12 and :21-23 say a follow-up drops the reference reading after the migration day, but ticket 10 is resolved and docs/plans/open-work.md:105 marks S14 done with no row for it.

**What to build:** Add an open-work row or ticket for the post-migration cleanup: drop the reference reading from the four queries, run bun typegen, and retire the MOVED_FIELDS entries once their migrations have run. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
