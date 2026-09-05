# @oy/ui

Every visual component, as `.astro`, with a colocated `*.stories.ts` and `*.test.ts`. Layout:
`src/<group>/<Name>/<Name>.astro`. Groups follow `docs/design/README.md` section 5: core
(Kicker, Button, Divider, Pending), page, cards, content (the map's lists and rows), media
(ImagePlaceholder), forms, navigation (SiteNav, SiteFooter, Logo), bands (EventBand,
TakePartBand, PatternBand); `docs/design/COMPONENT-MAP.md` holds the inventory. `src/fixtures/`
holds seed-shaped story data (confirmed facts and Pending states only). Imports nothing from
`packages/web`. Components are imported by path: `@oy/ui/core/Button/Button.astro`.

Styling comes from `@oy/tokens` (the `.oy-*` and `.v2-*` classes); a component's own `<style>`
adds only what the tokens do not cover, with `var(--*)` colours only (`bun lint:colors`).
Components that take content images (from Phase 3 on) accept `ImageMetadata | string |
SanityImageSource` per the component map; the Logo's two PNGs are its own.

## Storybook

`.storybook/` holds the config: `main.ts` (`@storybook-astro/framework` on
`@storybook/builder-vite`, stories from `src/**`, `addon-a11y`, `addon-docs`), `preview.ts`
(loads `@oy/tokens`, backgrounds white, paper and indigo-900 with the `.oy-dark` decorator),
`manager.ts` and `theme.ts` (the values at the bottom of `docs/design/COMPONENT-MAP.md`).
Commands from the root: `bun storybook` (dev server on port 6006) and
`bun run --filter @oy/ui build-storybook` (writes `storybook-static`, which `vercel.json` deploys
as its own project with Root Directory `packages/ui`; hosting is wayfinder ticket 11).

## Checks

`bun run --filter @oy/ui typecheck` runs `astro check`. `bun run test` runs the Vitest tests:
`vitest.config.ts` uses the framework's `defineConfig`, `src/test/setup.ts` loads the preview
annotations, and each `*.test.ts` composes its stories (`composeStories`) and renders them with
`renderStory` into happy-dom, so the tests exercise the same args, slots and decorators Storybook
shows. Rendering runs through Astro's container API, which returns no scoped `<style>`, so tests
assert on markup, not CSS.

## Known limits of the Storybook framework

- Static builds prerender every story at build time: controls are read-only, decorators are
  frozen with the story's globals, and client `<script>` tags do not run in Vitest.
- Image imports inside a component resolve to dev-only paths; the build rewrites them to emitted
  assets only for files that reach the client bundle with an alphanumeric hash. `Logo.stories.ts`
  imports its two PNGs as `?url` assets and `.storybook/main.ts` asks Rolldown for base36 hashes
  for that reason.
- Slot strings are sanitised: `class`, `id`, `role` and `aria-*` survive; `style`, `data-*` and
  tags such as `section`, `nav`, `button` and `svg` are dropped. Stage and wrapper styling for
  stories lives in `.storybook/preview.css` classes.
- `astro:actions`, `astro:env`, content collections, view transitions and server islands are not
  available in stories. Details and sources: `docs/research/phase-1-storybook-chromatic.md`.
