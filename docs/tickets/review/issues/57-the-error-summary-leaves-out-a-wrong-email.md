# 57: The error summary leaves out a wrong email when a required field is also missing

Labels: infra
Status: open
Blocked by: none

**Finding** (R57 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, packages/web; minor; consistency): CONTEXT.md defines the summary as the one sentence naming what is missing or wrong, and the focused alert is what a screen reader hears, so the email problem only surfaces on the second send. The field sentences are right.

**Evidence:** scratchpad chrome/served-open.mjs, a no-JS POST of the member form with a city and 'ade@example' (status 400, nothing written): summary 'We still need your full name. Nothing you typed has been cleared.' while the email field reads 'That email address does not look right. Check it and send again.'. packages/web/src/lib/forms/result.ts:58-60 uses the missing list whenever it is not empty; the script does the same (EnquiryModal.astro:369-376).

**What to build:** When both apply, add the email sentence to the summary so the alert names everything to fix. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
