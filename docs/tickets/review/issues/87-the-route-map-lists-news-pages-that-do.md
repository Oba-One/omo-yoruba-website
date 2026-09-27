# 87: The route map lists News pages that do not exist, so Presentation opens a 404 for a news post

Labels: bug
Status: open
Blocked by: none

**Finding** (R87 in `docs/plans/review-alignment-and-quality.md`; packages/content (route map, Presentation); minor; correctness): A member editing a news post in the Presentation tool is offered two locations that answer 404 before the homepage, and every edition lists /news as well. The webhook also purges the two missing paths on each post publish (harmless noise). presentation.test.ts:13-24 requires a main document for every listed route, which keeps the dead routes pinned.

**Evidence:** packages/content/src/routes.ts:19-20 (/news and /news/[slug] in PUBLIC_ROUTES), :136 (event reaches /news), :149 (newsPost reaches /news/[slug] and /news); packages/content/src/studio/presentation.ts:117-125 leads a post's locations with /news/<slug>, then /news, and :79 lists /news for site settings; packages/web/src/pages has no news route; docs/adr/0023-homepage-follows-its-prototype.md:65 says no post page is planned until ticket 08.

**What to build:** Take /news and /news/[slug] out of PUBLIC_ROUTES and TYPE_ROUTES until the News page is built (D22), so a post locates on the homepage only; add a web test that every static public route has a page file. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
