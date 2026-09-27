# 23: A lesson's steps will run the full 1052px content width where the prototype holds them at 820px

Labels: design
Status: open
Blocked by: none

**Finding** (R23 in `docs/plans/review-alignment-and-quality.md`; /programs/yoruba-lessons, Schedule (what a lesson looks like); minor; drift): development holds no steps yet, so the page shows its Pending line and the difference is latent; once the lesson's steps arrive (open-work C7), their one-line descriptions run about 40 percent wider than designed. Verified through the page-section story, since the seeded page cannot show the filled state.

**Evidence:** Prototype 11 Yoruba Language School.dc.html:108 sets .oy-sched--day at max-width 820px (rows end at x 1014 in test-results/review/programs/p11-1440-section-lesson.png). Storybook Pages/Lessons/Lesson/Shown at 1440 (story-lessons-lesson-shown-1440.png): .oy-sched is 1052px wide and each step's text column 864px. packages/web/src/pages/programs/yoruba-lessons.astro:119-124 passes no width and Schedule has no width option; the Odunde and Gala prototypes draw their schedules unconstrained, so the cap is the Lessons page's own.

**What to build:** Give Schedule a narrow measure (820px) and pass it on the Lessons page only. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
