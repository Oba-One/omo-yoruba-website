# 03: Get Involved: hometown associations

Labels: design, content
Status: resolved
Blocked by: 02

**What to build:** the associations section (spec Q3), hidden by `hta`: the heading and the seeded prose
beside three cells (Associations from the "9 hometown associations" stat, Listed publicly "Not yet" while
no association is in the Studio, To connect "Ask when you join"); the associations listed under the prose
when documents exist, each linked where it has a site. The presence row asking for nine names retires.

- [x] `@oy/content`: the block's reference to its stat (seeded); the presence row retires; the query reads
      the stat and every association by name; the route map (`stat` reaches `/get-involved`); TypeGen
- [x] `packages/web`: the builder carries the prose or its chip, the cells and the list; tested
- [x] `Pages/GetInvolved/Hta` (shown, hidden); Playwright: the cells, the section gone under `hidden`, no
      association name the Studio does not hold

## Comments

13 September 2026. The block references its stat (seeded to "9 hometown associations"); the presence row
for nine names retires and a row for the missing count and one for missing prose join the registry; the
query reads every association by name; `stat` reaches `/get-involved`. The section: the heading, the prose
or its chip and the names as linked chips once listed (`PartnerRow`), beside the cells in `GlanceStrip`
without its band. `Pages/GetInvolved/Hta` (shown, listed, hidden). Playwright in both modes as in 02.
