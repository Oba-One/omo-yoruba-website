# 150: Dependabot does not watch the three actions pinned in the shared setup-js action

Labels: bug
Status: open
Blocked by: none

**Finding** (R150 in `docs/plans/review-alignment-and-quality.md`; .github/dependabot.yml; minor; correctness): Three of the six pinned actions live in the composite action every job uses, so they would never get an update pull request. This rests on GitHub's documented lookup for the ecosystem; it cannot be observed yet, because no Dependabot pull request has been opened in this repository.

**Evidence:** dependabot.yml:11-12 sets the github-actions ecosystem with directory '/', which GitHub documents as the workflows folder plus a root action.yml. .github/actions/setup-js/action.yml:8, :13 and :18 pin actions/setup-node, oven-sh/setup-bun and actions/cache by SHA. dependabot.yml:2-3 and docs/runbook.md:482 say Dependabot keeps the pinned SHAs current.

**What to build:** Give the github-actions entry directories: ['/', '/.github/actions/*']. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
