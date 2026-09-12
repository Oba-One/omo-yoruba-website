# 01: The homepage reads from one composed query, with the season rule and the layout defaults

Labels: infra, content
Status: open
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

- [ ] `bun typegen` registers the homepage query result on `SanityQueries` and the drift check is clean
- [ ] `leadEvent` is a tested pure function covering the explicit, kind, dated and calendar cases
- [ ] `bun seed` fills the new fields and photographs in `development` without touching an owner's edit
- [ ] `bun run test` passes in `@oy/content`
