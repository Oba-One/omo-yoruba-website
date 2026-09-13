# 11: Our Story: board, staff and volunteers

Labels: design, content
Status: resolved
Blocked by: 01, 10

**What to build:** the people (spec Q12). The board at `#board`: cards with the role, the name and the
short bio, each missing one its chip, the full bio added by `bios: full`. Staff and volunteers: compact
cards with the role and the name, then the box to the teacher on the Lessons page. The teacher is never
listed. No portrait draws the woven tick; `portraits: hidden` hides every portrait; an empty group draws
its own Pending line.

- [x] `@oy/content`: the person presence rows per group; rows for a board member's short bio and a listed
      person's role; the query reads both groups in order; TypeGen
- [x] `@oy/ui`: `PersonCard` draws the full bio; stories and tests
- [x] `packages/web`: the builder carries both groups and both options; tested
- [x] `Pages/OurStory/Bios` (short, full) and `Pages/OurStory/Portraits` (shown, hidden); Playwright: none
      of the register's nine names while owed, never "Head teacher"

## Comments

13 September 2026. The presence rows per group came with ticket 01; this ticket adds a board member's short
bio (`group == "board"`) and a listed person's role (`group in [...]`, never the teacher). `@oy/ui`:
`PersonCard` gains `rolePending` and `full` (the full bio through `Prose` under the short one); `CardGrid`
five across (two under 1000px) for the compact staff cards. The board card draws a portrait only with
`portraits` shown and one in the Studio, else the woven tick. `Pages/OurStory/Bios` (short, full) and
`Pages/OurStory/Portraits` (pending, shown, hidden); the one story portrait is the lesson's whiteboard, so no
one reads as named.
