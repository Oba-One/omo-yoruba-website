# 86: Two inputs members see change nothing on the site: the Programs page's Intro and a program's Kicker

Labels: bug
Status: open
Blocked by: none

**Finding** (R86 in `docs/plans/review-alignment-and-quality.md`; packages/content (schema, queries); minor; correctness): ADR 0042 and the package README (line 79) say an input no page reads is deleted, or named in hidden-inputs.ts if kept; open-work S2 hid the unread inputs the Studio review found but missed these two. A member who writes a Programs intro or a program kicker sees nothing change, which is what the simplification set out to remove. Found by comparing every singleton's fields with its own query (a script over schema.json), then reading the card that draws programs.

**Evidence:** packages/content/src/schema/singletons/index.ts:190 (programsPage intro) is not in programsPageQuery (packages/content/src/queries/program-pages.ts:13-42). packages/content/src/schema/documents/content.ts:393 (program kicker) is fetched by homepageQuery (packages/content/src/queries/homepage.ts:29), but ProgramLike has no kicker (packages/ui/src/cards/ProgramCard/ProgramCard.astro:20-29) and the Programs query does not fetch it. Neither is hidden, named in src/hidden-inputs.ts or in RETIRED_FIELDS. Query on development: programsPage.intro is null and every program's kicker is null.

**What to build:** Hide both now and retire them through RETIRED_FIELDS (nothing is stored), and drop kicker{yo, en} from the homepage's programs projection. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
