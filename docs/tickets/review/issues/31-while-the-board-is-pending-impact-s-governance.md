# 31: While the board is Pending, Impact's governance drops the page's only link to Our Story

Labels: design
Status: open
Blocked by: none

**Finding** (R31 in `docs/plans/review-alignment-and-quality.md`; /impact; minor; drift): The Build Brief's handoffs ask every page that shows a face to link People & History, and the prototype does it through the Board cell, where a grant reviewer looks for who governs. With no board documents the site shows the chip alone, so the body of Impact never reaches Our Story (only the nav and the footer do). GlanceCell already renders a pending value with a linked note, so the fix is one line in the builder.

**Evidence:** packages/web/src/lib/sanity/impact-page.ts:278-284 sets the Board cell's noteHref only when boardCount > 0; the links in /impact's main reach no /our-story; docs/design/design/14 Impact.dc.html:220 links 'People & history' in the Board cell; packages/ui/src/page/GlanceStrip/GlanceCell.astro draws a linked note beside a Pending value

**What to build:** Keep the Board cell's note 'Our Story' linked to /our-story#board beside its chip. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
