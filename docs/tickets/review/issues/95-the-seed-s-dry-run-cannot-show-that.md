# 95: The seed's dry run cannot show that nothing is due, though the migration day relies on it

Labels: infra
Status: open
Blocked by: none

**Finding** (R95 in `docs/plans/review-alignment-and-quality.md`; packages/content (seed); minor; docs): After a migration day the owner is told to check the seed's dry run, but a real run would still fill or unset fields the dry run never mentions, and the "would write" line lists every seed document whatever is due. The check reads as a guarantee it cannot give.

**Evidence:** packages/content/scripts/seed.ts:202-215 prints every seed document by type as "would write" and counts only the revisions due; it never computes the missing fields it would fill or the retired fields it would unset. seed.ts:5 promises "print what would be written"; docs/runbook.md:272 (Migrations, step 6) checks that "bun seed -- --dry-run reports nothing due". docs/runbook.md:236-239 says nothing else is ever removed, but two revisions unset header actions (packages/content/scripts/seed-data.ts:1037-1043).

**What to build:** Have the dry run report, per document, the fields it would fill, the retired fields it would unset and the revisions due, with counts of documents it would create or patch; correct the runbook's removal sentence. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
