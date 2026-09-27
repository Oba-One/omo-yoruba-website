# 18: Three small spacing differences: the questions list, the handoff boxes and the four-card gap

Labels: design, later
Status: open
Blocked by: none

**Finding** (R18 in `docs/plans/review-alignment-and-quality.md`; /programs, /programs/yoruba-lessons, /programs/cultural-collective; polish; drift): Each is under 10px and none changes the reading, but they are measured departures on blocks the prototypes set explicitly. The FAQ is the only section lead on the three pages whose spacing differs: every other lead measures 12px under its heading and 30px above its block at both widths.

**Evidence:** Questions parents ask: the prototype's lead has margin-bottom 22px (11 Yoruba Language School.dc.html:121), the site's SectionHead keeps 30px (packages/tokens/src/base.css:106), so the list starts 8px lower at both widths (test-results/review/programs/p11-1440-section-faq.png, s11-1440-section-faq.png). Handoff boxes: margin-top 20px (packages/ui/src/page/Handoff/Handoff.astro:81-82) where the prototypes set 24px (10 Programs.dc.html:181) and 22px (11 Yoruba Language School.dc.html:158, 12 Yoruba Cultural Collective.dc.html:169). Programs cards four across: gap 22px (packages/ui/src/page/CardGrid/CardGrid.astro:25-28) where .pg-cards sets 20px (10 Programs.dc.html:24).

**What to build:** Let the questions' head keep 22px before the list, give the handoff box the prototypes' 22px (24px on Programs), and set the four-across program grid to 20px. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
