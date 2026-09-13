# 02: One route map for editions and programs, and the Phase 4 leftovers

Labels: later
Status: resolved
Blocked by: none

**What to build:** the page an edition's kind or a program's page opens is answered by one helper in
`@oy/content/routes`, which `newsHref`, the Presentation resolvers and `EventBand` all read, so an
edition of kind `other` resolves the same everywhere (wayfinder ticket 34, item 1). With it, the
rest of ticket 34: the program resolver lists the homepage only for the first three by order, the
dead `.v2-cta--*` rules leave the tokens, and the `EventBand` story no longer shows a date no
dataset holds.

- [x] `editionRoute` and `programRoute` with tests, including kind `other` and a program without a page
- [x] `newsHref`, `presentation.ts` and `EventBand` import it; their tests still pass
- [x] Program locations: left listing the homepage for every program (see the comment)
- [x] `.v2-cta--*` removed from `packages/tokens/src/oy-components.css`; the `EventBand` filled story was already marked illustrative
- [x] Wayfinder ticket 34 resolved with a pointer in the map

## Comments

12 September 2026. The two helpers live beside `TYPE_ROUTES` and answer only routes the map lists
for the type (a test pins it). The Presentation event resolver no longer defaults an unknown kind to
`/odunde`; the program resolver prepends the program's own page when the map does not list it. The
"first three programs" location stayed: a `select` resolver runs through the preview store and cannot
query the other programs, and the function form would replace every resolver (wayfinder ticket 34's
answer). Tests: `routes.test.ts`, `presentation.test.ts`, `homepage.test.ts`, `EventBand.test.ts`.
