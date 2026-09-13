# 14: Donate: larger scale, what your gift does, other ways to give

Labels: design, content
Status: open
Blocked by: 02, 07, 13

**What to build:** the rest of Donate. Giving at a larger scale (spec Q15): the referenced doors, outline,
one in the row form, two or more as cards. What your gift does (spec Q16), hidden by `impact`: each giving
level as an `OutcomeCard` (the amount, "a month" when monthly, what it does, its source), each missing
line its chip, or the Pending line. Other ways to give (spec Q17): each way's title, line and detail, the
check row with the mailing address and the matching and fund rows with the EIN and legal name from the
settings, or the Pending line.

- [ ] `@oy/content`: `otherWay.kind` and `detail`; registry rows for a giving level's line and source; the
      query reads the doors, the levels and the settings; TypeGen
- [ ] `@oy/ui`: `ListRow`'s entry form takes a detail line; stories and tests
- [ ] `packages/web`: the builder carries the three sections; tested
- [ ] `Pages/Donate/Impact` (shown, hidden); Playwright: no preset amount, cost, platform or EIN the Studio
      does not hold, the sponsor form's round trip

## Comments
