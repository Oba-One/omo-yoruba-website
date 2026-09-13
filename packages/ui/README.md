# @oy/ui

Every visual component, as `.astro`, with a colocated `*.stories.ts` and `*.test.ts`. Layout:
`src/<group>/<Name>/<Name>.astro`. Groups follow `docs/design/README.md` section 5: core
(Kicker, Button, ActionButton, Divider, Pending), page (Hero, PageHeader, GlanceStrip, StatStrip,
Section, SectionHead, Split, ButtonRow, CardGrid, Handoff, TakePartBand, YearStrip, Initiative, HomeRoot,
PageRoot, ProgressBar), cards (Card, ProgramCard, SubprogramCard, DoorCard, PathRow, NewsCard,
PullQuote, ZoneCard, TicketTierCard, ListRow, PersonCard), content (Prose, PathRows, ProverbLine,
ZoneGrid, Schedule, ScheduleRow, FactList, PartnerRow, TicketTiers, SponsorLevels, Accordion,
Disclosure, EntryList, EventList, ContactBlock, and the pure helpers
`edition-dates`, `vendor-terms`, `figure-sentence`, `count-word`), media (ImagePlaceholder,
PhotoTile, PhotoMosaic, PhotoCarousel, CreditLine), forms, navigation (SiteNav, SiteFooter, Logo),
bands (EventBand, NewsletterBand, PatternBand);
`docs/design/COMPONENT-MAP.md` holds the inventory. `src/fixtures/` holds seed-shaped story data
(confirmed facts and Pending states only; the photographs import from `docs/design/design/images/w2`
as URL assets). `src/pages/homepage/`, `odunde/`, `gala/`, `programs/`, `lessons/` and `collective/` hold the page-section stories, one
file per layout option (`sections.ts` beside them builds each section from the fixtures). Imports nothing from `packages/web`. Components are imported by path:
`@oy/ui/core/Button/Button.astro`.

Styling comes from `@oy/tokens` (the `.oy-*` and `.v2-*` classes); a component's own `<style>`
adds only what the tokens do not cover, with `var(--*)` colours only (`bun lint:colors`).
Components that take content images accept `ImageInput` from `src/media/image.ts`: a URL string,
Astro's `ImageMetadata`, or the resolved set (`src`, `srcset`, `width`, `height`, `alt`) the site
builds from a Sanity asset reference with `createImageSet` from `@oy/content/images` (ADR 0022);
the Logo's two PNGs are its own. Since Phase 3 the library holds the site chrome
and the forms seam: `navigation/SiteNav` and `SiteFooter`, `forms/Field`, `NewsletterForm`,
`EnquiryCard`, `EnquiryModal` and `GiveDialog`, `page/ProgressBar`. Field specs and every form
sentence come from `@oy/content/enquiry-kinds` (a workspace dependency); nothing is copied.

## Client behaviour: inline scripts and play functions

An interactive component carries its behaviour in a `<script is:inline>` written in plain
JavaScript that defines a custom element guarded by `customElements.get`, reads its copy from
data attributes, and sets `data-ready` on the host once wired (ADR 0018,
`docs/research/phase-3-storybook-play-functions.md`). The framework serves a hoisted `<script>`
untransformed in dev and emits nothing for it in a static build, so this is the one form that
runs in the canvas, in the static build and on the site alike; `<ClientRouter />` leaves inline
scripts alone on navigation and custom elements upgrade on insertion. Since Phase 5 `media/PhotoCarousel` is the third such element (`oy-photo-carousel`, ADR 0027): its four
play stories drive the buttons and the tablist keys. Since Phase 6 `content/Accordion` and
`content/Disclosure` need no script at all: they are native `details` (ADR 0032), whose play functions
click and Tab, since synthetic Enter and Space cannot toggle a summary. A story's `play` function
waits for `data-ready`, then drives the keyboard (a synthetic Escape does not fire a dialog's
own cancel, so the elements close on Escape themselves). Vitest never runs scripts: tests assert
the initial markup and ARIA state; the canvas and Playwright prove the behaviour. Forms hand a
submission to `window.oySubmit` when the site provides it and post natively otherwise, so a
story never reaches an action. Native `<dialog>` elements wear the tokens' scrim class with the
panel inside, so the bottom sheet and the scrim click come from the ported CSS (ADR 0020).

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
  tags such as `section`, `nav`, `button`, `template`, `iframe` and `svg` are dropped. Stage and
  wrapper styling for stories lives in `.storybook/preview.css` classes. A slot may also be a
  configured component, `{ component, props, slots }` (`SlotValue` in `src/storybook.ts`), which
  is how the Give Dialog stories stand in for the Zeffy island.
- A play function that needs a trigger creates it in the DOM (`EnquiryModal.stories.ts`), since
  a slot string cannot carry `data-*` attributes. Stories that need a viewport lock it with
  `globals.viewport` (the in-app browser is narrower than 880px).
- `astro:actions`, `astro:env`, content collections, view transitions and server islands are not
  available in stories. Details and sources: `docs/research/phase-1-storybook-chromatic.md`.
