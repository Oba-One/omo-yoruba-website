# Does .astro hold up in Storybook

Type: prototype
Status: resolved
Owner: yes
Labels: design
Phase: 1
Blocked by: 11

## Question

The Phase 1 checkpoint: Kicker, Button, Divider, Pending, PatternBand, ImagePlaceholder and Logo built as `.astro` with stories, play functions and Chromatic. The owner looks and decides whether the framework holds. Any pivot is theirs (ADR 0002).

## Comments

5 September 2026, Phase 1 session. The seven components are built as `.astro` with colocated
stories and tests on branch `phase-1/tokens-and-storybook`. To look: `bun storybook` from the
root, or the static build with `bun run --filter @oy/ui build-storybook`. What held: rendering,
props and slots, scoped styles, the design system theme, autodocs from JSDoc, a11y panel, pseudo
states, portable stories in Vitest, 57 prerendered stories, fonts from `fonts.css`. What needed a
workaround: image imports in the static build (`Logo.stories.ts` and base36 hashes in
`.storybook/main.ts`). What is stubbed: controls in static builds, client scripts in Vitest,
`astro:actions`, `astro:env`, content collections, view transitions, server islands. Play functions
on Astro stories are marked unverified upstream in the canvas; the first interactive component
(SiteNav, Phase 3) will test them. Sources and details: `docs/research/phase-1-storybook-chromatic.md`,
`docs/plans/handoff-phase-1.md`, ADR 0002. The decision stays open for the owner.

## Answer

Resolved 5 September 2026. The owner merged pull request #2 (`phase-1/tokens-and-storybook`,
merge commit 52f0024) into `main`, which closes the checkpoint: `.astro` components hold in
Storybook through `@storybook-astro/framework` 1.11.0 and Storybook 10.6.0, and the seven core
components ship with colocated stories and tests. No pivot. Phase 2 onward builds every component
as `.astro` (ADR 0002).

Carried forward from the checkpoint (details and sources in
`docs/research/phase-1-storybook-chromatic.md` and `docs/plans/handoff-phase-1.md`).

Stubbed or limited:

- Static builds prerender every story: controls are read-only and decorators are frozen with
  each story's globals (story level `globals` do reach them). A `play` function on an Astro story
  is unverified upstream in the canvas; the first interactive component (SiteNav, Phase 3) tests it.
- Client `<script>` tags do not run in Vitest; the canvas re-executes them.
- Slot strings are sanitised: `class`, `id`, `role`, `lang` and `aria-*` survive; `style`, `data-*`
  and tags such as `section`, `nav`, `header`, `footer`, `button` and `svg` are dropped.
- Not available in stories: `astro:actions`, `astro:env`, content collections, view transitions,
  server islands, middleware. `astro:assets` `<Image>` works through a passthrough service.
- a11y is panel only; CI enforcement needs `@storybook/addon-vitest` with Playwright browser
  mode (Phase 3).

Workarounds in place:

- Image imports inside a component prerender as `/@fs/` paths; `Logo.stories.ts` imports its PNGs
  as `?url` assets and `.storybook/main.ts` sets Rolldown's `hashCharacters` to `base36` so the
  framework rewrites them.
- The framework's `Preview` type is CSF factories only; `src/storybook.ts` defines `Meta` and
  `StoryObj` over `AstroRenderer`.
- The framework's Vitest `defineConfig` resolves `astro/config` from `process.cwd()`; with Bun's
  isolated linker `packages/ui/vitest.config.ts` passes `root` as the package directory.
- `storybook-addon-pseudo-states` with `hover: true` puts every element in the state; the Button
  stories target `.oy-btn`.

Still open from the checkpoint, none blocking: ticket 11 (Storybook hosting), ticket 17 (the
wizard; stage 6 creates the Chromatic secret), the font trade-offs in the handoff, and whether
a11y in CI waits for Phase 3. Branch protection on `main` lists the five CI contexts (checked
5 September 2026): Typecheck, lint, test; Build packages/web; Commit messages and PR title; Shell
scripts; Storybook build and Chromatic.
