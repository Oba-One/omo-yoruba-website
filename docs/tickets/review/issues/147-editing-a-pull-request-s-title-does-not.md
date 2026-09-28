# 147: Editing a pull request's title does not re-run the PR title check

Labels: bug
Status: open
Blocked by: none

**Finding** (R147 in `docs/plans/review-alignment-and-quality.md`; .github/workflows/ci.yml (messages job); minor; correctness): The required context stays green after a rename, so a squash merge can land a subject that breaks the conventional commit rule the check protects. Pull requests 1 to 9 merged with merge commits, which is why nothing has slipped. Verified from the trigger and the repository's merge settings.

**Evidence:** ci.yml:18-19 triggers on pull_request with the default types (opened, synchronize, reopened), so a renamed pull request keeps the last green 'Commit messages and PR title'. check-commits.sh:14-22 checks the title because squash merges use it as the subject, and the repository allows squash merges titled COMMIT_OR_PR_TITLE (gh api repos/Oba-One/omo-yoruba-website).

**What to build:** Run the title check in its own small job or workflow on pull_request types opened, edited, synchronize and reopened, so description edits do not re-run the rest of CI. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
