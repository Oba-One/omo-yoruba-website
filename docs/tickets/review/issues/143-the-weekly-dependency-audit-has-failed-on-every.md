# 143: The weekly dependency audit has failed on every run since it was wired, and no document records it

Labels: bug
Status: open
Blocked by: none

**Finding** (R143 in `docs/plans/review-alignment-and-quality.md`; .github/workflows/audit.yml; major; correctness): The audit is red every Monday, so an advisory that matters would look like the same noise. Every advisory on 21 September sits in build and tooling dependencies (Lighthouse CI, the Sanity CLI, Astro's build helpers), so the live site is probably not exposed, but nobody has made that call in writing. With Dependabot alerts and security updates both disabled, this job is the only vulnerability signal the repository has. Accepting advisories or adding overrides is the owner's call.

**Evidence:** gh run list --workflow audit.yml: failure on 2026-09-07, 2026-09-14 and 2026-09-21, the only three runs. The 21 Sep log ends '9 vulnerabilities (9 high)': extract-zip and tmp (via @lhci/cli), js-yaml (astro and @astrojs/* internal-helpers, @lhci/utils, @sanity/cli), path-to-regexp (@astrojs/vercel routing-utils, lhci's express), smol-toml (astro internal-helpers, @sanity/cli). audit.yml:1-2 and dependabot.yml:1-3 call this audit the one place vulnerabilities surface; gh api .../dependabot/alerts answers 403 'Dependabot alerts are disabled for this repository'. git grep finds no open-work row, ticket or runbook line about the failures.

**What to build:** Triage the nine advisories: bump or override the transitive packages that have fixed releases, record the build-time-only ones as accepted with bun audit's ignore option and a comment saying why, and add an open-work row so the next red run is noticed. Size M. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
