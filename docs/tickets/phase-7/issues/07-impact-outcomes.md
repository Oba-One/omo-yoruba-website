# 07: Impact: what each program produced

Labels: design, content
Status: open
Blocked by: 05

**What to build:** the outcomes section (spec Q6): each referenced outcome as an `OutcomeCard` headed by
its subject (a program or an event page's kind): the figure's value, its label and its source line or
chip, or the plain statement alone, or the chip when it has neither; slots for the prototype's subjects
not yet covered, up to four; `outcomes` draws cards or rows; the quiet links under the grid name each
subject's page.

- [ ] `@oy/content`: `outcome.kind` beside `program` (exactly one), `title` and `year` retired; registry
      rows for an outcome without a figure or statement and a figure without its source; the slot list;
      the query reads the outcomes, their subjects and every program's name; TypeGen
- [ ] `@oy/ui`: `OutcomeCard` (card, row; heading optional) with its Pending states; stories and tests
- [ ] `packages/web`: the builder carries the cards, the slots and the links; tested
- [ ] `Pages/Impact/Outcomes` (cards, rows); Playwright: four cards or slots, no invented figure or
      source while owed, the links reach their pages, never "The school"

## Comments
