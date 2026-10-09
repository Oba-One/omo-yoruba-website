# 149: CI installs Chromium for whatever Playwright is newest on npm, not the pinned 1.63.0

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R149 in `docs/plans/review-alignment-and-quality.md`; .github/workflows/ci.yml (e2e job); minor; correctness): When a Playwright release changes the browser revision, CI will download that browser while the tests launch 1.63.0's, and 'Playwright and axe' will fail with a missing executable on an unrelated pull request. It also runs an unpinned npm package on every run, against the repo's frozen-lockfile and SHA-pinning practice. Verified from the CI log and the bin folders.

**Evidence:** ci.yml:177-178 runs 'bunx playwright install --with-deps chromium' at the repo root; the root devDependencies (package.json:35-43) hold no Playwright and the root node_modules/.bin has none, so bunx fetches the registry's latest: job 108593893719 logs 'Resolving dependencies', 'Resolved, downloaded and extracted [4]', then Chrome for Testing 153.0.8010.12 (chromium v1243). packages/web/package.json:37 pins @playwright/test 1.63.0, and npm's latest is 1.63.0 today, so the browser matches by coincidence. docs/runbook.md:326-328 and packages/web/README.md:59 give the same command without a directory.

**What to build:** Run the install with working-directory packages/web (its node_modules/.bin/playwright is the pinned 1.63.0), and say where to run it in the runbook and the web README. Size S.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 9 October 2026:** Fixed in the pull request that carries this comment. The failure the finding predicted
arrived with Playwright 1.64.0: on pull request 24, run 37974007511 installed browser build 1248 at the root and all 60
tests failed with "Executable doesn't exist at .../chromium_headless_shell-1243/...". The install step now runs with
`working-directory: packages/web`, and the runbook, the web README, the Playwright config's comment and the Phase 3
research note say where to run it. No unit test can hold this; the job itself is the test, red before and green
after. No page changed, so there is no second data mode to run.
