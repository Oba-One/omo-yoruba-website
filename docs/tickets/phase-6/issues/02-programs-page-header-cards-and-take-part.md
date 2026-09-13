# 02: The Programs page: header, cards and take part

Labels: design, content
Status: open
Blocked by: 01

**What to build:** `/programs` renders from Sanity (spec Q2): the slim header with the Studio's kicker,
heading, line and actions; the four program cards with the Programs prototype's when line (the cadence
and the ages, each its chip while empty), Lessons and the Collective linking to their pages and the
inline programs "On this page" to their sections; the cards note; the `cards` option (four, three with
the fourth program's section leaving with its card, pairs); and the take-part band with the page's rows
and the counted lead. The page is cached, previews in the Presentation tool with its edit attributes,
and names every owed item with the registry's wording.

- [ ] `@oy/content`: `programsPageQuery` (the singleton, every program in order); the header row in the
      registry; the route map and Presentation for the page; the `cards`, `inline` and `yearstrip`
      option names in the stega filter; TypeGen
- [ ] `packages/web`: the Programs builder on the page skeleton, tested with a fixture of the seeded
      dataset; the route with `cachePage` and the edit attributes
- [ ] `@oy/ui`: `ProgramCard` draws the when line with its chips (a story and a test); `CardGrid` keeps
      the three variants; `Pages/Programs/Cards` stories (four, three, pairs) on fixtures of confirmed facts
- [ ] Playwright: one h1, the nav's Programs current, nothing open on load, the cards and their links,
      the take-part rows and their forms, the option on the body; axe clean at 375 and 1440

## Comments
