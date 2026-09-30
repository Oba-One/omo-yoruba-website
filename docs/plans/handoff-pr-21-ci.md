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
