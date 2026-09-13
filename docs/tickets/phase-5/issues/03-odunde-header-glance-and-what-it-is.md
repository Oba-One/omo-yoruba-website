# 03: /odunde from the header to "What Odunde is"

Labels: design, content
Status: resolved
Blocked by: 02

**What to build:** `/odunde` renders from Sanity: the page header (photo band or slim by `phead`), the
glance strip for the next festival edition with Pending chips for every missing fact, and "What
Odunde is" with its Portable Text and figure. The route caches by type tag, the Presentation tool
opens it, and click-to-edit reaches the photographs and the `phead` option in draft mode.

- [x] `@oy/content`: `pageEdition` (and `pastEdition`) beside the season rule, tested; `festivalPageQuery` (one `defineQuery`); `festivalPage.whatItIsImage`; TypeGen
- [x] `@oy/ui`: `PageHeader` (slim, photo, kicker, title, line, up to two actions with one gold, the date line with Pending chips), `GlanceStrip` (four and five facts, a Pending fact), `Prose` (astro-portabletext 1.0.0, the four overrides, the node coverage test), the figure through `PhotoTile`, a page root for page-section stories; each variant a story, each empty state Pending
- [x] `Pages/Odunde/Phead` stories: photo and slim
- [x] `packages/web`: `buildFestivalPage` (pure, tested), `odunde.astro` with `cachePage`, the body attributes, the edit attributes
- [x] Seed: `whatItIsImage` with the prototype's photograph, framing and caption
- [x] Playwright: one h1, the header, glance and figure present with and without Studio data; axe clean at 375 and 1440

## Comments

12 September 2026. `pageEdition` and `pastEdition` sit beside the season rule and order undated
editions by their kind's season in their year, so an undated 2027 comes before a dated 2028.
`festivalPageQuery` reads every festival edition with the album's first eight photographs and credit,
the zones and the partners, ready for tickets 04 to 06. The registry split the festival's "date and
hours" row into "the date" and "the hours" (the glance shows them in two cells), added the festival
venue, the glance fact, the prose and the figure rows, and `pendingWhat` now answers an array's
item row ("a glance fact") when asked by the array's name; `presenceWhat` answers the presence rows.
`@oy/ui`: `content/edition-dates.ts` (long and short dates and hours in Los Angeles time, shared with
`EventBand`), `page/PageHeader`, `page/GlanceStrip`, `content/Prose` with its four overrides
(`astro-portabletext` 1.0.0 installed in `@oy/ui` after the owner's yes), `PhotoTile`'s `figure`
shape (and a caption's first half marked Yoruba only when it carries Yoruba letters), and three
layout parts the page sections share: `page/PageRoot`, `page/Split`, `page/ButtonRow`. The site's
builders share `lib/sanity/view.ts`. Playwright passes seeded and with the placeholder project on one
worker; with four workers the cold dev server stalls first navigations for every route, the
homepage's included, so local runs use `--workers=1` as CI does. The seed has not run yet: it runs
once with ticket 05's rows.
