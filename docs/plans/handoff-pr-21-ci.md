# PR 21 CI repair

[PR 21](https://github.com/Oba-One/omo-yoruba-website/pull/21) is attached to the
Codex session. Its title is now `feat(admin): clarify Studio names and remove news`.

The only failed check at head `03ab3d6` was Commit messages and PR title. The job
log rejected the original title because it lacked a conventional commit prefix.
Both commit messages passed, as did every other reported check, including the
web build, TypeGen, Storybook, Playwright and axe, and Lighthouse.

The corrected title and both commits pass `scripts/check-commits.sh` against base
`7809ca3`. This handoff commit triggers a fresh CI run with the corrected title.
Check the PR for the resulting status.

The application code and the post-merge content work described in the PR remain
outside this CI repair. Follow the PR's existing migration and schema deployment
instructions after merging, with the owner's authorization.

Suggested skills for follow-up: pragmatic-programming for further CI diagnosis,
humanize-writing for documentation, and oy-content-ops for the migration.

## Post-merge completion

The owner authorized merging and deletion and confirmed they were out of Studio.
All PR checks passed at `ede8a48`. PR 21 merged as `28a75f6`, and the local checkout
is on that commit on `main`. Vercel deployment
`dpl_BMFwgz6bc7FQbbzUUf6PqpxQes5H` is READY, targets production, and names that
exact merge commit. The production aliases include `omo-yoruba-khaki.vercel.app`.

After the production deployment, the refreshed backup rehearsal and live dry
run again targeted exactly `news-odunde-2026-recap`,
`news-end-of-year-gala-2026`, `news-language-lessons-fall-term`, and `newsPage`,
with no blockers. `retired-types --apply` deleted those four documents on
`development` in one transaction with four revision guards and four deletes.
Its immediate verification and a separate live dry run both reported zero
remaining mutations. `retired-fields` also reports zero mutations.

The seed dry run passes: all 68 photographs are already uploaded, and it would
revise zero earlier seed values. Its general "would write" summary lists the
seed documents and does not mean those documents are missing. No seed write was run.
Production homepage HTTP 200; `/news` HTTP 404. The homepage HTML contains no
News link or News & events section.

The refreshed private backup holds 128 documents and zero content drafts:
`/private/tmp/omo-yoruba-pr-21.uu7676/development-2026-09-30T21-02-19-905Z.ndjson`.
The migration's four-document restore snapshot is
`/private/tmp/omo-yoruba-pr-21.uu7676/development-retired-types-2026-09-30T21-02-53-941Z.before.ndjson`.
The earlier preparation backup remains in the same private directory. These
files contain private data; do not print their contents or commit them. Follow
the runbook's migration-day retention rule. If restoration is necessary, use
`bun run migrate -- restore <snapshot>`; it refuses if any target has changed.

The owner reports running
`bun run --filter @oy/content sanity -- schema deploy`. A read of
`_.schemas.omo-yoruba` confirms its update time is `2026-09-30T22:36:06Z`, after
the merge and migration. The post-merge schema refresh is complete. Keep the
confirmed name Yoruba Cultural Collective unless the owner explicitly changes it.

The next planned priority is week 3 member readiness (`prompt-week-3.md`): the
missing `docs/content-ops.md` guide, an Editor account usability test, and the
organization's confirmed facts and routing contacts. The plans still contain
obsolete news tasks, and open-work S16 and S17 still need their completion status.

This completion update is saved locally in the handoff and has not been committed
or pushed. No further application changes are needed for the migration.
