# 08: Impact: governance and accountability

Labels: design, content
Status: open
Blocked by: 01, 05

**What to build:** the governance section at `#governance` (spec Q8), always rendered: four cells (tax
status, the EIN or its chip, the board "Listed" with its link to Our Story's board once a board member
exists or the board's chip, the financials from the newest annual report) and the facts (the mailing
address, then Form 990, Annual report and Audit from the newest document of each kind: a link to its file
with its note, the note alone, or that kind's chip).

- [ ] `@oy/content`: the governance presence row per kind; a document with neither file nor note; the
      query reads the newest document of each kind with its file's URL and the board count; the route map
      (`person` reaches `/impact`); TypeGen
- [ ] `@oy/ui`: `GlanceCell` takes a note that links; stories and tests
- [ ] `packages/web`: the builder carries the cells and the facts, file URLs through `safeHref`; tested
- [ ] Playwright: the footer's `/impact#governance` lands on the section; no EIN, date, filing or audit
      position the Studio does not hold

## Comments
