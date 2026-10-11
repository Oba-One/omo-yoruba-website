# @oy/ui

Every visual component of the site, as `.astro` files, each with its Storybook stories and its
Vitest test. Pages in `packages/web` arrange these parts and never style one themselves; the
library imports nothing from `packages/web`.

## What lives where

- `src/<group>/<Name>/`: one component per folder, `<Name>.astro` beside `<Name>.stories.ts` and
  `<Name>.test.ts`. The groups follow `docs/design/README.md` section 5: `core`, `page`, `cards`,
  `content`, `media`, `forms`, `navigation` and `bands`. `docs/design/COMPONENT-MAP.md` is the
  inventory, with each component's props and states. `src/content/` also keeps the pure text
  helpers (`edition-dates.ts`, `vendor-terms.ts` and the rest), and `src/foundations/Type.mdx` is
  the type specimen page.
- Import a component by its path: `@oy/ui/core/Button/Button.astro`.
- `src/fixtures/`: story data shaped like the seed, holding confirmed facts and Pending states only;
  the photographs come from `docs/design/design/images/w2` as URL assets.
- `src/pages/<page>/`: the page-section stories, one per layout option, built from the fixtures by
  the `sections.ts` beside them.
- `src/media/image.ts`: the image a component takes (`ImageInput`): a URL, Astro's `ImageMetadata`,
  or the set the site builds from a Sanity asset with `createImageSet` (ADR 0022). The Logo's images
  are its own.
- `.storybook/`: `main.ts`, `preview.ts` (the tokens, the backgrounds and the `.oy-dark` decorator),
  `manager.ts` and `theme.ts` (the values at the bottom of COMPONENT-MAP).
- Interactive components are custom elements in an inline script (ADR 0018); a document-level
  listener that claims a click registers once, at definition, and a history write keeps
  `history.state` (ADR 0041).

## Commands

From the repo root:

| Command | Does |
| --- | --- |
| `bun storybook` | Storybook on port 6006 |
| `bun run --filter @oy/ui build-storybook` | the static build in `storybook-static`, which CI builds and sends to Chromatic when its token is set; where it is hosted is wayfinder ticket 11 |
| `bun run test` | the component tests, with every other package's |
| `bun run --filter @oy/ui typecheck` | `astro check` |

A test composes its stories (`composeStories`) and renders them into happy-dom with the helpers in
`src/test/`, so it sees the args, slots and decorators Storybook shows. Astro's container API
returns no scoped `<style>`, so tests assert markup and ARIA state, never CSS.
That render never runs a component's script: `renderLive` runs a story's inline script, exactly as
shipped, where a test needs the element's behaviour, as the Give Dialog's tests do for Zeffy's
messages and the timer (ADR 0045).

## Rules that matter most here

- Styling comes from `@oy/tokens` (the `.oy-*` and `.v2-*` classes). A component's own `<style>`
  adds only what the tokens lack, with `var(--*)` colours only (`bun lint:colors`).
- Field specs and every form sentence come from `@oy/content/enquiry-kinds`; nothing is copied.
- An interactive component carries its behaviour in a `<script is:inline>` of plain JavaScript that
  defines a custom element and sets `data-ready` once wired (ADR 0018): `oy-site-nav`,
  `oy-newsletter`, `oy-enquiry-modal`, `oy-zeffy-dialog` (the Give Dialog and the Join Dialog, ADR 0050),
  `oy-photo-carousel` (ADR 0027), `oy-lightbox` (ADR 0037) and `oy-video` (ADR 0051). `Accordion` and
  `Disclosure` are native `details` with no script
  (ADR 0032). A play function waits for `data-ready`, then drives the keys; Playwright proves what
  a story cannot, such as a touch swipe (ADR 0038).

Adding or changing a component: the `oy-component` skill. The visual rules: the `oy-design-system`
skill.

## Known limits of the Storybook framework

- Static builds prerender every story: controls are read-only, decorators freeze with the story's
  globals, and client scripts never run in Vitest unless a test renders through `renderLive`.
- Slot strings are sanitised: `class`, `id`, `role` and `aria-*` survive; `style`, `data-*` and tags
  such as `section`, `nav`, `button`, `template`, `iframe` and `svg` are dropped. Story wrappers use
  classes from `.storybook/preview.css`. A slot can also be a configured component,
  `{ component, props, slots }` (`SlotValue` in `src/storybook.ts`), which is how the Give Dialog
  stories stand in for the Zeffy island.
- A configured slot tree deeper than about ten levels serialises as `[object Object]`. Those
  page-section stories compose the section in a small story-only `.astro` file beside them
  (`src/pages/programs/KidsStemSection.astro`, `ExchangeSection.astro`), outside the
  `<group>/<Name>/` layout.
- A play function that needs a trigger creates it in the DOM (`EnquiryModal.stories.ts`), since a
  slot string loses `data-*`. A synthetic Escape does not fire a dialog's own cancel, so the
  elements close on Escape themselves. A story that needs a viewport sets `globals.viewport`: the
  in-app browser is narrower than 880px.
- Image imports resolve to dev-only paths, and the static build rewrites them only for files that
  reach the client bundle with an alphanumeric hash. Every story that renders the Logo passes its
  images as `parameters.staticBuildAssets` (`navigation/Logo/story-assets.ts`), and
  `.storybook/main.ts` asks Rolldown for base36 hashes.
- `astro:actions`, `astro:env`, content collections, view transitions and server islands do not
  exist in stories. A form hands its submission to `window.oySubmit` when the site provides it and
  posts natively otherwise, so a story never reaches an action.

Details and sources: `docs/research/phase-1-storybook-chromatic.md`.
