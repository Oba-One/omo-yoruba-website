# 08: Impact: governance and accountability

Labels: design, content
Status: resolved
Blocked by: 01, 05

**What to build:** the governance section at `#governance` (spec Q8), always rendered: four cells (tax
status, the EIN or its chip, the board "Listed" with its link to Our Story's board once a board member
exists or the board's chip, the financials from the newest annual report) and the facts (the mailing
address, then Form 990, Annual report and Audit from the newest document of each kind: a link to its file
with its note, the note alone, or that kind's chip).

- [x] `@oy/content`: the governance presence row per kind; a document with neither file nor note; the
      query reads the newest document of each kind with its file's URL and the board count; the route map
      (`person` reaches `/impact`); TypeGen
- [x] `@oy/ui`: `GlanceCell` takes a note that links; stories and tests
- [x] `packages/web`: the builder carries the cells and the facts, file URLs through `safeHref`; tested
- [x] Playwright: the footer's `/impact#governance` lands on the section; no EIN, date, filing or audit
      position the Studio does not hold

## Comments

13 September 2026. The governance presence row splits per kind; `GOVERNANCE_NOTE_PENDING` for a document
with neither file nor note; the query projects each newest document's file URL; `person` reaches
`/impact`. Cells: tax status, EIN, the board ("Listed" with its note linking to `/our-story#board` once a
board member exists), the financials from the newest annual report. Facts: the mailing address, then Form
990, Annual report and Audit (a filed document links its file, its note after the link). `GlanceCell`
takes `noteHref` (a 44px link); `FactList` a `note` after a fact's value.
