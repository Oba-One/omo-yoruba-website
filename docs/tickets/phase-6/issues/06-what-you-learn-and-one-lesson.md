# 06: What you learn and what a lesson looks like

Labels: design, content
Status: open
Blocked by: 05

**What to build:** `/programs/yoruba-lessons` carries its two teaching sections (spec Q6, ADR 0031):
What you learn, with its prose or the chip "what the lessons teach, in her words" beside the levels or
their Pending line, and What a lesson looks like, with the lesson's steps as day-led schedule rows or
the Pending line "the shape of a lesson", shown or hidden by `lesson`.

- [ ] `@oy/content`: `lessonsPage.learn` (Portable Text) with its registry row; the query reads the prose,
      the levels and the steps; TypeGen
- [ ] `@oy/ui`: the levels list on the tokens' list rows (or the Pending line); the lesson's steps through
      `Schedule` and `ScheduleRow` in day mode; stories and tests for the new states
- [ ] `packages/web`: the builder carries both sections and the option; tested
- [ ] `Pages/Lessons/Lesson` stories (shown, hidden); Playwright: the chips while owed, no invented
      level, step or duration on the page, hidden by the option

## Comments
