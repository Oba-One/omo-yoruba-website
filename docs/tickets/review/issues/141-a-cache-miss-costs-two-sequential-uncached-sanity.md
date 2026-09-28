# 141: A cache miss costs two sequential uncached Sanity reads, and a tracking query string (fbclid, utm) makes every social click a miss

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R141 in `docs/plans/review-alignment-and-quality.md`; Caching: cache misses; polish; judgement): Every miss pays two live API round trips in series before the first byte, and Facebook adds a unique fbclid to every outbound click, so visitors from social posts always land on a miss. This feeds open-work E12's mobile LCP. A judgement call on architecture; verified by reading the render order and the queries.

**Evidence:** the page query (for example packages/web/src/pages/index.astro:36) completes before the layout's settings read starts (packages/web/src/layouts/SiteLayout.astro:68-72), both with useCdn false (load-query.ts:37); seven page queries already project settings fields (packages/content/src/queries/trust-pages.ts:29-33, 103-107, 143-148, 181; gallery.ts:28 and 68; program-pages.ts:67); Vercel's key includes the query string for function responses (docs/research/phase-4-astro-cache-and-vercel-provider.md:180-181)

**What to build:** Start the settings read in the middleware and hand the promise to the layout through locals so the two reads overlap; decide with the owner whether cached pages should ignore known tracking parameters (analytics reads utm from the landing URL). Size M. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
