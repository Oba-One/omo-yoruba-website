# 09: Impact: partners and funders, and Fund the next year

Labels: design, content
Status: open
Blocked by: 05

**What to build:** the page's close (spec Q9). Partners and funders, hidden by `funders`: every partner,
funders first, then partners and sponsors, each group by name, or the Pending line. Fund the next year on
the dark ground: the heading, the partnerships contact's sentence with the response line or its chip, the
gold "Sponsor or partner" and "Write to {name}" when the contact has a name and an email, else "Talk to
us".

- [ ] `@oy/content`: `impactPage.nextYear.blurb` retires; the partnerships response line's registry row
      (named constant); the query reads every partner in that order and the partnerships contact; TypeGen
- [ ] `@oy/ui`: `Section` gains the dark ground with its drifting dot field; stories and tests
- [ ] `packages/web`: the builder carries both sections; tested
- [ ] `Pages/Impact/Funders` (shown, hidden); Playwright: no mock partner or contact name while owed, the
      sponsor form's round trip, one gold per view

## Comments
