# 148: The Shell scripts job parses one of five scripts and never sees two others

Labels: infra
Status: open
Blocked by: none

**Finding** (R148 in `docs/plans/review-alignment-and-quality.md`; .github/workflows/ci.yml (scripts job); minor; tests): shellcheck would still catch a parse error in the other four listed scripts, so the syntax step is misleading rather than harmful, but the two package scripts get no check at all and sanity.sh runs on every pull request. Verified by reproducing bash -n's behaviour and listing the tracked scripts. shellcheck is not installed locally, so the scripts were read by hand; bash -n passes on both.

**Evidence:** ci.yml:118 runs 'bash -n scripts/*.sh .claude/hooks/*.sh'; bash -n parses only its first file (scripts/check-commits.sh) and treats the rest as arguments (scratch test: 'bash -n good.sh bad.sh' exits 0, 'bash -n bad.sh good.sh' exits 2). ci.yml:122 shellcheck lists the same five files. packages/content/scripts/sanity.sh, which bun typegen runs in the TypeGen drift job, and packages/tokens/scripts/make-yoruba-subsets.sh are in neither step (git ls-files '*.sh').

**What to build:** Loop bash -n over each file and give both steps every tracked shell script except the vendored skill copy. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
