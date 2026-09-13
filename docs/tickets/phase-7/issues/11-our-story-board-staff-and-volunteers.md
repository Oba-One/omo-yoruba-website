# 11: Our Story: board, staff and volunteers

Labels: design, content
Status: open
Blocked by: 01, 10

**What to build:** the people (spec Q12). The board at `#board`: cards with the role, the name and the
short bio, each missing one its chip, the full bio added by `bios: full`. Staff and volunteers: compact
cards with the role and the name, then the box to the teacher on the Lessons page. The teacher is never
listed. No portrait draws the woven tick; `portraits: hidden` hides every portrait; an empty group draws
its own Pending line.

- [ ] `@oy/content`: the person presence rows per group; rows for a board member's short bio and a listed
      person's role; the query reads both groups in order; TypeGen
- [ ] `@oy/ui`: `PersonCard` draws the full bio; stories and tests
- [ ] `packages/web`: the builder carries both groups and both options; tested
- [ ] `Pages/OurStory/Bios` (short, full) and `Pages/OurStory/Portraits` (shown, hidden); Playwright: none
      of the register's nine names while owed, never "Head teacher"

## Comments
