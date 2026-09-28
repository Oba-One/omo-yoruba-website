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

27 September 2026, from the pull request B review (two reviewers: the runner and the migrations; the schema,
site and docs):

- A draft or release version blocks a plan when it still holds what the migration moves (planned alone,
  under the id it stands for, it gives work) or when it belongs to a document the plan writes; the runner
  reads the drafts and versions of every document it writes, since a page read by id is not read by its
  draft's id. Next year's edition prepared as a draft blocks nothing. `inline-lists` and `teacher-group`
  read their pages by type, so their drafts are read too.
- A snapshot names its dataset and, once applied, the revision each document was left with: `restore`
  refuses another dataset and anything changed since, and guards each replacement and delete by that
  revision. A failed transaction wrote nothing, says so, and its snapshot is removed.
- Deletes are guarded by the revision the plan read (`revisionGuard`, a patch that changes nothing).
- The seed and `retired-fields` share `MOVED_FIELDS`: the edition's album link waits for `album-link`,
  which also drops a link that names no album; a null field counts as empty.
- `inline-lists` removes the lint reports of the documents it moves, leaves `_system` behind and keys an
  item that had none by its document's id; the export refuses a stream that ends in an error line; the
  folder guard refuses a folder inside the repository whose name starts with two dots.
- The four list queries drop a reference that no longer resolves, as `[]->` did.
