# 04: ProgramCard, PullQuote and NewsCard

Labels: design
Status: open
Blocked by: 02

**What to build:** `ProgramCard` (photo or placeholder, name, blurb, the quiet action; the
highlighted card takes the gold ring and moves first under `data-highlight`; the Collective's link
reads green), `PullQuote` (ayo dots, the quote, name and relation; initials only when there is no
permission to name; a Pending card when there is no voice) with the proverb line under the voices,
and `NewsCard` (month and year, kicker, title, summary, the quiet link only when the page supplies
one).

- [ ] Stories: four, three and pairs of program cards, the highlighted card, Pending; a named quote, an initials quote, Pending; a news card with and without a link, Pending
- [ ] Dates render as "July 2026" from the post's ISO date
- [ ] `bun run test` passes in `@oy/ui`
