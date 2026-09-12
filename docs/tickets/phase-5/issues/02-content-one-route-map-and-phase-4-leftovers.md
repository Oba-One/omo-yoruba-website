# 02: One route map for editions and programs, and the Phase 4 leftovers

Labels: later
Status: open
Blocked by: none

**What to build:** the page an edition's kind or a program's page opens is answered by one helper in
`@oy/content/routes`, which `newsHref`, the Presentation resolvers and `EventBand` all read, so an
edition of kind `other` resolves the same everywhere (wayfinder ticket 34, item 1). With it, the
rest of ticket 34: the program resolver lists the homepage only for the first three by order, the
dead `.v2-cta--*` rules leave the tokens, and the `EventBand` story no longer shows a date no
dataset holds.

- [ ] `routeForEdition` and `routeForProgram` (or one helper) with tests, including kind `other` and a program without a page
- [ ] `newsHref`, `presentation.ts` and `EventBand` import it; their tests still pass
- [ ] Program locations: the homepage for order one to three only
- [ ] `.v2-cta--*` removed from `packages/tokens/src/oy-components.css`; the `EventBand` filled story is Pending-shaped or marked illustrative
- [ ] Wayfinder ticket 34 resolved with a pointer in the map

## Comments
