# 04: ProgramCard, PullQuote and NewsCard

Labels: design
Status: resolved
Blocked by: 02

**What to build:** `ProgramCard` (photo or placeholder, name, blurb, the quiet action; the
highlighted card takes the gold ring and moves first under `data-highlight`; the Collective's link
reads green), `PullQuote` (ayo dots, the quote, name and relation; initials only when there is no
permission to name; a Pending card when there is no voice) with the proverb line under the voices,
and `NewsCard` (month and year, kicker, title, summary, the quiet link only when the page supplies
one).

- [x] Stories: four, three and pairs of program cards, the highlighted card, Pending; a named quote, an initials quote, Pending; a news card with and without a link, Pending
- [x] Dates render as "July 2026" from the post's ISO date
- [x] `bun run test` passes in `@oy/ui`

## Comments

12 September 2026. `cards/ProgramCard` (the highlight classes `v2-prog--school` and
`v2-prog--collective` from the ported CSS, the green Collective link, the hub fallback link),
`cards/PullQuote` (`initials.ts` for the no-permission caption; the Pending card carries the
registry's "member voices"), `cards/NewsCard` (`date.ts` for "July 2026"; no link until the News
page exists) and `content/ProverbLine` (the sun crest token).
