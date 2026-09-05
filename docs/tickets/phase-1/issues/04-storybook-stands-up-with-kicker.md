# 04: Storybook renders Kicker as a .astro component with the design system theme

Labels: infra, design
Status: resolved
Blocked by: 02, 03

**What to build:** `bun storybook` from the repo root opens a themed Storybook (indigo bar, paper
ground, gold accent, Source Sans 3 UI, the exact values at the bottom of
`docs/design/COMPONENT-MAP.md`) whose preview loads `@oy/tokens`, offers white, paper and
indigo-900 backgrounds (the dark one wraps the story in `.oy-dark`), runs `addon-a11y`, and shows
the first `.astro` component, `Kicker`, with Default, Single, Pending and OnDark stories that render
the diacritics test string. `bun run --filter @oy/ui build-storybook` produces `storybook-static`.
`@oy/ui` typechecks with `astro check`, and a Vitest test renders the Kicker stories.




- [x] `packages/ui/.storybook/main.ts`, `preview.ts`, `manager.ts` and `theme.ts` exist; stories
      are discovered from `packages/ui/src/**`
- [x] The placeholder `storybook` and `build-storybook` scripts in `@oy/ui` are replaced and both
      run green
- [x] `Kicker.astro`, `Kicker.stories.ts` and `Kicker.test.ts` sit in `src/core/Kicker/`
- [x] The `typecheck` script of `@oy/ui` is `astro check` and passes
- [x] `bun run check` passes at the root
- [x] Anything the framework stubs or refuses is written into the checkpoint notes (ticket 10)
