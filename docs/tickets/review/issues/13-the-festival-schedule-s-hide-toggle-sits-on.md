# 13: The festival schedule's Hide toggle sits on its own row under the lead, not on the head's first line

Labels: design
Status: open
Blocked by: none

**Finding** (R13 in `docs/plans/review-alignment-and-quality.md`; /odunde (Schedule); minor; drift): ADR 0028 moved the toggle to the right but left it as a separate row between the section head and the rows, so once the Studio holds the 2027 schedule the rows start 62px lower than drawn and the control reads apart from the heading it belongs to. The Programs hub's Disclosure already solves the same layout on the head's first line. The live page shows the Pending line and no toggle today; verified in the page-section story with getBoundingClientRect.

**Evidence:** Storybook pages-odunde-schedule--shown at 1440 (test-results/review/home-events/stories/odunde-schedule-shown-1440.png): lead bottom 198, summary 228 to 272 at the right, first row at 290, 92px under the lead. Prototype docs/design/design/08 Odunde Festival.dc.html:162 puts the quiet button inside .oy-sec-head with margin-left:auto: toggle top 2351 level with the kicker (2363), first row 30px under the lead (2502 to 2532), capture test-results/review/home-events/pairs/odunde-1440-schedule.png. packages/ui/src/content/Schedule/Schedule.astro:47-51 and 62-70 (the summary block-level, margin 0 0 18px auto).

**What to build:** Give Schedule a head slot and set its summary on the head's first line at the right above 720px, as Disclosure already does (packages/ui/src/content/Disclosure/Disclosure.astro, the absolute summary and the head's right padding), keeping its own line under 720px. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
