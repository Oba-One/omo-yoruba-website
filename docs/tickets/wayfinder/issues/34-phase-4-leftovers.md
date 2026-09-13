# Phase 4 leftovers from the design review

Type: task
Status: resolved
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

## Answer

Resolved 12 September 2026 in Phase 5 (`docs/tickets/phase-5/issues/02-content-one-route-map-and-phase-4-leftovers.md`).

1. `editionRoute(kind)` and `programRoute(page)` in `packages/content/src/routes.ts` are the one map:
   `newsHref`, the Presentation resolvers and `EventBand` read them. An edition of kind `other` now
   has no page everywhere (the news card shows no Read more, the Presentation tool lists the map's
   order); a program without its own page leads with the Programs hub.
2. Left as it is, on purpose: a Presentation resolver that selects fields sees only its own document,
   so it cannot know whether a program is among the first three by order. The documented way to see
   the others is to replace the whole locations map with one function over the document store, a
   rewrite not worth a location banner. The comment on the resolver says so.
3. The `.v2-cta--*` rules are gone from `packages/tokens/src/oy-components.css`; its header lists them
   among the parts not ported.
4. The `Filled` story's description has said since it was written that its values are illustrative and
   come from no dataset; it stays, as the only story of a dated band.
