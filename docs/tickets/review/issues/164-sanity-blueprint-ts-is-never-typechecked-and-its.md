# 164: sanity.blueprint.ts is never typechecked, and its test checks the function filter in one direction only

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R164 in `docs/plans/review-alignment-and-quality.md`; sanity.blueprint.ts, root configs; polish; tests): A typo in a defineDocumentFunction option or a stale type left in the filter would surface only at 'bunx sanity blueprints deploy'. Verified by listing the tsconfig includes and comparing the two type lists with a one-off script.

**Evidence:** The root has only tsconfig.base.json, and packages/content/tsconfig.json includes src, scripts, functions, sanity.config.ts and sanity.cli.ts, so bun run check never typechecks sanity.blueprint.ts or the root vitest.config.ts. packages/content/functions/content-lint/lint.test.ts:169-178 reads the blueprint as text and checks that every LINT_TYPES entry is in the filter, not the reverse; the enquiry-notify filter has no test. Today the two lists match (29 types each).

**What to build:** Add a root tsconfig.json covering the two root files and run it from bun run check, and assert that the filter's types equal LINT_TYPES. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
