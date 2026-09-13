# 14: Donate: larger scale, what your gift does, other ways to give

Labels: design, content
Status: resolved
Blocked by: 02, 07, 13

**What to build:** the rest of Donate. Giving at a larger scale (spec Q15): the referenced doors, outline,
one in the row form, two or more as cards. What your gift does (spec Q16), hidden by `impact`: each giving
level as an `OutcomeCard` (the amount, "a month" when monthly, what it does, its source), each missing
line its chip, or the Pending line. Other ways to give (spec Q17): each way's title, line and detail, the
check row with the mailing address and the matching and fund rows with the EIN and legal name from the
settings, or the Pending line.

- [x] `@oy/content`: `otherWay.kind` and `detail`; registry rows for a giving level's line and source; the
      query reads the doors, the levels and the settings; TypeGen
- [x] `@oy/ui`: `ListRow`'s entry form takes a detail line; stories and tests
- [x] `packages/web`: the builder carries the three sections; tested
- [x] `Pages/Donate/Impact` (shown, hidden); Playwright: no preset amount, cost, platform or EIN the Studio
      does not hold, the sponsor form's round trip

## Comments

13 September 2026. `@oy/content/giving` holds the other-way kinds, their default titles and
`otherWaySetting`, which says which settings fact a kind carries: a check the mailing address, matching and
a donor-advised fund the EIN with the legal name. A kind whose fact the settings do not hold keeps its own
detail and shows the settings chip ("mailing address", "EIN"). `ListRow`'s entry form draws that detail
and its chip on one line. The seeded partner door is the only door, so it draws in the row form; the
levels and other ways have no confirmed content and show their Pending lines. `Pages/Donate/Impact` has
Shown, WithLevels (bracketed placeholders) and Hidden.
