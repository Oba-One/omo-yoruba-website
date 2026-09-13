# 04: The year strip

Labels: design, content
Status: open
Blocked by: 02

**What to build:** `/programs` shows "When things run" (spec Q5): five columns, each when (or the chip
"when it runs"), the program's name or the event page's name for a festival or gala row, and the note;
then the impact handoff box. The `yearstrip` option shows or hides the section with its box.

- [ ] `@oy/content`: the year strip row names a kind (festival or gala) or a program, exactly one;
      `yearStripRow.event` retires; the registry's "when it runs"; the query reads the rows with their
      program names; TypeGen
- [ ] Seed: the two event rows move to kinds (the stored references unset), the confirmed notes filled
- [ ] `@oy/ui`: `YearStrip` in five columns with its Pending chips and exemptions; stories (five rows,
      owed values, empty) and tests
- [ ] `packages/web`: the builder resolves each row's name; tested; the section and the option on the page
- [ ] `Pages/Programs/Yearstrip` stories (shown, hidden); Playwright: five cells, the chips while owed,
      hidden by the option

## Comments
