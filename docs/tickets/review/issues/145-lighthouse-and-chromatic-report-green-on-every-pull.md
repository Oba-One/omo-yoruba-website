# 145: Lighthouse and Chromatic report green on every pull request without auditing or publishing anything

Labels: bug
Status: open
Blocked by: none

**Finding** (R145 in `docs/plans/review-alignment-and-quality.md`; .github/workflows (lighthouse.yml, ci.yml storybook job); minor; correctness): A reviewer reading the checks sees two green Lighthouse runs and a green Chromatic job, while no budget has been measured and no snapshot taken since the workflows were added. The missing secrets are tracked; the misleading green is not. Verified from the checks on all six open pull requests and the secrets API.

**Evidence:** gh pr checks 10 to 15: 'Lighthouse (desktop)' and 'Lighthouse (mobile)' pass in 2 to 5 s; 'Storybook build and Chromatic' passes in 32 to 41 s with the Chromatic skipped notice. gh api .../actions/secrets: total_count 0, so lighthouse.yml:40-50 and ci.yml:142-152 take the skip path every time. docs/plans/wayfinder.md:97 still titles the Lighthouse decision 'every preview audited'.

**What to build:** Until the secrets exist, make the skip read as skipped rather than passed: a first job that outputs whether the secret is set and gates the audit job with needs and if (secrets cannot be read in a job-level if). Retitle the wayfinder line. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work D14 and D16 (the secrets), wayfinder T17 and T28; this ticket adds the review's evidence.

## Comments
