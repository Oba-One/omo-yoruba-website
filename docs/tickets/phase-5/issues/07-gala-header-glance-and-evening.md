# 07: /gala from the header to the evening

Labels: design, content
Status: resolved
Blocked by: 04, 05

**What to build:** `/gala` renders from Sanity: the photo header (formal or warm by `treatment`), the
glance for the next Gala (date, doors, venue, dress, and "Seats from" derived from the tiers, each
Pending when missing), the evening with its intro and running order (shown or hidden by `schedule`,
a Pending line with no rows), the seam, and the take-part band from `galaPage.takePart[]`. Cached,
previewable and click-to-edit as `/odunde`.

- [x] `galaPageQuery` and `buildGalaPage` (pure, tested: the derived seats, the next edition)
- [x] The warm treatment's rules in the tokens (grounds, scrim, seams), a seam divider in `Divider`
- [x] `Pages/Gala/Treatment`, `Pages/Gala/Schedule`, `Pages/Gala/Labels` stories
- [x] `gala.astro` with `cachePage`, the body attributes and edit attributes; Playwright smoke in both data modes, axe at 375 and 1440

## Comments

12 September 2026. `galaPageQuery` reads the singleton, every gala edition with its running order,
tiers in order and album, the sponsor levels scoped to the Gala or the organization and every gala
honoree, so tickets 08 and 09 add no second read. `buildGalaPage` shows the next gala (Gala 2026 stays
ahead until the year ends) and derives "Seats from" from the first buy-now tier's price with the table
tier's price as the note (`seatsFrom`, spec Q9); the glance keeps five facts, so extra facts wait behind
the derived ones. The warm treatment and the seam are ported from the prototype's page style block into
the tokens, with a top-to-bottom warm scrim under 760px so the copy keeps its contrast; `Divider` gains
the seam and `Prose` a plain `text` field for the evening intro, which the registry now lists ("the
evening, in your words"). The Gala 2026 edition holds no date, doors, venue, dress, tiers or running
order, so the header line, the five glance facts and the running order show their chips. Axe runs on
both treatments at 375 and 1440 in both data modes. Left for ticket 10: a long chip wraps into an oval
in a narrow glance cell, and a wrapped header line leaves its bullet at the end of the line.

