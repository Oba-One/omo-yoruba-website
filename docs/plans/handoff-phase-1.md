# Handoff: Phase 1, tokens and the Storybook proof

Written 5 September 2026 at the end of the Phase 1 session, for the owner's checkpoint
(wayfinder ticket 16) and the session that runs Phase 2 (`docs/design/PROMPTS.md`). Branch:
`phase-1/tokens-and-storybook`, one pull request against `main`. Tickets:
`docs/tickets/phase-1/issues/` (ten, all resolved). Research with sources:
`docs/research/phase-1-storybook-chromatic.md` and `docs/research/fonts-source-serif-sans-subsets.md`.

## Does .astro hold up in Storybook

Yes, for everything Phase 1 asked. Seven `.astro` components render in Storybook 10.6.0 through
`@storybook-astro/framework` 1.11.0 in static mode with the design system theme; 57 stories
prerender at build time; autodocs pages come from the frontmatter JSDoc; the a11y panel runs;
hover, focus and pressed states come from `storybook-addon-pseudo-states`; the fonts load from the
plain `fonts.css`; Vitest composes the stories and renders them through the framework, 36 tests in
`packages/ui` and 85 across the repo. The owner decides ticket 16; nothing pivots without them.

What is stubbed or limited, as found (details and sources in the research note):

- Static builds prerender every story: controls are read-only, decorators are frozen with each
  story's globals (story level `globals` do reach them, which the OnDark stories rely on), and a
  `play` function on an Astro story is unverified upstream in the canvas. The first interactive
  component (SiteNav, Phase 3) tests `play`.
- Client `<script>` tags in a component do not run in Vitest (the container API renders HTML
  only); the canvas re-executes them.
- Slot strings are sanitised: `class`, `id`, `role`, `lang`, `aria-*` survive; `style`, `data-*`
  and tags such as `section`, `nav`, `header`, `footer`, `button`, `svg` are dropped. Story
  wrappers therefore use classes from `.storybook/preview.css`.
- Not available in stories: `astro:actions`, `astro:env`, content collections, view transitions,
  server islands, middleware. `astro:assets` `<Image>` works through a passthrough service (no
  resizing in Storybook).
- a11y is panel only: CI enforcement needs `@storybook/addon-vitest` with Playwright browser mode,
  left for Phase 3 alongside the Playwright and axe work.

Workarounds that were needed:

- Image imports inside a component resolve to dev-only `/@fs/` paths in the prerendered HTML.
  The framework rewrites them to emitted assets, but only for files present in the client bundle
  (`.astro` imports never reach it) and only when the emitted hash is alphanumeric (Vite 8's
  base64url hashes are not). `Logo.stories.ts` imports its two PNGs as `?url` assets and
  `.storybook/main.ts` sets Rolldown's `hashCharacters` to `base36`. Worth an upstream issue.
- The framework's `Preview` type is the CSF factories flavour; the plain preview object is typed
  `ProjectAnnotations<AstroRenderer>`. It exports no `Meta` or `StoryObj`; `src/storybook.ts`
  defines them over `AstroRenderer` the way every Storybook renderer does.
- The framework's Vitest `defineConfig` resolves `astro/config` from `process.cwd()`; with Bun's
  isolated linker that fails from the repo root, so `packages/ui/vitest.config.ts` passes
  `root` as the package directory.
- `storybook-addon-pseudo-states` with `hover: true` puts every element in the state, wrapper
  included; the Button stories target `.oy-btn`.

## What exists now

- `@oy/tokens`: the design system ported in load order (fonts, tokens, base, components, the
  interaction layer on top), `--radius-card` 6px and `--radius-media` 4px as tokens, five pattern
  SVGs as `--pattern-*` url tokens, `fonts.css` with hand-written `@font-face` rules over the pinned
  `@fontsource-variable` packages (latin, latin-ext, vietnamese; Noto, Georgia and system-ui in the
  stacks), a guard test, and a README that lists every edit of the port.
- `@oy/ui`: `core/Kicker`, `core/Button`, `core/Divider`, `core/Pending`, `bands/PatternBand`,
  `media/ImagePlaceholder`, `navigation/Logo`, each with `.astro`, `.stories.ts` and `.test.ts`;
  `.storybook/` with `main.ts`, `preview.ts`, `preview.css`, `manager.ts`, `theme.ts`;
  `src/storybook.ts` (story types, `onDark`, `wrap`, the test string); `src/test/setup.ts` and
  `src/test/stories.ts`; `typecheck` is `astro check`; `vercel.json` for the Storybook deploy.
- CI: fifth job `Storybook build and Chromatic` (builds `storybook-static`, publishes to Chromatic
  through `chromaui/action` pinned to `2a0b63f30233c48591844a46d451b9cf68128186`, v18.7.2, only
  when `CHROMATIC_PROJECT_TOKEN` exists; otherwise a "Chromatic skipped" notice and a green job).
  Chromatic modes snapshot at 375 and 1440. Add the context `Storybook build and Chromatic` to the
  branch protection (`docs/runbook.md`, CI and merging).
- Lint: the Yoruba check now masks BEM double-hyphen names (`.oy-ph--adire`); Biome exempts the
  vendored pattern SVGs and turns `noDescendingSpecificity` and `noImportantStyles` off for the
  ported CSS; `.lintignore` exempts the two Storybook files that must hold colour literals.
- Docs: ADRs 0002 and 0008 record the outcome; `docs/design/COMPONENT-MAP.md` describes the
  props and variants as built and points at `packages/ui/.storybook`; wayfinder ticket 19 is
  resolved (fonts) and ticket 16 carries the checkpoint notes; `docs/runbook.md` has the Storybook
  deploy and the CI job.

## Decisions made without the owner (reverse any)

- Source Serif 4 ships the optical size files the handoff's Google Fonts request asked for
  (about 253 KB across three subsets against 106 KB for weight-only); italics are declared for
  both families and download only when used; Noto stays a name in the stack, not a shipped file.
- Yoruba text must stay NFC (a decomposed base plus mark splits across two font files and loses
  its anchors); the test string is NFC. Where to enforce it (Sanity, loader, lint) is open.
- The retired AmountSelector and MultiStepForm CSS blocks and the canvas-only helpers were left
  out of the port; everything else is verbatim.
- Component choices: a disabled link drops its `href` (an `aria-disabled` link with an `href` is
  still keyboard reachable); a busy Button keeps focus (`aria-busy`, `aria-disabled`, no
  `disabled`); the Kicker wraps the Yoruba half in `<span lang="yo">`; Pending's block variant
  composes ImagePlaceholder through its default slot; Divider adds `ayo` and `ornament` kinds
  from the canvas; PatternBand adds `flip` for the bottom chevron row.
- Tests use the framework's portable stories with happy-dom 20.14.0 as the Vitest environment;
  the tests assert on markup only (the container returns no scoped CSS).
- Sidebar titles mirror the folders (`Bands/PatternBand`, `Navigation/Logo`), as the component
  map's convention says, although its Core table lists both under Core.
- The Chromatic job runs on pull requests and on pushes to `main`; Chromatic recommends `push`
  only to keep baselines. A fork pull request never runs Chromatic (no secret, skipped by design).
- `chromatic` is not a local dependency; the action runs the CLI. `bunx chromatic` works locally
  with the token if the owner wants a manual run.
- The `/to-tickets` breakdown was not quizzed with the owner (autonomous session); the ten tickets
  are in `docs/tickets/phase-1/issues/`.

## Owner decisions waiting

Ticket 16 (does `.astro` hold up), ticket 11 (Storybook hosting: `packages/ui/vercel.json` assumes
a separate project), ticket 17 (run the wizard; stage 6 creates the Chromatic secret, after which
the CI job starts publishing and the first baselines need accepting), the font trade-offs above,
and whether a11y in CI waits for Phase 3.

## Which document won where they disagreed

- `docs/design/COMPONENT-MAP.md` was edited (props, variants, the `.storybook` path, the sidebar
  groups) although `AGENTS.md` calls `docs/design` a read-only reference: the `oy-component`
  skill's "Done means" asks for the map to be updated when props or variants change, and the map
  is the living inventory. Every original line is in git.
- The type tokens keep the design system's floors (`--text-hero` 38 to 60px, `--text-h2` 30 to
  38px) although the brief says hero 44 to 64 and H2 32 to 40: the prototypes the owner reviewed
  render with the design system values. Raising the floors is the owner's call (tokens README).
- Sidebar titles mirror the folders (`Bands/PatternBand`, `Navigation/Logo`) as the map's
  convention says, although its Core table lists both under Core.

## What the code review changed

The two-axis review (Standards and Spec, `/code-review`) found 14 items; all but one were fixed
before the commit. Fixed: the manager theme now carries exactly the twelve values the component
map specifies (the extended font stacks and ten extra keys are gone); the mark-only Logo names
itself through the image's alt text instead of an `aria-label` on a span; PatternBand reuses the
interaction layer's `.v2-dots`, `.v2-batik` and `.v2-motif` classes instead of restating their
sizes and opacities, and takes the opacity override as an inline style; a Foundations/Type docs
page shows the test string at every size in both faces; the preview no longer exports a named
constant Storybook could read as an annotation; dark Button stories use action verbs; Pending
stories hoist their wrapper; the story types, the tokens test helper and the `.lintignore` note
were renamed or reworded; the ticket checkboxes are ticked and their duplicate headers removed;
the component map's sidebar groups and the research note's repo-fit bullet describe the code as
built. Left open on purpose: `addon-a11y` is verified by hand in the panel, not on every story
(needs the Vitest addon, Phase 3); the ticket box stays unticked.

## Suggested skills for the next session

`/to-tickets` for Phase 2, then `/implement` per ticket; `research` before pinning `sanity`
(v5 in the brief, v6 current, ticket 14), `@sanity/astro` and `@sanity/client`; repo skills
`oy-content-model`, `oy-content-ops`, `oy-component` (for the Pending view chips), `oy-voice`;
`/code-review` before the commit; `/handoff` at the end. Environment quirks (Node 22 path, Bun's
isolated linker, Vitest from the root) are in the session memory and in `packages/ui/README.md`.
