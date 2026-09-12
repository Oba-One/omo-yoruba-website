# 01: Playwright and axe run against the dev server, locally and in CI

Labels: infra
Status: resolved
Blocked by: none

**What to build:** `bun e2e` runs Playwright (`@playwright/test` 1.63.0, `@axe-core/playwright`
4.13.0, owner's yes on 11 September 2026) against `astro dev` on port 4321, in Chromium at 1440
and at a 375 wide mobile project, with `PLAYWRIGHT_TEST_BASE_URL` replacing the web server when
set. One smoke spec proves the seam: the home page renders, has one `h1`, and no dialog is open
on load. CI gains a seventh job, `Playwright and axe`, that installs Chromium with its
dependencies, runs the suite with the placeholder Sanity variables, and uploads the report on
failure.

- [x] `bun e2e` passes locally with the browser installed once (`bunx playwright install chromium`)
- [x] The smoke spec fails when a dialog carries `open` on load
- [x] Vitest still runs only `src/**/*.test.ts`; Playwright runs only `e2e/**`
- [x] The CI job is green on the pull request and safe to require
- [x] `docs/runbook.md` explains the local run, the base URL variable and the job

## Comments

11 September 2026. Two projects (desktop 1440, mobile 375 in Chromium), `list` locally and
`github` plus `html` in CI, the dev server reused locally and started on the runner. The CI job
runs the suite on the runner rather than against the Vercel preview, which sits behind Vercel
Authentication. The "dialog open on load" criterion is the smoke assertion `dialog[open]` has
count zero; every later dialog is mounted closed and the assertion stays in the suite.
