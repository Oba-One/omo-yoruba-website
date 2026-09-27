# 105: The enrol form offers the visitor's own name for the learner

Labels: bug, later
Status: open
Blocked by: none

**Finding** (R105 in `docs/plans/review-alignment-and-quality.md`; packages/content (enquiry spec); polish; a11y-perf): WCAG 1.3.5 asks for autocomplete on fields that collect the user's own data; the learner is often a child, so the hint invites the wrong value in a required field.

**Evidence:** packages/content/src/enquiry-kinds.ts:396 gives autocomplete name to learner (field at :284) as well as to guardian (:299), so a parent enrolling a child is offered their own name in both.

**What to build:** Leave learner without an autocomplete token, keeping name on guardian and the other forms' own-name fields. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
