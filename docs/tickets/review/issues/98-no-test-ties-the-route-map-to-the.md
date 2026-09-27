# 98: No test ties the route map to the page queries or to the pages that exist

Labels: infra
Status: open
Blocked by: none

**Finding** (R98 in `docs/plans/review-alignment-and-quality.md`; packages/content (queries, route map); minor; tests): The cache purge, the type tags and the Presentation locations all rest on a hand-kept map; a type added to a page query without its route leaves that page stale for up to a day after a publish. I checked the twelve page queries, the album query and the settings query by hand: today every type they read is listed for their route.

**Evidence:** packages/content/src/routes.test.ts checks the map's shape; its tag test (:143-148) compares tagsForRoute with cacheTagsFor, both derived from TYPE_ROUTES, so it cannot fail on a type a page reads but the map omits. Nothing reads the page queries' _type filters and -> targets, and nothing checks PUBLIC_ROUTES against packages/web/src/pages (how /news stayed listed).

**What to build:** Add a test that parses each page query with groq-js (already a devDependency), collects _type == filters and dereferenced types (targets from schema.json), and asserts each is in TYPE_ROUTES for the query's route; add a web test that each static public route has a page file. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
