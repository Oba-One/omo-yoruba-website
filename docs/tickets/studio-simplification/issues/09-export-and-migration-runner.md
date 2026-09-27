# 09: Dataset export and a migration runner

Labels: infra
Status: resolved
Blocked by: none

**What to build:** The mechanism for every stored change in part 5 (ADR 0035, ADR 0042).

- [x] `scripts/export.ts`: an NDJSON export outside the repo; `.gitignore` guards
- [x] `scripts/migrate.ts` and `scripts/migrations/`: pure plans, dry run by default, conflicts and drafts block apply, a before-snapshot, an empty re-plan after apply, `restore`
- [x] A Migrations section in the runbook
- [x] Tests on seed fixtures
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/restructure` (pull request B, stacked on pull request 12).
`bun run export` saves the dataset through Sanity's export endpoint to `OY_EXPORT_DIR` (else
`~/omo-yoruba-exports`) and refuses any folder inside the repository; `*.ndjson` is ignored by git.
`bun run migrate -- <name>` runs a plan from `scripts/migrations/` (a pure function over the published
documents a filter reads): a dry run by default, `--from <export>` to rehearse in memory with groq-js
evaluating the same filter, `--apply` to save a before-snapshot of every document it writes, write one
transaction guarded by each document's revision, and plan again, `restore <snapshot>` to put them
back. A conflict or a draft of a document it reads blocks `--apply`. The seed, the export and the
runner share one write access check (`scripts/dataset.ts`). The first migration is the generic
`retired-fields`, which unsets `RETIRED_FIELDS` on every document. Checked on `development`: the export
holds 129 documents, one of them the Presentation tool's preview secret under a draft id, and the dry
run and the rehearsal of `retired-fields` find nothing to do. Every migration's test applies its plan
to the seed and requires nothing left.
