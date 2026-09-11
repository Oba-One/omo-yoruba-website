# 10: TypeGen wired to bun typegen with a drift check in CI

Labels: infra
Status: resolved
Blocked by: 04, 05, 06

**What to build:** `bun typegen` runs `sanity schema extract` and `sanity typegen generate` from
`packages/content` through `sanity.cli.ts`, writing `schema.json` and `src/sanity.types.ts`, both
committed; a sixth CI job `TypeGen drift` regenerates them and fails when the committed files differ.

- [x] `bun typegen` succeeds offline (no project id needed) and is idempotent
- [x] `sanity.types.ts` exports a type per schema type and the query result types
- [x] The `TypeGen drift` job exists in `ci.yml`, is not path filtered, and its name is recorded in
      the runbook for the branch protection

## Comments

11 September 2026. `bun typegen` runs `sanity schema extract --force` and `sanity typegen
generate` through `scripts/sanity.sh`; `sanity.cli.ts` holds the typegen block. The job name for the
branch protection is `TypeGen drift`.
