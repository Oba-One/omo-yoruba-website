# 134: The runbook's cache checks use HEAD requests, which the middleware never caches, and read headers the CDN strips

Labels: infra
Status: open
Blocked by: none

**Finding** (R134 in `docs/plans/review-alignment-and-quality.md`; runbook: cache checks; minor; docs): A HEAD is its own cache entry on Vercel and the middleware answers it uncached every time, so the second curl -sI reads MISS, never HIT, and the draft-mode comparison cannot show the function's headers either way. Open-work E1's remaining step (prove a publish purges a page) would follow these commands. Verified against the middleware rule and the research note's cache key; not run against the deployment.

**Evidence:** docs/runbook.md:184-186 and 218-221 use curl -sI (a HEAD) and expect HIT on the second request and the Vercel-CDN-Cache-Control header in the answer; packages/web/src/lib/cache-policy.ts:35 marks anything but GET uncacheable, and Vercel's cache key includes the method (docs/research/phase-4-astro-cache-and-vercel-provider.md:180); docs/runbook.md:221-223 says those headers never reach a client

**What to build:** Use a GET that prints the headers (curl -s -o /dev/null -D - https://<host>/) for x-vercel-cache, and read Vercel-CDN-Cache-Control and Vercel-Cache-Tag from the runtime logs as lines 221-223 say; or let HEAD follow GET in uncacheableReason. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
