# 06: Impact: how we work, Odunde as civic infrastructure, voices and photographs

Labels: design, content
Status: resolved
Blocked by: 01, 05

**What to build:** the middle of the Impact page. How we work: the account or its chip beside the new
photograph (seeded with the homepage's "Àjọṣe • Partners and friends at the table"). Odunde as civic
infrastructure (unmarked): the seeded prose, the link to the festival page and four cells read from the
editions (attendance and vendors hosted from the newest past festival edition, the festival page's
partner count, the next edition's cost), each empty one its chip (spec Q7). In their words: three voices,
filled by context from the page's testimonials or the homepage's slots. The work in photographs: six tiles
with short captions and "Open the gallery".

- [x] `@oy/content`: `impactPage.howWeWorkImage` (seeded) and `event.vendorsHosted` with registry rows;
      the page's voices row; the caption revisions; the route map (`event` reaches `/impact`); TypeGen
- [x] `@oy/ui`: `PhotoMosaic` draws six in three columns; stories and tests
- [x] `packages/web`: the builder carries the three sections and the civic cells; tested
- [x] Playwright: the cells or their chips, none of the prototype's figures while owed, three voices or
      their slots, six tiles and the gallery link

## Comments

13 September 2026. `impactPage.howWeWorkImage` (seeded with the homepage's Àjọṣe photograph and caption)
and `event.vendorsHosted` (festival editions, the Vendors group) with their rows, the civic prose's row
and the page's voices row; `IMPACT_VOICE_SLOTS` (the homepage's three). The seed's six photographs take the
prototype's short captions, and `bun seed` revised all six stored captions in `development` (6 earlier
seed values revised). `event` reaches `/impact` (the purge test follows). The civic cells read
`pastEdition` (with photographs, as Odunde's past years) and `pageEdition`, the festival page's partner
count and the next edition's cost. `PhotoMosaic` draws six in two rows of three.
