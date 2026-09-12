# 01: Playwright and axe run against the dev server, locally and in CI

Labels: infra
Status: open
Blocked by: none

**What to build:** `bun e2e` runs Playwright (`@playwright/test` 1.63.0, `@axe-core/playwright`
4.13.0, owner's yes on 11 September 2026) against `astro dev` on port 4321, in Chromium at 1440
and at a 375 wide mobile project, with `PLAYWRIGHT_TEST_BASE_URL` replacing the web server when
set. One smoke spec proves the seam: the home page renders, has one `h1`, and no dialog is open
on load. CI gains a seventh job, `Playwright and axe`, that installs Chromium with its
dependencies, runs the suite with the placeholder Sanity variables, and uploads the report on
failure.

- [ ] `bun e2e` passes locally with the browser installed once (`bunx playwright install chromium`)
- [ ] The smoke spec fails when a dialog carries `open` on load
- [ ] Vitest still runs only `src/**/*.test.ts`; Playwright runs only `e2e/**`
- [ ] The CI job is green on the pull request and safe to require
- [ ] `docs/runbook.md` explains the local run, the base URL variable and the job
