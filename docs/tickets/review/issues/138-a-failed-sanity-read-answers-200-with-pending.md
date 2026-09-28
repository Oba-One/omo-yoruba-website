# 138: A failed Sanity read answers 200 with Pending chips on every page except the album page, which answers 503

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R138 in `docs/plans/review-alignment-and-quality.md`; Failed Sanity reads; polish; judgement): During a Sanity outage every page renders all-Pending with 200: a crawler may index it and a monitor sees nothing wrong, while the album route already answers 503 for the same condition. The render is correctly kept off the CDN either way. Verified by reading each page's frontmatter.

**Evidence:** packages/web/src/pages/gallery/[album].astro:45 sets 503 on error; packages/web/src/pages/index.astro:36-42 and the other page files pass failed to cachePage but keep 200; packages/web/README.md:23-25

**What to build:** Set the status to 503 (with Retry-After) wherever loadQuery reports an error, through one helper beside cachePage, so crawlers and uptime checks read an outage as one. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
