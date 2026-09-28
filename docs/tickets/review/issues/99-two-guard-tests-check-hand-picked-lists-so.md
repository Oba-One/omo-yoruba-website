# 99: Two guard tests check hand-picked lists, so the cases they exist for would pass

Labels: infra
Status: open
Blocked by: none

**Finding** (R99 in `docs/plans/review-alignment-and-quality.md`; packages/content (tests); minor; tests): Both lists are right today (checked by hand: every document type but those three is linted, and no retired path exists in the schema). The second matters most: retired-fields writes to every document of a type, so the list's safety rests on the test.

**Evidence:** packages/content/functions/content-lint/lint.test.ts:162-167 is named "lists every content type" but checks two types; a new content type left out of LINT_TYPES would never be linted and the manifest test (:169-178) would still pass. packages/content/src/schema/studio-words.test.ts:131-148 checks that 12 hand-listed paths are gone from the schema and retired, not every RETIRED_FIELDS entry, so a live field added to RETIRED_FIELDS (or a retired name reused) would be unset by the seed and by retired-fields on every run with no failing test.

**What to build:** Compare LINT_TYPES with documentTypes less enquiry, subscriber and lintReport; walk every RETIRED_FIELDS path against the schema and fail when one exists. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
