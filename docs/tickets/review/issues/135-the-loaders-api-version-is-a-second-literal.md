# 135: The loaders' API version is a second literal in astro.config.ts, not STUDIO_API_VERSION

Labels: infra
Status: open
Blocked by: none

**Finding** (R135 in `docs/plans/review-alignment-and-quality.md`; astro.config.ts; minor; consistency): Bumping the one constant would move the Studio, the actions, the preview route and the functions but leave every page read on the old version, which is the drift the constant exists to prevent. Verified by grepping every apiVersion in packages/web and packages/content.

**Evidence:** packages/web/astro.config.ts:53 apiVersion: '2026-09-11'; packages/content/src/api-version.ts:1-7 says STUDIO_API_VERSION pins the site's loaders; packages/web/src/lib/sanity/load-query.ts:35 builds on sanity:client, which takes the integration's version; packages/web/src/pages/api/preview/enable.ts:25 and src/lib/forms/site-deps.ts:24 import the constant

**What to build:** Import STUDIO_API_VERSION from @oy/content/api-version in astro.config.ts (a plain module; the config already imports src/lib/paths). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
