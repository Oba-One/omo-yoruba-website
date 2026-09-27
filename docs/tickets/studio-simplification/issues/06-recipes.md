# 06: Recipes that match the Studio

Labels: content
Status: resolved
Blocked by: 02, 03, 04

**What to build:** S6 (spec Q10). The recipes a member and an agent follow describe the simplified Studio.

- [x] `oy-release` rewritten: an edition prepared as drafts and published on the announce day
- [x] `oy-content-ops`: the Collective event, news post, album, teacher and timeline recipes
- [x] What part 5 changes later is flagged in each recipe
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/simplify`. From the code review: both recipes tell an agent to set `kind` itself (only the Studio's lists preset it), attendance is the festival's only, and the image rule says credits live on albums. Checks at the part 4 pull request: `bun run test` 147 files and 898 tests, typecheck clean, `bun typegen` no diff, `bun run build` green; Playwright with `--workers=1` seeded 281 passed and 11 skipped, placeholder 254 passed and 38 skipped, both equal to `main`.
