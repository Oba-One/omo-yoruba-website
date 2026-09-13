# 07: Impact: what each program produced

Labels: design, content
Status: resolved
Blocked by: 05

**What to build:** the outcomes section (spec Q6): each referenced outcome as an `OutcomeCard` headed by
its subject (a program or an event page's kind): the figure's value, its label and its source line or
chip, or the plain statement alone, or the chip when it has neither; slots for the prototype's subjects
not yet covered, up to four; `outcomes` draws cards or rows; the quiet links under the grid name each
subject's page.

- [x] `@oy/content`: `outcome.kind` beside `program` (exactly one), `title` and `year` retired; registry
      rows for an outcome without a figure or statement and a figure without its source; the slot list;
      the query reads the outcomes, their subjects and every program's name; TypeGen
- [x] `@oy/ui`: `OutcomeCard` (card, row; heading optional) with its Pending states; stories and tests
- [x] `packages/web`: the builder carries the cards, the slots and the links; tested
- [x] `Pages/Impact/Outcomes` (cards, rows); Playwright: four cards or slots, no invented figure or
      source while owed, the links reach their pages, never "The school"

## Comments

13 September 2026. `outcome`: `kind` (festival, gala) beside `program`, exactly one by the document's
validation; `title` and `year` retired (no outcome existed); rows for an outcome with neither figure nor
statement (`OUTCOME_PENDING`) and for a figure's missing source (narrowed to `defined(figure)`);
`IMPACT_OUTCOME_SLOTS` by program id and kind. `@oy/content/routes` gains `programHref` and
`INLINE_PROGRAM_SECTIONS` (the Programs builder now reads the map from there), so Kids & STEM links to
`/programs#kids`. `@oy/ui`: `OutcomeCard` (heading optional, figure, line, source line or chip, plain
statement, the chip for neither; card and row; `data-measured`). `Pages/Impact/Outcomes` (cards, rows, with
an outcome).
