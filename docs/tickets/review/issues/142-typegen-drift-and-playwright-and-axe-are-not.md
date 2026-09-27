# 142: TypeGen drift and Playwright and axe are not required checks, so a pull request can merge with either red

Labels: bug
Status: open
Blocked by: none

**Finding** (R142 in `docs/plans/review-alignment-and-quality.md`; .github (branch protection); major; correctness): Branch protection still lists the five contexts checked on 5 September. The two jobs added in Phases 2 and 3 run on every pull request but do not block a merge, so a schema change without regenerated types, or a page that fails axe, can reach main while the README tells contributors that only passing changes merge. Verified with the protection and rulesets APIs on 27 September; both jobs are green on all six open pull requests, so nothing has slipped yet. Only an administrator can apply the fix; the runbook already records the decision.

**Evidence:** gh api repos/Oba-One/omo-yoruba-website/branches/main/protection (27 Sep): required contexts are 'Typecheck, lint, test', 'Build packages/web', 'Commit messages and PR title', 'Shell scripts', 'Storybook build and Chromatic'; gh api .../rulesets returns []. ci.yml:74 (TypeGen drift) and ci.yml:165 (Playwright and axe) exist. docs/runbook.md:491-492 and :342-343 ask to add both contexts when the Phase 2 and Phase 3 pull requests merge (both merged 12 Sep); docs/runbook.md:479-480 still says 'all six can be required checks' (ci.yml has seven jobs). README.md:66-68 says main takes changes only through a pull request whose checks pass and lists both jobs.

**What to build:** Add 'TypeGen drift' and 'Playwright and axe' to the required contexts with the gh api PUT the runbook describes, then refresh the runbook's CI and merging section (seven jobs, the current contexts, the date checked). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
