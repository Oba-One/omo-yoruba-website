# 03: Anyone can read unpublished drafts by setting the perspective cookie by hand; the enable route's secret gates nothing

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R03 in `docs/plans/review-alignment-and-quality.md`; packages/web draft mode; blocker; correctness): A visitor who sets sanity-preview-perspective=drafts and asks for any URL the CDN misses (any new query string) is served every draft the page's query reaches: an edition prepared as drafts for its announce day, unpublished news, draft people, draft settings, and draft albums whose photographs may still wait on consent (open-work D5), since the gallery and album queries list them and the image URLs follow from their asset references. The response is never cached, so this is disclosure, not cache poisoning. Verified by reading the loader, the cookie parser, the enable route and ADR 0021's claim, which the code contradicts.

**Evidence:** packages/web/src/lib/sanity/load-query.ts:47-55 reads with perspective drafts, the Viewer token and stega whenever the cookie names drafts or a release; packages/web/src/lib/sanity/preview.ts:40-54 checks only the value's shape; packages/web/src/pages/api/preview/enable.ts:29-38 is the only place the secret is checked, and it only sets that same plain cookie (httpOnly false, no signature, preview.ts:19-29); docs/adr/0021-route-cache-tags-and-draft-mode-opt-out.md:36-37 says drafts still need the signed enable route; packages/web/README.md:37-39 implies the same; docs/runbook.md:184 itself sets the cookie with curl; SANITY_PREVIEW_SECRET is declared (packages/web/astro.config.ts:124) and unread (docs/runbook.md:20)

**What to build:** Have /api/preview/enable also set an httpOnly cookie holding an HMAC of the perspective and an expiry keyed with SANITY_PREVIEW_SECRET, and read drafts in loadQuery (and mount the overlay) only when it verifies; keep the middleware refusing to cache any request that carries either cookie. Correct ADR 0021 and CONTEXT.md's Draft mode. Size M.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Fixed in pull request 17. The enable route also signs an httpOnly session (ADR 0044); a perspective cookie alone reads as published, proved in `draft-session.test.ts` and `navigation.spec.ts`.
