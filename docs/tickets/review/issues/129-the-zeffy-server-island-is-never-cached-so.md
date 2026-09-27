# 129: The Zeffy server island is never cached, so every page view costs a function run and an uncached Sanity read

Labels: bug
Status: open
Blocked by: none

**Finding** (R129 in `docs/plans/review-alignment-and-quality.md`; ZeffyEmbed (the Give Dialog's island); minor; a11y-perf): The island is fetched when the page loads, not when the dialog first opens, and its response carries no CDN headers. So even a CDN hit on the page is followed by an uncached function invocation that reads the whole settings document from the live API, on every view of every page. ADR 0020 records the opposite. Verified by reading the component, the layout, the config and the research note on island caching.

**Evidence:** packages/web/src/components/ZeffyEmbed.astro:13-14 reads siteSettingsQuery and sets no cache; packages/web/src/layouts/SiteLayout.astro:177 mounts it with server:defer on every page; docs/research/phase-3-astro-actions-transitions-islands.md:206-209 (an island gets its own cache and only what it sets); packages/web/astro.config.ts:44 has no route rules; packages/web/src/lib/sanity/load-query.ts:37 useCdn false; docs/adr/0020-native-dialogs-and-the-give-embed-island.md:8-9 says the island tags its response for the Phase 4 cache

**What to build:** Tag the island's answer like a page, the day and the week with type:siteSettings unless the read failed or draft mode is on (a small helper beside cachePage), so a settings publish purges it; or correct ADR 0020 if it should stay uncached. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
