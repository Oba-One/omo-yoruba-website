# 96: An apply that commits but then fails to read the new revisions leaves a snapshot that restore refuses for the wrong reason

Labels: bug
Status: open
Blocked by: none

**Finding** (R96 in `docs/plans/review-alignment-and-quality.md`; packages/content (migration runner); minor; correctness): The runner is the owner's safety net on a migration day (runbook, Migrations, step 5). After a network blip following the write, the tool reports that nothing was written and refuses to restore while the dataset holds the migrated shape. The window is small, but it is the failure the snapshot exists for, and the orchestration in migrate.ts has no test (snapshot.test.ts covers the pure half).

**Evidence:** packages/content/scripts/migrate.ts:116-137 writes the snapshot, commits the transaction, then reads the revisions with no catch; if that read throws, the file keeps entries without after and the process exits. packages/content/scripts/migrations/snapshot.ts:76-77 then answers "the apply never finished, so there is nothing to put back" for every entry, though the transaction committed. A process stopped while client.mutate is in flight leaves the same file, with the transaction possibly committed.

**What to build:** Retry the revisions read and, if it still fails, record that the apply committed; in restore, treat a missing after by comparing each document's current revision with before._rev (unchanged: nothing was written; changed: say so and restore on request) instead of assuming nothing was written. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
