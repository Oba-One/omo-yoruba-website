# All components are .astro, and Storybook runs them through @storybook-astro/framework

Every visual component lives in `@oy/ui` as a `.astro` file with a colocated story and
test, and Storybook renders them with `@storybook-astro/framework` on
`@storybook/builder-vite`. No React or other framework components ship to the site.

## Consequences

- `astro:assets` and `astro:fonts` are stubbed in stories; image props accept a plain URL
  so stories can render, and `@oy/tokens` ships a plain `fonts.css`.
- If the framework blocks a component after a reasonable attempt, the session stops and
  asks the owner. A pivot to islands or another format is the owner's call, never silent.

## Phase 1 outcome, 5 September 2026

The proof held: seven `.astro` components (Kicker, Button, Divider, Pending, PatternBand,
ImagePlaceholder, Logo) render in Storybook 10.6.0 through `@storybook-astro/framework` 1.11.0 in
static mode, with 57 prerendered stories, autodocs from the frontmatter JSDoc, the a11y panel,
`storybook-addon-pseudo-states` for hover, focus and pressed, and Vitest tests that compose the
stories (`composeStories`) and render them with the framework's `renderStory`. Fonts load from the
plain `fonts.css` in `@oy/tokens`.

Stubbed or limited, as found: controls are read-only in static builds and decorators are frozen
with each story's globals; client `<script>` tags do not run in Vitest; slot strings are sanitised
(`style`, `data-*` and several tags are dropped); image imports inside a component resolve to dev
paths that the build rewrites only for files present in the client bundle with an alphanumeric
hash, so `Logo.stories.ts` imports its PNGs as `?url` assets and `.storybook/main.ts` sets base36
hashes. Not available in stories: `astro:actions`, `astro:env`, content collections, view
transitions, server islands. Sources: `docs/research/phase-1-storybook-chromatic.md`. Whether the
framework holds for the interactive components of Phase 3 onward is the owner's call in wayfinder
ticket 16; nothing pivots without it.

Owner decision, 5 September 2026: the checkpoint closed with the merge of pull request #2
(https://github.com/Oba-One/omo-yoruba-website/pull/2). `.astro` holds; the stubs and workarounds
carry in wayfinder ticket 16's answer. No pivot.
