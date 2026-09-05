# @oy/ui

Every visual component, as `.astro`, with a colocated `*.stories.ts` and
`*.test.ts`. Layout: `src/<group>/<Name>/<Name>.astro`. Groups follow
`docs/design/README.md` section 5: core, page, cards, content (the map's lists and rows),
media, forms, navigation (SiteNav, SiteFooter, Logo), bands (EventBand, TakePartBand,
PatternBand); `docs/design/COMPONENT-MAP.md` holds the inventory. `src/fixtures/` holds seed-shaped story data
(confirmed facts and Pending states only). Imports nothing from `packages/web`.

Storybook lives here too: `.storybook/` holds the config and the manager theme from
`docs/design/COMPONENT-MAP.md` (bottom section), empty until Phase 1 adds
`@storybook-astro/framework` and `@storybook/builder-vite`. `bun storybook` from the root
runs it, and it deploys as its own Vercel project with Root Directory `packages/ui`.
