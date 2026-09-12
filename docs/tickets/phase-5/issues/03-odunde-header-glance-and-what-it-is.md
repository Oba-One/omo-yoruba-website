# 03: /odunde from the header to "What Odunde is"

Labels: design, content
Status: open
Blocked by: 02

**What to build:** `/odunde` renders from Sanity: the page header (photo band or slim by `phead`), the
glance strip for the next festival edition with Pending chips for every missing fact, and "What
Odunde is" with its Portable Text and figure. The route caches by type tag, the Presentation tool
opens it, and click-to-edit reaches the photographs and the `phead` option in draft mode.

- [ ] `@oy/content`: `pageEdition` (and `pastEdition`) beside the season rule, tested; `festivalPageQuery` (one `defineQuery`); `festivalPage.whatItIsImage`; TypeGen
- [ ] `@oy/ui`: `PageHeader` (slim, photo, kicker, title, line, up to two actions with one gold, the date line with Pending chips), `GlanceStrip` (four and five facts, a Pending fact), `Prose` (astro-portabletext 1.0.0, the four overrides, the node coverage test), the figure through `PhotoTile`, a page root for page-section stories; each variant a story, each empty state Pending
- [ ] `Pages/Odunde/Phead` stories: photo and slim
- [ ] `packages/web`: `buildFestivalPage` (pure, tested), `odunde.astro` with `cachePage`, the body attributes, the edit attributes
- [ ] Seed: `whatItIsImage` with the prototype's photograph, framing and caption
- [ ] Playwright: one h1, the header, glance and figure present with and without Studio data; axe clean at 375 and 1440

## Comments
