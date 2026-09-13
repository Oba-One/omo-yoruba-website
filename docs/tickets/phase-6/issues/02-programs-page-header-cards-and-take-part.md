# 02: The Programs page: header, cards and take part

Labels: design, content
Status: resolved
Blocked by: 01

**What to build:** `/programs` renders from Sanity (spec Q2): the slim header with the Studio's kicker,
heading, line and actions; the four program cards with the Programs prototype's when line (the cadence
and the ages, each its chip while empty), Lessons and the Collective linking to their pages and the
inline programs "On this page" to their sections; the cards note; the `cards` option (four, three with
the fourth program's section leaving with its card, pairs); and the take-part band with the page's rows
and the counted lead. The page is cached, previews in the Presentation tool with its edit attributes,
and names every owed item with the registry's wording.

- [x] `@oy/content`: `programsPageQuery` (the singleton, every program in order); the header row in the
      registry; the route map and Presentation for the page; the `cards`, `inline` and `yearstrip`
      option names in the stega filter; TypeGen
- [x] `packages/web`: the Programs builder on the page skeleton, tested with a fixture of the seeded
      dataset; the route with `cachePage` and the edit attributes
- [x] `@oy/ui`: `ProgramCard` draws the when line with its chips (a story and a test); `CardGrid` keeps
      the three variants; `Pages/Programs/Cards` stories (four, three, pairs) on fixtures of confirmed facts
- [x] Playwright: one h1, the nav's Programs current, nothing open on load, the cards and their links,
      the take-part rows and their forms, the option on the body; axe clean at 375 and 1440

## Comments

13 September 2026. `@oy/content`: `programsPageQuery` in `queries/program-pages.ts` filters by type and
id, which gives TypeGen the singleton's own type (the event page queries, filtering by id only, still
come back as a union over every document type: a follow-up worth taking when they next change). The
registry gains a heading row for each program singleton; the Programs options join the stega filter.
`packages/web`: `buildProgramsPage` on the page skeleton (seven tests from the seeded dataset): every
program in order, the first three under `three`, the prototype's photograph heights (160px, 200px under
`three`), Lessons and the Collective linking to their pages and the inline programs "On this page" to
`#kids` and `#exchange`, the take-part intro counting the rows. The route caches with the failed-read
rule and carries the cards option's edit attribute. `@oy/ui`: `ProgramCard` draws the prototype's when
line (cadence and ages, each its registry chip) above its own heading, and takes the photograph's
height; `Card` declares the `style` it passes through; `CardGrid` closes with an optional muted note; the
tokens port `.pg-when` and add `.oy-visually-hidden`, which the page's hidden "The programs" heading uses
so the cards' h3s never follow the h1 directly (the prototype's section has no heading).
`Pages/Programs/Cards` stories (four, three, pairs). Playwright `programs.spec.ts`: 10 passed seeded and
10 with the placeholder project.
