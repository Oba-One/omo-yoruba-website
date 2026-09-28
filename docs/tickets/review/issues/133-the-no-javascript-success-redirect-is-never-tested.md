# 133: The no-JavaScript success redirect is never tested in CI, though a filled honeypot would test it without writing

Labels: infra
Status: open
Blocked by: none

**Finding** (R133 in `docs/plans/review-alignment-and-quality.md`; middleware: the no-JavaScript success path; minor; tests): The redirect after a successful POST (ADR 0019's guard against a refresh re-posting) and the server-rendered success block are exercised only when someone runs the suite with E2E_WRITE against development. The honeypot path answers ok through the same middleware branch in both data modes and writes nothing, so the branch can be covered on every CI run. Verified by reading the spec, the middleware and the handler.

**Evidence:** packages/web/e2e/no-js.spec.ts:52-53 skips unless E2E_WRITE is set; the 303 branch in packages/web/src/middleware.ts:44-56 has no unit test (no test file mentions the middleware); packages/web/src/lib/forms/handlers.ts:131 answers success for a filled honeypot before any Sanity call; the field is packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:160

**What to build:** Add a no-JavaScript spec that fills the website honeypot and submits, asserting the 303 to ?enquiry=<kind>&sent=1#enquiry and the success block, in both data modes; keep the E2E_WRITE spec for the real write. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
