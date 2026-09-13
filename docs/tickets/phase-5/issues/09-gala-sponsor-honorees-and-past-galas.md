# 09: Sponsor the Gala, honorees and past galas

Labels: design, content
Status: resolved
Blocked by: 06, 07

**What to build:** the rest of `/gala`: sponsor levels as list rows (Pending when none) with the one
gold "Sponsor the Gala" action and the impact handoff; honorees (hidden by default through `awards`;
shown, the edition's honorees as this year and the rest as previously honored, or the Pending line);
past galas as the carousel from the newest past gala's album with its credit, shown or hidden by
`past`.

- [x] `@oy/content`: `awards` defaults to hidden; the query carries sponsor levels (gala and org), honorees and the past album
- [x] `@oy/ui`: `ListRow` in its sponsor tier form and `PersonCard` (with and without a portrait) for honorees; stories and tests
- [x] `Pages/Gala/Awards` (hidden, shown) and `Pages/Gala/Past` (shown, hidden) stories
- [x] Playwright: one gold action in the sponsor section; honorees absent by default

## Comments

12 September 2026. `awards` now defaults to hidden (the development dataset keeps its stored `shown`
until the owner switches it, spec Q5) and `sponsorLevel` reaches `/gala` only; the registry gains a
level's amount and recognition rows. `cards/ListRow` ships its sponsor tier form (name as a heading,
amount, the ticked recognition, chips for what is owed) inside `content/SponsorLevels` (the Pending line
with no levels); `cards/PersonCard` draws a portrait above or the woven tick without one. The sponsor
section ends with its one gold "Sponsor the Gala", the line "Four questions, and we send the deck with
our impact numbers." (the sponsor form has four fields) and the impact handoff. `honoreeCards` puts this
gala's honorees first as "This year", then earlier ones newest first as "Previously honored" with the
year leading the bio, and holds back honorees of a later gala. Past galas reuse the carousel and the
credit line through `pastAlbumView`, now shared with the festival page, with "All gala albums" and the
way to Odunde. The carousel specs run on both routes. Gala 2026 holds no levels or honorees, so both
sections show their Pending lines; the Gala 2025 album's six photographs fill the carousel.

