# 92: A lint report outlives its document, and members see it in Wording to check with no way to clear it

Labels: bug
Status: open
Blocked by: none

**Finding** (R92 in `docs/plans/review-alignment-and-quality.md`; packages/content (content-lint, To do); minor; correctness): When a member deletes or unpublishes a document whose report has findings, the report stays in the To do's Wording to check for everyone, members included, until an administrator finds and deletes it. The code acknowledges this in a comment, but nothing clears it and no guide says to. Latent: development holds no lint reports yet, since the function is not deployed (D16).

**Evidence:** sanity.blueprint.ts:20-28 runs content-lint on create and update only; packages/content/src/studio/todo.ts:204-206 counts every report with findings; packages/content/src/studio/document-options.ts:38-42 lets only an administrator delete one ("the function never removes it"). docs/runbook.md:290-292 (Functions) does not mention the manual delete. The Blueprint's event names include delete.

**What to build:** Add delete to the function's events and remove lint-<id> when its document goes, or narrow wordingFilter to reports whose document still exists; say so in the runbook. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
