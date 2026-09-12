# 09: Sponsor the Gala, honorees and past galas

Labels: design, content
Status: open
Blocked by: 06, 07

**What to build:** the rest of `/gala`: sponsor levels as list rows (Pending when none) with the one
gold "Sponsor the Gala" action and the impact handoff; honorees (hidden by default through `awards`;
shown, the edition's honorees as this year and the rest as previously honored, or the Pending line);
past galas as the carousel from the newest past gala's album with its credit, shown or hidden by
`past`.

- [ ] `@oy/content`: `awards` defaults to hidden; the query carries sponsor levels (gala and org), honorees and the past album
- [ ] `@oy/ui`: `ListRow` in its sponsor tier form and `PersonCard` (with and without a portrait) for honorees; stories and tests
- [ ] `Pages/Gala/Awards` (hidden, shown) and `Pages/Gala/Past` (shown, hidden) stories
- [ ] Playwright: one gold action in the sponsor section; honorees absent by default

## Comments
