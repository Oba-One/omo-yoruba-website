# 151: The client JavaScript step names the 60 KB budget but lists 355 files, mostly the Studio's, and checks nothing

Labels: infra
Status: open
Blocked by: none

**Finding** (R151 in `docs/plans/review-alignment-and-quality.md`; .github/workflows/ci.yml (build job); minor; tests): QUALITY.md section 3 sets 60 KB of gzipped JS per content page. The summary is too long to judge that by eye and no CI job enforces it today, so a new island or a heavier analytics build could grow a page's scripts unnoticed. Verified from the build summary of pull request 15.

**Evidence:** ci.yml:60-71 prints every .js under .vercel/output/static/_astro. On pull request 15 (job 108593893683) the table has 355 rows totalling 2,859,543 gzipped bytes, led by Studio chunks (AccessDenied, Activity, AddComment). No step sums a route's scripts or fails over budget; packages/web/lighthouserc.cjs:61 is the only script-size assertion, and it never runs while Lighthouse skips.

**What to build:** Sum the scripts each built content page references and fail above 60 KB, leaving the /admin chunks out; or rename the step to what it does. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
