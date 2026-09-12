# 07: /gala from the header to the evening

Labels: design, content
Status: open
Blocked by: 04, 05

**What to build:** `/gala` renders from Sanity: the photo header (formal or warm by `treatment`), the
glance for the next Gala (date, doors, venue, dress, and "Seats from" derived from the tiers, each
Pending when missing), the evening with its intro and running order (shown or hidden by `schedule`,
a Pending line with no rows), the seam, and the take-part band from `galaPage.takePart[]`. Cached,
previewable and click-to-edit as `/odunde`.

- [ ] `galaPageQuery` and `buildGalaPage` (pure, tested: the derived seats, the next edition)
- [ ] The warm treatment's rules in the tokens (grounds, scrim, seams), a seam divider in `Divider`
- [ ] `Pages/Gala/Treatment`, `Pages/Gala/Schedule`, `Pages/Gala/Labels` stories
- [ ] `gala.astro` with `cachePage`, the body attributes and edit attributes; Playwright smoke in both data modes, axe at 375 and 1440

## Comments
