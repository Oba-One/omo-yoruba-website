# 127: The page-section tests check the stories' own composition, a second copy of each page, so they can pass while the site differs (judgement)

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R127 in `docs/plans/review-alignment-and-quality.md`; Page-section tests (packages/ui/src/pages); polish; judgement): The kicker copy matches today (compared across web pages and story sections), but nothing enforces it; the tests protect the story wiring, not the pages the owner ships.

**Evidence:** packages/ui/src/pages/homepage/homepage.test.ts:61-70 tests 'the footer block or the band, never both' through pages/homepage/sections.ts:187 footer(), while the site decides placement in packages/web/src/layouts/SiteLayout.astro:133-156; KidsStemSection.astro and ExchangeSection.astro restate packages/web/src/pages/programs/index.astro:97-131

**What to build:** Keep these tests to what the stories must show (the option reaches the root and the part), and leave page behaviour to the e2e specs; or build the stories from the site's builders so there is one composition. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
