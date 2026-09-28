# 100: The enquiry email function's handler is untested: no route, missing settings, send errors and the success patch

Labels: infra
Status: open
Blocked by: none

**Finding** (R100 in `docs/plans/review-alignment-and-quality.md`; packages/content (enquiry-notify); minor; tests): This is the one path by which an enquiry reaches a person, and notifyError is how the Inbox shows a failure (ADR 0015). The functions are not deployed yet (development holds four enquiries, none notified and none with an error; open-work D16), so the first real run will also be the first exercise of these branches.

**Evidence:** packages/content/functions/enquiry-notify/index.ts:20-94 has five outcomes (no route, missing ENQUIRY_FROM, missing RESEND_API_KEY, a send error, sent); only email.ts has tests (email.test.ts). Only the last two patches are locked to the event's revision (index.ts:85-92); the three notifyError patches are not (:47, :60-66, :72-75).

**What to build:** Take the client and the sender as parameters of an inner function and test each outcome: what is patched, whether it is locked to the revision, and that nothing is sent without a route. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
