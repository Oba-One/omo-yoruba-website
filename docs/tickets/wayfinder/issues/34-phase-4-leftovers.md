# Phase 4 leftovers from the design review

Type: task
Status: open
Owner: no
Labels: later
Phase: 5
Blocked by: none

## Question

Small items the Phase 4 review recorded and left, none visible to visitors today:

1. The mapping from an edition's kind or a program's page to its route lives in three places:
   `newsHref` in `packages/web/src/lib/sanity/homepage.ts`, the resolvers in
   `packages/content/src/studio/presentation.ts`, and `COPY` in `EventBand.astro`. They already
   disagree on an edition of kind `other`. One helper in `packages/content/src/routes.ts`, which
   calls itself the one map, should serve all three; Phase 5 adds the event pages' routes, the
   natural moment.
2. The Presentation locations list the homepage for every program, although the homepage shows the
   first three by order (`TYPE_ROUTES.program` must keep `/` for the cache purge, so the fix belongs
   in the resolver).
3. The ported `packages/tokens/src/oy-components.css` keeps the prototype's `.v2-cta--*` hero
   button rules, which nothing uses since the highlight swap moved into `buildHomepage`.
4. The `Filled` story of `EventBand` shows a sample date (12 June 2027) no dataset holds; fixtures
   carry confirmed facts and Pending states only, so mark it illustrative or drop the date.
