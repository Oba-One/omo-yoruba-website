# 123: Stale comments describe behaviour the code does not have

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R123 in `docs/plans/review-alignment-and-quality.md`; packages/ui (comments); polish; docs): Each was checked against the code it describes. Most date from earlier phases; the preview.ts one now waits on open-work E21, not Phase 3.

**Evidence:** SiteNav.astro:11-12 ('persisted across navigations by the layout') vs SiteLayout.astro:131 (not persisted) and ADR 0018 ('the nav and the footer re-render per page'); ProverbLine.astro:5 ('Renders nothing without both halves') vs :17 (renders with either); ProseQuote.astro:2 ('set off by the aṣọ òkè rule') vs :14 (a gold 4px border); PhotoTile.astro:5-6 and oy-components.css:199 ('the caption scrim deepens on hover') with no such rule; Initiative.astro:9 names the retired proceedsReturn; .storybook/preview.ts:33 ('waits for Phase 3'); tokens colors.css:20 calls --green-700 'the volunteer chip's' while oy-components.css:682-683,775 use literals

**What to build:** Correct each comment to the code (or the code to the comment where the comment states the intent, for example the chip using var(--green-700)). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
