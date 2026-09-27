# 93: Wording to check opens a report, not the document to fix, and names the field by its code path

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R93 in `docs/plans/review-alignment-and-quality.md`; packages/content (lint report, To do); minor; judgement): Every other To do row opens the document that owes it (studio/todo-list.ts:194-229); a wording row opens a read-only report that names a document by title and a field by a path. A member has to search for the document and guess the field, against ADR 0042's Studio in the site's words.

**Evidence:** packages/content/src/schema/documents/content.ts:1019-1032 keeps documentId and documentType as strings hidden from members, so a report links nowhere; a finding's path is the walk's code path (packages/content/functions/content-lint/lint.ts:119, :137), shown as its subtitle (content.ts:1070), for example planYourVisit[fact-1].value or whatItIs[b1].

**What to build:** Give the report a weak reference to its document so the Studio links it (or add a document view with an intent link), and write the field as the Studio titles it rather than as a code path. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
