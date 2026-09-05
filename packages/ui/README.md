# @oy/ui

Every visual component, as `.astro`, with a colocated `*.stories.ts` and
`*.test.ts`. Layout: `src/<group>/<Name>/<Name>.astro`. Groups follow
`docs/design/README.md` section 5: core, page, cards, content (the map's lists and rows),
media, forms, navigation (SiteNav, SiteFooter, Logo), bands (EventBand, TakePartBand,
PatternBand); `docs/design/COMPONENT-MAP.md` holds the inventory. `src/fixtures/` holds seed-shaped story data
(confirmed facts and Pending states only). Imports nothing from `packages/web`.
