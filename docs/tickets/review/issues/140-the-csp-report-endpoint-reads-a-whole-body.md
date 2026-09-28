# 140: The CSP report endpoint reads a whole body before its 32 KB cap when no length is sent, and anyone can write 20 log lines a request

Labels: bug, later
Status: open
Blocked by: none

**Finding** (R140 in `docs/plans/review-alignment-and-quality.md`; /api/csp-report; polish; correctness): A chunked body without a length is read in full (bounded only by Vercel's 4.5 MB request limit) before the cap applies, and the batch cap still lets any client write 20 lines per request into the function logs. Low stakes while the policy is report-only. Verified by reading the route.

**Evidence:** packages/web/src/pages/api/csp-report.ts:36-42 checks content-length, then reads the full text and compares its UTF-16 length; :47-50 logs up to 20 reports per request; docs/runbook.md:453-454 says it caps a body at 32 KB

**What to build:** Read the stream with a byte counter and stop at 32 KB, and log one summary line per request (or sample) since the endpoint is public. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
