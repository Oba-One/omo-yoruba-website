# 04: The year strip

Labels: design, content
Status: resolved
Blocked by: 02

**What to build:** `/programs` shows "When things run" (spec Q5): five columns, each when (or the chip
"when it runs"), the program's name or the event page's name for a festival or gala row, and the note;
then the impact handoff box. The `yearstrip` option shows or hides the section with its box.

- [x] `@oy/content`: the year strip row names a kind (festival or gala) or a program, exactly one;
      `yearStripRow.event` retires; the registry's "when it runs"; the query reads the rows with their
      program names; TypeGen
- [x] Seed: the two event rows move to kinds (the stored references unset), the confirmed notes filled
- [x] `@oy/ui`: `YearStrip` in five columns with its Pending chips and exemptions; stories (five rows,
      owed values, empty) and tests
- [x] `packages/web`: the builder resolves each row's name; tested; the section and the option on the page
- [x] `Pages/Programs/Yearstrip` stories (shown, hidden); Playwright: five cells, the chips while owed,
      hidden by the option

## Comments

13 September 2026. `@oy/content`: a year strip row names a program or the festival or Gala as a kind
(a Studio rule refuses both or neither), and its edition reference retired; the registry adds "when each
program runs" for an empty strip and "when it runs" for a row without its when; an edition no longer
reaches `/programs` in the route map (the purge test follows). Seed: the two event rows moved to kinds,
the stored references unset, the confirmed notes filled ("Àgbàlá Ọmọde runs at the festival", "Solar Hub,
Green Goods"); written to `development`. `@oy/ui`: `YearStrip` on the tokens' `.oy-year` (five columns for
five rows, four for four, the when or its chip, the name, the note), with the `.oy-year span.oy-pend`
exemption so a when's chip keeps its colour; `Pages/Programs/Yearstrip` (shown, hidden). `packages/web`:
the builder names an event row by its page without a year; the page draws the section with the impact
handoff box and the option's edit attribute. Playwright: 16 passed seeded and 16 with the placeholder
project.
