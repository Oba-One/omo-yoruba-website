# 09: Dataset export and a migration runner

Labels: infra
Status: open
Blocked by: none

**What to build:** The mechanism for every stored change in part 5 (ADR 0035, ADR 0042).

- [ ] `scripts/export.ts`: an NDJSON export outside the repo; `.gitignore` guards
- [ ] `scripts/migrate.ts` and `scripts/migrations/`: pure plans, dry run by default, conflicts and drafts block apply, a before-snapshot, an empty re-plan after apply, `restore`
- [ ] A Migrations section in the runbook
- [ ] Tests on seed fixtures
- [ ] `bun check` green; Playwright unchanged in both data modes

## Comments
