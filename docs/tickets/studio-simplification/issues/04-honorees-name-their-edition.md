# 04: Honorees, tiers and levels name their Gala edition

Labels: infra
Status: resolved
Blocked by: 01

**What to build:** S5. An honoree must name a Gala edition, ticket tiers and sponsor levels pick only Gala editions, and their previews show the edition. Nothing stored changes.

- [x] `honoree.event` required, filtered to Gala editions, with no new documents from the picker
- [x] Tier, level and honoree previews show the edition (a level with none shows its scope)
- [x] The honoree presence count counts only honorees tied to a Gala edition
- [x] Tests
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/simplify`. The three edition pickers share one `galaEdition` helper; a tier and an honoree each say which Gala edition to choose when it is missing. Checks at the part 4 pull request: `bun run test` 147 files and 898 tests, typecheck clean, `bun typegen` no diff, `bun run build` green; Playwright with `--workers=1` seeded 281 passed and 11 skipped, placeholder 254 passed and 38 skipped, both equal to `main`.
