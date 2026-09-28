# 06: Homepage section leads use the event pages' lead (12px, 1.7, 64ch) where the homepage prototype sets 10px, 1.6, 560px

Labels: design, later
Status: open
Blocked by: none

**Finding** (R06 in `docs/plans/review-alignment-and-quality.md`; / (SectionHead); polish; drift): ADR 0036's consequence says the SectionHead lead changed on every page 'towards their prototypes' .oy-sec-lead', but the homepage prototype has no .oy-sec-lead; its two leads are inline at 10px, 1.6 and 560px, so that reason does not hold for the homepage. Each homepage lead sits 2px lower with taller lines (3px per head at 1440, 7px for Raise your hand at 375). The event pages match .oy-sec-lead exactly (measured on every head).

**Evidence:** Measured at 1440: Member voices lead on the site 12px under the h2, 17px/28.9px, max-width 540.761px; prototype 10px, 17px/27.2px, 560px (docs/design/design/02 Homepage.dc.html:182 and :309, inline styles, no .oy-sec-lead). Kicker top to grid 139px on the site against 136px. Raise your hand at 375: lead 116px tall against 109px. packages/ui/src/page/SectionHead/SectionHead.astro:96-102. Captures test-results/review/home-events/pairs/home-375-section_voices_oy-section_oy-s.png and home-375-section_get-involved_oy-sectio.png. Also: test-results/review/site/home-intro.txt at 1440: prototype Member voices and Raise your hand intros sit 10px under the h2, max-width 560px, line height 27.2px (1.6); the site draws them 12px under, max-width 540.76px, line height 28.9px (1.7), the Raise your hand line 541px wide against 560px. Prototype markup: docs/design/design/02 Homepage.dc.html:182 (inline margin 10px, max-width 560px). ADR 0036 moved SectionHead to the pages' .oy-sec-lead, which 02 Homepage does not use.

**What to build:** Give SectionHead a homepage lead variant (10px, line height 1.6, 560px) for the voices and raise-your-hand heads, or amend ADR 0036 to say the homepage takes the event pages' lead on purpose. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work E2 (wayfinder ticket 41 handed the section lead to this review); this ticket adds the review's evidence.

## Comments
