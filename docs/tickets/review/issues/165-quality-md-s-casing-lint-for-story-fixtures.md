# 165: QUALITY.md's casing lint for story fixtures is not wired; only the Studio runs it

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R165 in `docs/plans/review-alignment-and-quality.md`; packages/lint; polish; tests): A gate the spec claims does not exist in the repo; nothing breaks it today, so this is about the claim, not a defect. Verified by reading the CLI and scanning the fixtures with findTitleCase.

**Evidence:** docs/design/QUALITY.md:28-30 asks for sentence case on headings and button labels in fixtures and Sanity content. packages/lint/src/cli.ts:119-128 offers dash, yoruba, colors and commit-msg only; findTitleCase is used only by packages/content/src/validation/checks.ts:41. docs/plans/handoff-phase-0.md:77 deferred it to Phase 2, which wired the Studio half. A one-off scan of the heading, title and label strings in packages/ui/src/fixtures found no Title Case today.

**What to build:** Add a case check over the fixture files' heading, title and label strings to the CLI and lefthook, or record in open-work that the Studio half is enough. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
