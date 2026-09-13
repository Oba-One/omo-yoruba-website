# 06: What you learn and what a lesson looks like

Labels: design, content
Status: resolved
Blocked by: 05

**What to build:** `/programs/yoruba-lessons` carries its two teaching sections (spec Q6, ADR 0031):
What you learn, with its prose or the chip "what the lessons teach, in her words" beside the levels or
their Pending line, and What a lesson looks like, with the lesson's steps as day-led schedule rows or
the Pending line "the shape of a lesson", shown or hidden by `lesson`.

- [x] `@oy/content`: `lessonsPage.learn` (Portable Text) with its registry row; the query reads the prose,
      the levels and the steps; TypeGen
- [x] `@oy/ui`: the levels list on the tokens' list rows (or the Pending line); the lesson's steps through
      `Schedule` and `ScheduleRow` in day mode; stories and tests for the new states
- [x] `packages/web`: the builder carries both sections and the option; tested
- [x] `Pages/Lessons/Lesson` stories (shown, hidden); Playwright: the chips while owed, no invented
      level, step or duration on the page, hidden by the option

## Comments

13 September 2026. `@oy/content`: `lessonsPage.learn` (Portable Text) with its row "what the lessons
teach, in her words"; condition rows for a level without its line ("what the level covers") and a step
without its place ("the step"); the query reads the prose, the levels and the steps. `@oy/ui`: `ListRow`
gains the entry form (a title and its line, one column without a date or action; ticket 10 adds the
event's date block and action), and `EntryList` holds entries in the tokens' `.oy-list` or shows the
Pending line; the steps go through `Schedule` in day mode, the step in the time's place.
`Pages/Lessons/Lesson` (shown with bracketed placeholder steps, pending, hidden). `packages/web`: the
builder carries both sections and the option; the page draws What you learn as a split (the prose or its
chip beside the levels or their line) and What a lesson looks like with the prototype's lead less its
invented "About an hour on a call". Playwright: 16 passed seeded and 16 with the placeholder project,
none of the prototype's levels or steps standing in while owed.
