# 09: Impact: partners and funders, and Fund the next year

Labels: design, content
Status: resolved
Blocked by: 05

**What to build:** the page's close (spec Q9). Partners and funders, hidden by `funders`: every partner,
funders first, then partners and sponsors, each group by name, or the Pending line. Fund the next year on
the dark ground: the heading, the partnerships contact's sentence with the response line or its chip, the
gold "Sponsor or partner" and "Write to {name}" when the contact has a name and an email, else "Talk to
us".

- [x] `@oy/content`: `impactPage.nextYear.blurb` retires; the partnerships response line's registry row
      (named constant); the query reads every partner in that order and the partnerships contact; TypeGen
- [x] `@oy/ui`: `Section` gains the dark ground with its drifting dot field; stories and tests
- [x] `packages/web`: the builder carries both sections; tested
- [x] `Pages/Impact/Funders` (shown, hidden); Playwright: no mock partner or contact name while owed, the
      sponsor form's round trip, one gold per view

## Comments

13 September 2026. `impactPage.nextYear.blurb` retires (never stored); `PARTNERSHIPS_RESPONDS_PENDING`
with its row; `fundersIntro` seeded with the prototype's lead. Partners list funders, partners, sponsors,
each by name. The band: `Section` `ground="dark"` (the dark scope and the drifting dot field), the
kicker, the heading, "Our partnerships lead answers" with the chip (or the named sentence), the gold
"Sponsor or partner" and "Write to {name}" (`mailto:`) once named with an email, else "Talk to us".
`Pages/Impact/Funders` (shown, hidden). axe clean on the dark band at 375 and 1440.
