# 146: The commit message check passes when the commit range cannot be read

Labels: bug
Status: open
Blocked by: none

**Finding** (R146 in `docs/plans/review-alignment-and-quality.md`; scripts/check-commits.sh; minor; correctness): If a pull request's base SHA is missing from the fetched history, for example after the base branch of a stacked pull request is rewritten, the job checks no commit and reports success. The PR title part still runs, so only the commits go unchecked. Reproduced locally with an unreachable base.

**Evidence:** check-commits.sh:24 loops over $(git rev-list --reverse $base..$head); set -e does not stop on a failing command substitution in a for list. 'bash scripts/check-commits.sh 0000000000000000000000000000000000000001 HEAD' printed 'fatal: Invalid revision range' and exited 0. ci.yml:104-107 passes github.event.pull_request.base.sha as the base.

**What to build:** Read the list into a variable first (an assignment from a failing substitution stops the script under set -e), or use mapfile from a checked command, and fail when the range cannot be read. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
