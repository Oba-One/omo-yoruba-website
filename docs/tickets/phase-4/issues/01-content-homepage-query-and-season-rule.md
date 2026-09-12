# 01: The homepage reads from one composed query, with the season rule and the layout defaults

Labels: infra, content
Status: resolved
Blocked by: None (can start immediately)

**What to build:** in `@oy/content`, the one GROQ query the homepage runs (`defineQuery`, typed by
TypeGen): the singleton with its hero, stats, voices, year-in-life tiles and doors resolved, the
festival and gala editions, the programs in order and the three newest news posts. The `leadEvent`
rule for the `season` option (explicit reference, then the kind's nearest edition, then auto by date
or by calendar). The layout defaults every page singleton carries, read from the schema so the seed
and the site agree. The small fields the prototype's copy needs (the hero blessing, the voices intro
and proverb, a program's action), seeded with the prototype's words and the register's photographs
for the two program cards and the two doors. An image URL builder from the asset reference. A stega
filter that keeps the keys the site branches on clean.

- [x] `bun typegen` registers the homepage query result on `SanityQueries` and the drift check is clean
- [x] `leadEvent` is a tested pure function covering the explicit, kind, dated and calendar cases
- [x] `bun seed` fills the new fields and photographs in `development` without touching an owner's edit
- [x] `bun run test` passes in `@oy/content`

## Comments

12 September 2026. Built and seeded. `homepageQuery` in `packages/content/src/queries/homepage.ts`
(the `queries.ts` module became a folder), `leadEvent` and `calendarKind` in `src/lead-event.ts`,
`layoutDefaults` and `withLayoutDefaults` in `src/layout.ts` (the seed imports the same
function), `createImageSet` in `src/images.ts`, `stegaFilter` in `src/stega.ts`, `tagsForRoute`
and a filtered `pendingWhat`. Schema: `hero.blessing`, `voicesIntro`, `voicesProverb`,
`program.action`. The seed now patches one level into objects (`missingFields`) so the blessing
landed inside the existing hero; `bun seed` updated six documents in `development` (the homepage,
two programs with photographs and actions, a third with its action, the member and partner doors
with photographs). TypeGen registered the query; 122 tests pass in the package.
