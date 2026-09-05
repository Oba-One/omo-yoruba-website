# Phase 1: Storybook Astro, Storybook 10.6 and Chromatic verified before pinning

Date: 5 September 2026. Method: `npm view <pkg> version|peerDependencies|engines|time` against
the npm registry, the packages installed into a scratch directory with Bun 1.4.2 so the shipped
`dist/*.d.ts`, `src/*.ts` and READMEs could be read (paths below of the form `node_modules/...`
refer to that install; the same files land in the repo after `bun add`), the primary docs named
per bullet, the GitHub REST API for tags and issues (`gh api`), and the Storybook 10.6.0 CLI's own
`--help`. Every pin is exact (`bunfig.toml` sets `exact = true`).

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `@storybook-astro/framework` | 1.11.0 | 1.11.0 (2026-08-27) | Peers `astro ^7`, `storybook ^10`, `vite ^8`; depends on `@storybook-astro/renderer` 1.11.0 exactly; 1.11.0 added JSDoc docgen for autodocs and `@storybook/addon-vitest` support. |
| `storybook` | 10.6.0 | 10.6.0 (2026-09-03) | Every 10.6 addon below peers on `storybook ^10.6.0`. |
| `@storybook/builder-vite` | 10.6.0 | 10.6.0 | The framework preset sets `core.builder` to it; peer `vite ^5 \|\| ^6 \|\| ^7 \|\| ^8`. |
| `@storybook/addon-docs` | 10.6.0 | 10.6.0 | Required for `tags: ['autodocs']` and MDX; brings `react` and `react-dom` as dependencies. |
| `@storybook/addon-a11y` | 10.6.0 | 10.6.0 | axe-core panel; only fails CI through the Vitest addon with `test: 'error'`. |
| `storybook-addon-pseudo-states` | 10.6.0 | 10.6.0 (2026-09-02) | Now lives in the Storybook monorepo and is version locked to core (`storybook ^10.6.0`). |
| `chromatic` | 18.7.2 | 18.7.2 (2026-09-04) | CLI, `engines.node >=22.0.0`; matches the action tag. |
| `chromaui/action` | `2a0b63f30233c48591844a46d451b9cf68128186` (v18.7.2) | v18.7.2 | Pin the commit SHA; `v18.7.2`, `v18` and `latest` all point at this commit today. |
| `astro` in `packages/ui` | 7.3.1 | 7.3.1 | The framework calls `getViteConfig` from `astro/config` resolved from the package that hosts Storybook, so `@oy/ui` needs `astro` as a devDependency (same pin as `packages/web`). |
| `vite` | not pinned | 8.2.2 | Astro 7.3.1 depends on Vite 8 and the framework lists `vite` as a dependency; no separate pin needed unless a resolution conflict appears. |
| `@storybook/addon-vitest` | not added in Phase 1 | 10.6.0 | Needs `@vitest/browser`, `@vitest/browser-playwright`, `playwright` and a second Vitest config (see Portable stories). Peer range recorded in `phase-0-stack-versions.md`. |
| `@chromatic-com/storybook` | not added | 5.3.1 | Visual Tests addon for local runs only; CI snapshots do not need it. |

## Storybook Astro framework 1.11.0

### Install list and peers

- Install command in the docs and both READMEs:
  `npm install -D storybook @storybook/builder-vite @storybook-astro/framework`. The renderer
  README says not to install `@storybook-astro/renderer` directly; the framework depends on it.
  Sources: https://storybook-astro.org/getting-started/installation/,
  `node_modules/@storybook-astro/framework/README.md`,
  `node_modules/@storybook-astro/renderer/README.md`.
- Registry peers for 1.11.0: `vite ^6.4.1 || ^7.0.0 || ^8.0.0`, `astro ^5.5.3 || ^6.0.0 || ^7.0.0`,
  `storybook ^10.0.0`, `typescript ^5.0.0 || ^6.0.0` (optional). Every UI framework peer
  (`@astrojs/react`, `@storybook/react`, `@vitejs/plugin-react` and so on) is optional and only
  needed with an integration. Dependencies: `@storybook-astro/renderer 1.11.0`, `hono ^4.11.12`,
  `get-tsconfig 5.0.0-beta.4`, `sanitize-html ^2.17.0`, `vite`. Engines
  `node >=20.16.0 || >=22.19.0 || >=24.0.0`. Source: `npm view @storybook-astro/framework@1.11.0`.
- Renderer peers: `astro ^5.5.3 || ^6.0.0 || ^7.0.0`, `storybook ^10.0.0`, `@storybook/react`
  optional; dependency `@types/node ^20.19.0`. Source: `npm view @storybook-astro/renderer@1.11.0`.
- Requirements page: Node "20.16.0+, 22.19.0+, or 24.0.0+ (required for Storybook 10's ESM-only
  support)", Storybook 10.0.0+, Astro 5.5.3+, 6.x or 7.x, Vite "6.4.1+ (required by Astro 5), 7.x,
  or 8.x (Astro 7 uses Vite 8)". `npm create storybook@latest` does not recognise Astro, so the
  setup is manual. Source: https://storybook-astro.org/getting-started/requirements/.
- Version compatibility: Astro 7 "makes the Rust-based compiler the default" and "upgrades to Vite
  8"; "no configuration changes are required" from Astro 6; each Astro major has an
  `integration/astro5|6|7` app smoke tested per release.
  Source: https://storybook-astro.org/how-it-works/version-compatibility/.
- The npm tarball README still says "Astro 5 & 6 + Storybook 10" and "Vite 6+"; the peers, docs
  and changelog (1.7.0 "Astro 7 support, verified against Astro 7's Rust compiler and Vite 8")
  are the current truth. Sources: `node_modules/@storybook-astro/framework/README.md`,
  https://storybook-astro.org/reference/changelog/.
- Changelog: 1.11.0 (2026-08-27) JSDoc extraction for autodocs (#163, #110) and
  `@storybook/addon-vitest` support (#159); 1.10.0 (2026-08-02) decorators (#40); 1.9.0 array
  slot sanitisation fix (#149); 1.8.0 configured component slots (#146).
  Source: https://storybook-astro.org/reference/changelog/.

### `.storybook/main.ts`

- Minimum config: `stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)']` and
  `framework: { name: '@storybook-astro/framework', options: {} }`. No `core.builder` entry is
  needed: the framework preset exports `core = { builder: '@storybook/builder-vite', renderer }`.
  Sources: https://storybook-astro.org/reference/configuration/,
  `node_modules/@storybook-astro/framework/src/preset.ts` lines 27 to 28,
  `node_modules/@storybook-astro/framework/dist/preset.d.ts`.
- Types: `StorybookConfig` from `@storybook-astro/framework` is `Omit<StorybookConfig, 'framework'>`
  intersected with `{ framework: { name; options?: FrameworkOptions } }` and `{ viteFinal? }`.
  `defineMain(config)` and `defineStoryRules` come from `@storybook-astro/framework/node`.
  Sources: `node_modules/@storybook-astro/framework/dist/types-xbmzos2q.d.ts`,
  `node_modules/@storybook-astro/framework/dist/node/index.d.ts`.
- `framework.options` (type file plus reference page): `integrations?: Integration[]`
  (factories from `@storybook-astro/framework/integrations`, not needed for a pure `.astro`
  library), `sanitization?: { enabled?, args?, slots?, sanitizeHtml? }`, `resolveFrom?: string`
  (default `process.cwd()`), `fonts?: StorybookFontFamily[]` ("Pass the same array you have in
  your astro.config.ts under fonts:. Currently honored in development; static/server builds fall
  back to no-op stubs"), `docgen?: false | { propFilter?, tsconfigPath? }`,
  `renderMode?: 'static' | 'server'`, `storyRules?`, `server?` (server mode only).
- `renderMode` defaults to `'static'` at runtime (`options.renderMode ?? 'static'`, preset.ts
  line 69) and the reference page says "Defaults to 'static'". The TypeScript union only makes
  `renderMode` optional on the server branch, so write `renderMode: 'static'` explicitly, as the
  repo's own `integration/astro7/.storybook/main.js` does.
  Sources: `node_modules/@storybook-astro/framework/src/preset.ts`,
  https://storybook-astro.org/reference/configuration/,
  https://github.com/storybook-astro/storybook-astro/blob/develop/integration/astro7/.storybook/main.js.
- An `astro.config.*` is not required. `loadUserAstroConfig.ts` looks for `astro.config.ts`,
  `.mjs`, `.js`, `.cjs` under `resolveFrom` and returns empty integrations, fonts and Vite
  plugins when none exists. When one exists its `integrations`, top level `fonts` and
  `vite.plugins` are auto loaded. The Vite config itself comes from
  `getViteConfig({}, { configFile: false, integrations })` imported from `astro/config`, so
  `astro` must resolve from the hosting package. Sources:
  `node_modules/@storybook-astro/framework/src/loadUserAstroConfig.ts`,
  `node_modules/@storybook-astro/framework/src/vitePluginAstro.ts`,
  https://storybook-astro.org/guides/styling/ ("Anything declared in your astro.config.*
  (integrations, vite.plugins, fonts) is also picked up automatically").
- Styling guide: import global CSS from `.storybook/preview.css` in the preview file; scoped
  styles work automatically; `staticDirs: ['../public']` serves fonts and assets; Vite aliases
  must be mirrored with `viteFinal` and `config.resolve.alias`.
  Source: https://storybook-astro.org/guides/styling/.
- Stories glob convention: `.js`, `.jsx`, `.ts` or `.tsx`, colocated next to the component
  (`Card.astro`, `Card.stories.jsx`, `Card.test.ts`). `@storybook/addon-vitest` resolves each
  `stories` entry against `.storybook`, so an absolute glob silently matches nothing.
  Sources: https://storybook-astro.org/writing-stories/, https://storybook-astro.org/guides/testing/.

### `.storybook/preview.ts` and decorators

- Preview type: `import type { Preview } from '@storybook-astro/framework'` for the plain
  object form; `definePreview({...})` from the same package for CSF factories. `Preview<Addons>`
  is `CsfPreview<AstroRenderer & InferTypes<Addons>>`.
  Source: `node_modules/@storybook-astro/framework/dist/index.d.ts`.
- Defaults the renderer adds to every Astro story: `parameters.renderer: 'astro'`,
  `parameters.docs.story.inline: true`, `parameters.docs.story.height: '400px'`,
  `parameters.docs.extractArgTypes`, `parameters.docs.extractComponentDescription`.
  Sources: `node_modules/@storybook-astro/renderer/src/entry-preview.ts`,
  `node_modules/@storybook-astro/renderer/src/preview-defaults.ts`.
- The repo's own `integration/astro7/.storybook/preview.js` imports `./preview.css`, sets
  `tags: ['autodocs']`, and guards global decorators with `ctx.parameters.renderer`.
  Source: https://github.com/storybook-astro/storybook-astro/blob/develop/integration/astro7/.storybook/preview.js.
- Decorator type: `AstroDecorator = DecoratorFunction<AstroRenderer> | AstroComponentFactory`.
  Three documented forms:
  1. Component descriptor:
     `(Story, ctx) => ({ component: Wrapper, props: { theme: ctx.globals.theme } })`
     where `Wrapper.astro` renders `<slot />`. `props` go through the same reconstruct,
     revive and sanitise pipeline as story args.
  2. HTML string: `` (Story) => `<div class="dark-background">${Story()}</div>` ``. `Story()`
     returns a placeholder token that is split out client side; the wrapper string is sanitised
     with the project's sanitisation config.
  3. Bare component: `decorators: [Wrapper]`, sugar for form 1.
  `context.globals`, `context.args` and `context.parameters` are available. Sources:
  https://storybook-astro.org/writing-stories/decorators/,
  https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/docs/specs/decorators.md,
  `node_modules/@storybook-astro/renderer/dist/decorators.d.ts`,
  `node_modules/@storybook-astro/framework/src/astroRenderHandler.ts` (`renderDecoratedRoot`).
- For a `<div class="oy-dark">` wrapper the HTML string form keeps `class`: the framework's own
  sanitise-html allowlist permits `class`, `id`, `role`, `lang`, `title` and `aria-describedby`,
  `aria-hidden`, `aria-label`, `aria-labelledby` on every tag, and `div` is an allowed tag. It
  drops `data-*`, `style`, and the tags `section`, `article`, `nav`, `header`, `footer`, `aside`,
  `main`, `button`, `form`, `input`, `label`, `svg`, `picture`, `video`, `script` (allowed tags
  are `a abbr b blockquote br caption cite code col colgroup dd details dfn div dl dt em figcaption
  figure h1 h2 h3 h4 h5 h6 hr i img kbd li mark ol p pre q rp rt ruby s samp small span strong sub
  summary sup table tbody td tfoot th thead time tr u ul var wbr`). A `Wrapper.astro` decorator is
  not sanitised at all.
  Source: `node_modules/@storybook-astro/framework/src/lib/sanitization.ts`
  (`DEFAULT_SANITIZE_HTML_OPTIONS`), https://storybook-astro.org/guides/sanitization/.
- Static builds freeze decorators: the spec says decorators see `initialGlobals` at build time
  and toolbar changes do not re-render prerendered stories; decorators "cannot react to
  client-side state changes". In `storybook dev` they are recomposed on every change.
  Source: https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/docs/specs/decorators.md.

### Story files

- Documented shape (JSX in the docs, `.ts` allowed): `import Button from './Button.astro'`,
  `export default { title: 'Components/Button', component: Button }`, named exports with `args`.
  "The `args` object in a story maps directly to the component's `Astro.props`"; any
  serialisable value works; a bare Astro component can be passed as a prop (`args: { Icon }`).
  Sources: https://storybook-astro.org/writing-stories/, https://storybook-astro.org/writing-stories/props/.
- Slots: `args.slots.default` for `<slot />`, `args.slots.<name>` for named slots. A slot value is
  an HTML string, a bare Astro component (default props, no content), a configured component
  `{ component: Badge, props: { variant: 'success' }, slots: { default: 'Shipped' } }` (only
  `component` is required), or an array mixing those. String slots are sanitised (see above);
  configured component `props` are not; component tags written inside a string such as
  `'<Badge>hi</Badge>'` are not compiled. Types: `SlotValue = SingleSlotValue | SingleSlotValue[]`.
  Sources: https://storybook-astro.org/writing-stories/slots/,
  `node_modules/@storybook-astro/renderer/dist/types.d.ts`.
- `argTypes` and controls: descriptions, types, defaults and select options are extracted from
  JSDoc on the `Props` interface and the `Astro.props` destructuring; "argTypes still works, and
  wins over anything extracted"; inherited DOM attributes are filtered unless destructured or
  redeclared (`docgen: { propFilter: () => true }` keeps everything). Slots have no TypeScript
  shape, so describe them in the component JSDoc. In static builds controls are disabled for
  Astro stories and a `_astroPrerendered` argType explains why.
  Sources: https://storybook-astro.org/writing-stories/controls/,
  `node_modules/@storybook-astro/renderer/src/entry-preview.ts` (`disablePrerenderedControls`).
- `parameters` work as in any Storybook; the framework reads `parameters.renderer` (defaults to
  `'astro'`; set `'react'` and so on only for framework components).
  Source: https://storybook-astro.org/reference/configuration/.
- TypeScript: the framework exports no `Meta` or `StoryObj`. Its index exports `Args`, `ArgTypes`,
  `Parameters`, `ProjectAnnotations`, `StrictArgs`, `Preview`, `AstroRenderer`, `definePreview`,
  `composeStories`, `composeStory`, `setProjectAnnotations` and the config types. Storybook core
  exports no `StoryObj` either (`storybook/internal/types` has `ComponentAnnotations`,
  `StoryAnnotations`, `PlayFunctionContext`, `DecoratorFunction`, `StoryContext`, `WebRenderer`;
  the `Meta` in `storybook/internal/csf` is the CSF factories class). The pattern every renderer
  uses, read from `@storybook/html` 10.6.0:
  `type Meta<TArgs = Args> = ComponentAnnotations<HtmlRenderer, TArgs>` and
  `type StoryObj<TArgs = Args> = StoryAnnotations<HtmlRenderer, TArgs>`. The Astro equivalent
  (derived, not documented anywhere) is the same two aliases over `AstroRenderer`, whose
  `component` and `storyResult` are typed `any`. The Storybook TypeScript guide's `satisfies Meta`
  and `StoryObj<typeof meta>` idiom then applies unchanged.
  Sources: `node_modules/@storybook-astro/framework/dist/index.d.ts`,
  `node_modules/storybook/dist/types/index.d.ts`, `node_modules/storybook/dist/csf/index.d.ts`,
  `node_modules/@storybook/html/dist/index.d.ts` lines 16 and 28,
  https://storybook.js.org/docs/writing-stories/typescript.
- CSF factories are the other typed route: `definePreview` in preview, `preview.meta({ component })`
  in a story file, `meta.story({ args })`. Storybook 10 marks CSF Next "a preview feature and
  (though unlikely) the API may change in future releases". The framework's own test notes that
  composing a factory story in Node needs `composeStory(story, meta.input)`, not `meta`.
  Sources: https://storybook.js.org/docs/api/csf/csf-next,
  `node_modules/@storybook-astro/framework/src/csf4-decorators.test.ts`.
- `.astro` imports inside `.ts` story files type check through Astro's language server; without
  it, add `/// <reference types="@storybook-astro/framework/shim" />` to a `.d.ts` in the
  package (declares `module '*.astro'`). Sources:
  `node_modules/@storybook-astro/framework/src/shim.d.ts`,
  https://storybook-astro.org/guides/troubleshooting/.
- `play`: the standard Storybook context, `play: async ({ canvas, userEvent }) => {...}` with
  `expect`, `fn`, `within`, `screen`, `userEvent`, `waitFor` from `storybook/test`;
  `canvasElement` is still on `StoryContext`, `canvas` (bound Testing Library queries) is the
  current API. For Astro stories `renderToCanvas` awaits the server HTML, writes it to
  `canvasElement.innerHTML`, hoists stylesheet links into the iframe head and re-executes
  `<script>` tags (module scripts get a cache-busting query) before Storybook runs `play`. The
  roadmap marks play on Astro stories "works under the Storybook Test addon; unverified in the
  canvas" (the Interactions panel path).
  Sources: https://storybook.js.org/docs/writing-tests/interaction-testing,
  `node_modules/storybook/dist/test/index.d.ts`, `node_modules/storybook/dist/chunk-DdLFxT9J.d.ts`
  (`StoryContext.canvas`, `canvasElement`), `node_modules/@storybook-astro/renderer/src/render.tsx`,
  https://storybook-astro.org/guides/roadmap/.

### Portable stories and Vitest

- Yes, the framework exports `composeStories`, `composeStory` and `setProjectAnnotations` from
  `@storybook-astro/framework` (types and setup files) and from
  `@storybook-astro/framework/testing`, which adds `renderStory(story): Promise<string>` and its
  alias `renderAstroStory`. The guide: `renderStory` "renders the composed story and replaces
  `document.body` with its HTML, so `screen` queries resolve against it". Signatures:
  `composeStories(storiesImport, projectAnnotations?)`,
  `composeStory(story, componentAnnotations, projectAnnotations?, exportsName?)`,
  `setProjectAnnotations(annotations | annotations[])`.
  Sources: https://storybook-astro.org/guides/testing/,
  `node_modules/@storybook-astro/framework/dist/testing.d.ts`,
  `node_modules/@storybook-astro/framework/dist/portable-stories-DXT_GOf6.d.ts`.
- Documented test:
  `const { Default } = composeStories(stories); await renderStory(Default);`
  `expect(screen.getByText('My Card Title')).toBeInTheDocument();` with `screen` from
  `@testing-library/dom` and `@testing-library/jest-dom/vitest` matchers.
  Source: https://storybook-astro.org/guides/testing/.
- Vitest config: `defineConfig` from `@storybook-astro/framework/vitest`, typed
  `Omit<InlineConfig, 'plugins' | 'test'>` intersected with
  `{ integrations?; plugins?; astroConfigFile?: false | string; test?: any }`;
  it returns an async config function, wraps Astro's `getViteConfig(vitestConfig, { configFile,
  integrations })` from `astro/config`, raises `testTimeout` to 15000 for the render daemon's cold
  start, and appends the project's `vite.plugins`. Under the hood it renders with
  `experimental_AstroContainer.create()` from `astro/container`, so no hand written container
  code is needed. The live guide says Vitest 4.1.0 or newer (that line is not in the v1.11.0
  tag's copy of the page); the repo pins 4.1.11. The guide sets `test.environment: 'happy-dom'`;
  the repo's astro7 example instead builds a happy-dom `Window` in a setup file and calls
  `setProjectAnnotations([projectAnnotations])`.
  Sources: `node_modules/@storybook-astro/framework/dist/vitest/index.d.ts`,
  `node_modules/@storybook-astro/framework/src/vitest/config.ts` line 124,
  `node_modules/@storybook-astro/framework/src/testing/astro-runtime.ts` line 51,
  https://storybook-astro.org/guides/testing/,
  https://github.com/storybook-astro/storybook-astro/blob/develop/integration/astro7/vitest.config.ts,
  https://github.com/storybook-astro/storybook-astro/blob/develop/integration/astro7/lib/vitest-setup.ts.
- `@storybook/addon-vitest` route (browser tests, play functions, a11y in CI): install
  `@storybook/addon-vitest vitest @vitest/browser @vitest/browser-playwright playwright`, register
  `addons: ['@storybook/addon-docs', '@storybook/addon-vitest']`, and keep a separate
  `vitest.storybook.config.ts` using `storybookTest({ configDir: '.storybook' })` with Playwright
  browser mode. Do not wrap it in the framework's `defineConfig` (double Astro config) and give it
  no `setupFiles`. Source: https://storybook-astro.org/guides/testing/.
- Roadmap known limitation: "Client-side behavior of Astro components requires end-to-end tests
  (Playwright, Cypress) as the Container API doesn't execute script tags".
  Source: https://storybook-astro.org/guides/roadmap/.

### How it renders, what is stubbed, what is unsupported

- Dev mode: the client detects `isAstroComponentFactory`, sends `astro:render:request` over Vite's
  HMR channel with the module id, props and slots; a middleware renders with the Astro Container
  API (`patchCreateAstroCompat` wraps the component) and answers `astro:render:response` with HTML;
  the canvas applies scoped styles and re-runs client scripts. `hono` is a dependency of the
  framework; the docs describe the path as Vite HMR plus middleware.
  Sources: https://storybook-astro.org/how-it-works/architecture/,
  https://storybook-astro.org/how-it-works/dev-mode/, `node_modules/@storybook-astro/renderer/dist/types.d.ts`.
- Static build (`storybook build`, `renderMode: 'static'`): `vitePluginAstroBuildPrerender`
  creates an internal Vite SSR server with `AstroContainer`, loads each story module with
  `ssrLoadModule` for evaluated args, renders every story, injects the HTML as
  `parameters.__astroPrerendered`, and emits assets with hashed names. "Changing args via the
  Controls panel has no effect in static builds." "Stories that override the meta-level
  `component` are not pre-rendered." Source: https://storybook-astro.org/how-it-works/static-builds/.
- Server mode (`renderMode: 'server'`) is "In Progress" and needs a Node render server; not for
  this repo. Source: https://storybook-astro.org/guides/roadmap/.
- Vite 8 and Node 22: covered by the peers and engines above; the framework's CI smoke tests the
  astro7 app (Vite 8). Autodocs: supported, with props tables from frontmatter JSDoc, MDX pages and
  docs blocks; `@storybook/addon-docs` must be registered.
  Sources: https://storybook-astro.org/guides/roadmap/ (Storybook features table),
  https://storybook-astro.org/guides/testing/ (addons example).
- Feature table at v1.11.0 (roadmap page). Supported: component rendering, props and string
  slots, scoped styles, client directives for framework components, static builds, `astro:assets`
  `<Image>`, nested components in templates, props and slots. Partial: Font Provider API, play
  functions, source code display. Not supported: view transitions, content collections
  (`astro:content`), middleware, API routes, server islands, actions (`astro:actions`),
  environment variables (`astro:env`), `Astro.glob()`, Astro DB, i18n, prefetch, dev toolbar,
  advanced markdown. Source: https://storybook-astro.org/guides/roadmap/.
- `astro:assets`: "Astro's built-in `<Image>` component from `astro:assets` works in Storybook
  stories without any special workarounds"; image imports resolve to `ImageMetadata`; a
  passthrough image service returns `/@fs/...` URLs, so "resizing, format conversion, and quality
  settings in `<Image>` props are not applied during Storybook dev mode". `<Picture>` is not
  mentioned. Source: https://storybook-astro.org/guides/images/.
- Fonts: the Astro Font Provider `fonts` array in `astro.config.*` is auto loaded (or passed as
  `framework.options.fonts`); dev renders real `@font-face` CSS from the provider's remote URLs,
  "an offline Storybook will fall through to fallback families"; static and server builds fall
  back to no-op stubs per the option's JSDoc. Sources: https://storybook-astro.org/guides/styling/,
  `node_modules/@storybook-astro/framework/dist/types-xbmzos2q.d.ts`.
- Source level: `vitePluginAstro.ts` removes Astro's Vite plugins named `astro:actions`,
  `astro:vite-plugin-env`, `astro:i18n`, `astro:content-*`, `astro:prefetch`, `astro:dev-toolbar`,
  `astro:server`, `astro:scripts:page-ssr`, `astro:markdown`, `astro:jsx`, `astro:html`,
  `astro:head-metadata`, `astro:container` and others from the merged config; fallback plugins
  stub `virtual:astro:routes` (empty `routes`), `astro:toolbar:internal` (no-op) and
  `astro:react:opts` / `astro:preact:opts` (`{}`). Sources:
  `node_modules/@storybook-astro/framework/src/vitePluginAstro.ts`,
  `node_modules/@storybook-astro/framework/src/vitePluginAstroRoutesFallback.ts`,
  `node_modules/@storybook-astro/framework/src/vitePluginAstroToolbarFallback.ts`,
  `node_modules/@storybook-astro/framework/src/vitePluginAstroIntegrationOptsFallback.ts`.
- Client `<script>` in `.astro` files: the canvas re-executes them after each render
  (`invokeScriptTags` in `render.tsx`); the portable stories path does not (roadmap limitation).
  `client:*` islands are supported for framework components through an integration; view
  transitions are not supported. Sources: `node_modules/@storybook-astro/renderer/src/render.tsx`,
  https://storybook-astro.org/guides/roadmap/.
- Troubleshooting page "Known Limitations": Vite 5 plus Solid, and "Production builds
  (`npm run build`) are still more limited than dev mode". The page also documents the
  `@storybook-astro/framework/shim` fix for ESLint on `.astro` imports.
  Source: https://storybook-astro.org/guides/troubleshooting/.

### Open issues in the tracker

- Repo: default branch `develop`, 8 open issues, no GitHub releases (the releases API returns
  404); tag `v1.11.0` is commit `403231ab455704c8dd5be9357d0e188047d4a44d`.
  Source: `gh api repos/storybook-astro/storybook-astro`, `.../tags`, `.../releases/latest`.
- Searching open issues for "10.6" finds only #173 "Docgen Server support
  (experimental_docgenProvider) once a Storybook 10.6 floor is reasonable": a future opt-in that
  needs `features.experimentalDocgenServer`; the shipped JSDoc extraction works without it.
  Searching for "7.3" finds nothing. https://github.com/storybook-astro/storybook-astro/issues/173
- Other open issues, none blocking a plain `.astro` library in static mode: #156 dynamic controls
  in production builds (server mode), #136 `~` tsconfig alias unresolved in server renderMode
  (static unaffected), #164 render performance (dev round trip "a few seconds per render"),
  #166 content collections, #162 Astro panel addon, #157 scaffold CLI.
  https://github.com/storybook-astro/storybook-astro/issues/156,
  https://github.com/storybook-astro/storybook-astro/issues/136,
  https://github.com/storybook-astro/storybook-astro/issues/164.

## Storybook 10.6.0 core

### Import paths

- Storybook 9 folded the addon packages into core: `@storybook/manager-api` became
  `storybook/manager-api`, `@storybook/preview-api` became `storybook/preview-api`,
  `@storybook/theming` became `storybook/theming`, `@storybook/test` became `storybook/test`,
  `@storybook/addon-viewport` became `storybook/viewport`, `@storybook/addon-actions` became
  `storybook/actions`, `@storybook/addon-highlight` became `storybook/highlight`. "Please
  un-install these packages, and ensure you have the `storybook` package installed. Replace any
  imports with the path listed." `globals` in project annotations became `initialGlobals`.
  Source: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md.
- 10.6.0's `package.json` exports confirm `./theming`, `./theming/create`, `./manager-api`,
  `./preview-api`, `./test`, `./viewport`, `./backgrounds`, `./actions`, `./highlight`,
  `./internal/types`, `./internal/csf`, `./internal/docs-tools` and more.
  Source: `node_modules/storybook/package.json`.
- Storybook 10: `.storybook/main.*` "must be valid ESM"; `typesVersions` removed, so
  `moduleResolution` must be `bundler`, `node16` or `nodenext`; "Storybook 10 now requires Node.js
  version 20.19+ or 22.12+". Source: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md.

### Manager theming

- `.storybook/manager.ts`: `import { addons } from 'storybook/manager-api'` and
  `addons.setConfig({ theme })`; the theme comes from `create` in `storybook/theming/create` (or
  `themes.light` / `themes.dark` from `storybook/theming`). `setConfig(value: Addon_Config)` and
  `Addon_Config.theme?: ThemeVars`. Sources: https://storybook.js.org/docs/configure/user-interface/theming,
  `node_modules/storybook/dist/chunk-zQu03vfn.d.ts` line 63 and line 16389.
- `create(vars?: ThemeVarsPartial, rest?: Rest) => ThemeVars`, with
  `ThemeVarsPartial = { base: 'light' | 'dark' } & Partial<ThemeVarsColors>`. Every key in
  `ThemeVarsColors` at 10.6.0: `colorPrimary`, `colorSecondary`, `appBg`, `appContentBg`,
  `appHoverBg`, `appPreviewBg`, `appBorderColor`, `appBorderRadius: number`, `fontBase`,
  `fontCode`, `textColor`, `textInverseColor`, `textMutedColor`, `barTextColor`, `barHoverColor`,
  `barSelectedColor`, `barBg`, `buttonBg`, `buttonBorder`, `booleanBg`, `booleanSelectedBg`,
  `inputBg`, `inputBorder`, `inputTextColor`, `inputBorderRadius: number`, and optional
  `brandTitle`, `brandUrl`, `brandImage`, `brandTarget`, `gridCellSize`. So all 22 keys the brief
  lists exist. Sources: `node_modules/storybook/dist/theming/create.d.ts`,
  `node_modules/storybook/dist/chunk-By2eGsW5.d.ts` lines 150 to 186.
- The docs' full example uses exactly those keys (`base: 'light'`, `fontBase`, `fontCode`,
  `brandTitle`, `brandUrl`, `brandImage`, `brandTarget`, `colorPrimary`, `colorSecondary`, `appBg`,
  `appContentBg`, `appPreviewBg`, `appBorderColor`, `appBorderRadius`, `textColor`,
  `textInverseColor`, `barTextColor`, `barSelectedColor`, `barHoverColor`, `barBg`, `inputBg`,
  `inputBorder`, `inputTextColor`, `inputBorderRadius`).
  Source: https://storybook.js.org/docs/configure/user-interface/theming.
- Docs pages are themed separately: "Storybook Docs uses the same theme system as Storybook's UI
  but is themed independently from the main UI. The default theme for Docs is always the 'light'
  theme, regardless of the main UI theme." Set `parameters.docs.theme` in preview (the autodocs
  page shows `docs: { theme: ensure(themes.dark) }`). Escape hatches: "all UI and Docs components
  are tagged with class names"; manager CSS goes in `.storybook/manager-head.html`, docs CSS in
  `.storybook/preview-head.html`. Sources: https://storybook.js.org/docs/configure/user-interface/theming,
  https://storybook.js.org/docs/writing-docs/autodocs.

### Backgrounds and viewport (in core since 9)

- Backgrounds parameter type:

  ```ts
  parameters.backgrounds?: {
    default?: string;
    disable?: boolean;
    grid?: {
      cellAmount: number; cellSize: number; opacity: number; offsetX?: number; offsetY?: number;
    };
    options?: Record<string, { name: string; value: string }>;
  }
  ```

  Docs example: `options: { dark: { name: 'Dark', value: '#333' }, light: { name: 'Light', ... } }`
  and `initialGlobals: { backgrounds: { value: 'light' } }`. Core defaults:
  `initialGlobals.backgrounds = { value: undefined, grid: false }`, grid `cellSize: 20`,
  `opacity: 0.5`, `cellAmount: 5`, `DEFAULT_BACKGROUNDS = { light: '#F8F8F8', dark: '#333' }`.
  Sources: `node_modules/storybook/dist/chunk-CrbgZRtX.d.ts`,
  https://storybook.js.org/docs/essentials/backgrounds, `node_modules/storybook/dist/preview/runtime.js`.
- Backgrounds global type:
  `globals.backgrounds?: { value: string | undefined; grid?: boolean } | string`.
  Core's own decorator reads it as `data = globals.backgrounds || {}`,
  `backgroundName = typeof data == "string" ? data : data?.value`, looks the name up in
  `options`, and paints `background: <value> !important` on `.sb-show-main` (`.docs-story` in
  docs). A custom decorator that adds `oy-dark` only for the indigo option reads the same field:
  `const bg = context.globals.backgrounds; const name = typeof bg === 'string' ? bg : bg?.value;`
  then compares `name === 'indigo'`. Story level `globals: { backgrounds: { value: 'dark' } }`
  locks the toolbar for that story. Sources: `node_modules/storybook/dist/chunk-CrbgZRtX.d.ts`,
  `node_modules/storybook/dist/preview/runtime.js` (`withBackgroundAndGrid`),
  https://storybook.js.org/docs/essentials/backgrounds.
- Viewport parameter type:

  ```ts
  parameters.viewport?: {
    disable?: boolean;
    options: Record<string, {
      name: string;
      styles: { width: string; height: string };
      type?: 'desktop' | 'mobile' | 'tablet' | 'watch' | 'other';
    }>;
  }
  ```

  Widths and heights carry units (`'375px'`). Globals:
  `globals.viewport?: { value: string | undefined; isRotated?: boolean } | string`, where `value`
  is an option key or `'{width}-{height}'` such as `'320-480'` (units allowed, for example
  `100vw` or `100pct`). Constants from `storybook/viewport`: `INITIAL_VIEWPORTS`,
  `MINIMAL_VIEWPORTS` (`mobile1` 320x568, `mobile2` 414x896, `tablet` 834x1112, `desktop`
  1280x1024), `DEFAULT_VIEWPORT = 'responsive'`, `RESPONSIVE_VIEWPORT_VALUE = '100pct-100pct'`.
  Story level `globals: { viewport: { value: 'mobile1', isRotated: false } }` locks the toolbar.
  Sources: `node_modules/storybook/dist/chunk-BKd7G5t3.d.ts`,
  `node_modules/storybook/dist/viewport/index.d.ts`, https://storybook.js.org/docs/essentials/viewport.

### `@storybook/addon-a11y` 10.6.0

- Register with `npx storybook add @storybook/addon-a11y` (adds it to `addons` in `main.ts`).
  Peer `storybook ^10.6.0`, dependencies `axe-core ^4.2.0`, `@storybook/global`.
  Sources: `node_modules/@storybook/addon-a11y/README.md`, `npm view @storybook/addon-a11y@10.6.0`.
- Parameters and globals:

  ```ts
  parameters.a11y?: {
    context?: ContextSpecWithoutNode;
    options?: axe.RunOptions;
    config?: axe.Spec;
    disable?: boolean;
    test?: 'off' | 'todo' | 'error';
  }
  globals.a11y?: { manual?: boolean }
  ```

  The preview entry exports `afterEach` (runs the
  checks after each story render), `decorators`, `initialGlobals` and `parameters`.
  Sources: `node_modules/@storybook/addon-a11y/dist/chunk-lw2YNZji.d.ts`,
  `node_modules/@storybook/addon-a11y/dist/index.d.ts`,
  `node_modules/@storybook/addon-a11y/dist/preview.d.ts`.
- `test` semantics: `'error'` fails the test on violations, `'todo'` shows warnings, `'off'`
  skips. "Accessibility tests will only produce errors in CI if you have set
  `parameters.a11y.test` to `'error'`. If you set it to `'todo'`, there will be no
  accessibility-related errors, warnings, or output in CI." CI results come from the Vitest addon
  running stories; `storybook build` only builds (its `--help` has no accessibility option), so
  without `@storybook/addon-vitest` the checks are panel only.
  Sources: https://storybook.js.org/docs/writing-tests/accessibility-testing,
  `storybook build --help` at 10.6.0.

### `@storybook/addon-docs` 10.6.0

- Required for autodocs and MDX: the autodocs page registers `addons: ['@storybook/addon-docs']`
  and enables pages with `tags: ['autodocs']` (globally in preview or per component);
  `docs.defaultName` renames the generated page. Peer `storybook ^10.6.0`; dependencies `react`
  and `react-dom` `^16.8 || ^17 || ^18 || ^19`, `@mdx-js/react`, `@storybook/react-dom-shim`;
  `@types/react` optional. Sources: https://storybook.js.org/docs/writing-docs/autodocs,
  `npm view @storybook/addon-docs@10.6.0`.
- The preview side hook for docs theming is `parameters.docs.theme` (a `ThemeVars`, for example
  `ensure(themes.dark)` or a `create()` result). Docs pages render inside the preview iframe, so
  a stylesheet imported in `preview.ts` and tags in `.storybook/preview-head.html` reach them;
  Storybook "will inject these tags into the preview iframe where your components render, not the
  Storybook application UI". The Astro renderer toggles `sb-unstyled` on the canvas in docs view so
  `.sbdocs-content` typography does not bleed into components.
  Sources: https://storybook.js.org/docs/configure/user-interface/theming,
  https://storybook.js.org/docs/configure/story-rendering,
  `node_modules/@storybook-astro/renderer/src/render.tsx`.

### `storybook-addon-pseudo-states`

- Latest 10.6.0 (2026-09-02), peer `storybook ^10.6.0`, repository
  `storybookjs/storybook` directory `code/addons/pseudo-states`, exports `.`, `./manager`,
  `./preview`. History from the registry: 4.0.3 (2025-03-20, peer `storybook ^8.2.0`, then in the
  `chromaui/storybook-addon-pseudo-states` repo), 9.0.0 (2025-05-28) began the lockstep with
  core, 10.0.0 (2025-10-28), 10.6.0 (2026-09-02). So yes, it supports Storybook 10 and must be
  pinned to the same minor as `storybook`.
  Sources: `npm view storybook-addon-pseudo-states version peerDependencies time`,
  `node_modules/storybook-addon-pseudo-states/package.json`.
- README: `npx storybook add storybook-addon-pseudo-states` ("For Storybook versions before 9.0,
  use v4.0.3"). Usage: `parameters: { pseudo: { hover: true } }`; per element selectors
  `pseudo: { hover: ['#one', '#two'], focus: '#two', active: '#three' }`;
  `pseudo.rootSelector` for portals and dialogs (default root `#storybook-root`). It rewrites
  every stylesheet to add class selectors for `:hover`, `:focus` and friends, "won't render any of
  the default user agent (browser) styles", and exists "to test such states with Chromatic".
  Source: `node_modules/storybook-addon-pseudo-states/README.md`.

### CLI and Node

- `storybook dev -p 6006` plus `--ci` (no prompts, no browser), `--no-open`, `--exact-port`,
  `--quiet`, `--docs`, `--preview-only`. `storybook build -o storybook-static` plus `--test`
  ("Build stories optimized for testing purposes"), `--docs`, `--quiet`, `--stats-json`.
  Sources: `storybook dev --help` and `storybook build --help` at 10.6.0,
  https://storybook.js.org/docs/api/cli-options.
- Node: Storybook 10 needs 20.19+ or 22.12+ (MIGRATION.md); the framework needs 22.19+ on the 22
  line. The repo's `.node-version` is `22` and mise resolves it to 22.22.1 here (`mise ls node`),
  which satisfies both.

## Chromatic

### `chromaui/action` tag and SHA

- `gh api repos/chromaui/action/git/ref/tags/v18.7.2` returns an annotated tag object
  `46afa4eaf8c27080e5966a20cda31fcf45d3bdb8`; dereferencing it
  (`git/tags/46afa4ea...`) gives commit `2a0b63f30233c48591844a46d451b9cf68128186`, committed
  2026-08-31T15:34:56Z with message "v18.7.2". The `v18` and `latest` tags are annotated tags to
  the same commit today. Pin as
  `uses: chromaui/action@2a0b63f30233c48591844a46d451b9cf68128186 # v18.7.2`.
- Do not use `releases/latest` for this repo: it returns `v1` from 2020 because the repo tags
  without publishing releases. The README says the repo "is just a deployment target for the
  GitHub Action"; the source is `action-src/` in https://github.com/chromaui/chromatic-cli.
  Sources: `gh api repos/chromaui/action/releases/latest`, README at tag v18.7.2.
- `action.yml` at v18.7.2 runs `action/register.cjs` with `using: node24`, so the runner needs no
  Node setup for the action itself. Source: `action.yml` at tag v18.7.2.
- Docs on versioning: `@latest` receives everything, `@vX` receives features and fixes without
  breaking changes, `@vX.Y.Z` pins a CLI version. Source: https://www.chromatic.com/docs/github-actions/.

### Action inputs for a Storybook prebuilt with Bun

- From `action.yml` at v18.7.2: `projectToken` ("best provided via env.CHROMATIC_PROJECT_TOKEN"),
  `storybookBuildDir` ("Provide a directory with your built storybook; use if you have already
  built your storybook"), `workingDir` ("Working directory for the package.json file"),
  `exitZeroOnChanges` ("Positive exit of action even when there are changes: boolean or
  branchname"), `exitOnceUploaded` ("Exit with 0 once the built version has been sent to
  chromatic: boolean or branchname"), `onlyChanged` ("Enables TurboSnap"), `autoAcceptChanges`
  ("boolean or branchname"), `buildScriptName` ("The npm script that builds your Storybook
  [build-storybook]"), `buildCommand`, `skip` ("Skip Chromatic tests, but mark the commit as
  passing"), `zip` ("single zip file instead of individual content files"), plus
  `storybookBaseDir`, `storybookConfigDir`, `junitReport`, `outputDir`, `dryRun`, `debug`,
  `branchName`, `repositorySlug`, `chromaticSha`, `configFile`, `externals`, `untraced`,
  `traceChanged`, `uploadMetadata`, `fileHashing`, `forceRebuild`, `ignoreLastBuildOnBranch`,
  `logFile`, `logLevel`, `logPrefix`, `onlyStoryFiles`, `onlyStoryNames`, `skipUpdateCheck`,
  `storybookLogFile`, `token`, `cypress`, `playwright`, `vitest`, `preserveMissing` (deprecated).
  Outputs include `url`, `buildUrl`, `storybookUrl`, `code`, `changeCount`, `errorCount`.
- Which apply when CI builds first with `bun run --filter @oy/ui build-storybook`: `projectToken`
  (or the env var), `storybookBuildDir` pointing at the built directory, and optionally
  `exitZeroOnChanges`, `exitOnceUploaded`, `autoAcceptChanges` (for `main`), `zip`, `onlyChanged`
  (with `storybookBaseDir` and `storybookConfigDir` in a monorepo). `buildScriptName`,
  `buildCommand` and `workingDir` only matter when the action runs the build itself; the CLI's
  option resolution skips the package.json script lookup when `storybookBuildDir` is set. Note
  that `workingDir` also `process.chdir`s before the run, so relative paths resolve from it.
  Docs: "If you've already built your Storybook in a separate CI step, you can alternatively point
  the action at the build output using the `storybookBuildDir` parameter"; the CLI flag is
  `--storybook-build-dir` (`-d`). Sources: https://www.chromatic.com/docs/github-actions/,
  https://www.chromatic.com/docs/configure/, `action-src/main.ts` at chromatic-cli tag v18.7.2,
  `node_modules/chromatic/dist/node-src-CWjlE_UC.cjs` (option resolution).

### Checkout depth, events, forks and a missing token

- The workflow example uses `actions/checkout@v7` with `fetch-depth: 0` because "Chromatic relies
  on git history to determine which files have changed since the last build".
  Source: https://www.chromatic.com/docs/github-actions/.
- Events: "Our recommendation is to run Chromatic's step on `push` events. While the
  `pull_request` event also works, it can cause Chromatic's baselines to be lost in certain
  scenarios" (ephemeral merge commits). The action maps `pull_request` to the head SHA and branch
  and records the merge commit separately. Sources: https://www.chromatic.com/docs/github-actions/,
  `action-src/main.ts` at chromatic-cli tag v18.7.2 (`getBuildInfo`).
- Forks: "GitHub secrets work at a repository level. Forked repositories will not have access to
  them." The only documented way to run Chromatic on forked PRs is to put the token in plaintext
  in the workflow, and "anyone with access to this file can run Chromatic builds on your project".
  Source: https://www.chromatic.com/docs/github-actions/.
- Missing token: the CLI reads `CHROMATIC_PROJECT_TOKEN` as the default `projectToken`; if neither
  a project token nor a user token is present it throws "Missing project token" (with a pointer to
  https://www.chromatic.com/docs/quickstart/), the run ends with exit code `INVALID_OPTIONS`
  (254 in the CLI's exit code table), and the action calls `setFailed('non-zero exit code')` and
  exits with that code. So a fork PR without the secret fails the job rather than skipping. With
  `--skip` and no token the CLI logs "Skipping Chromatic build locally because --skip is enabled,
  but no project token was available, so no build was reported to Chromatic. This may leave the
  Chromatic GitHub checks pending." Sources: `node_modules/chromatic/dist/node-src-CWjlE_UC.cjs`,
  `action-src/main.ts` at chromatic-cli tag v18.7.2.
- Token guidance: "To securely provide the projectToken to Chromatic, you must configure a GitHub
  repository secret"; the configure reference lists `projectToken` with `--project-token` (`-t`)
  and "Prefer to use `CHROMATIC_PROJECT_TOKEN`". Sources: https://www.chromatic.com/docs/github-actions/,
  https://www.chromatic.com/docs/configure/.
- `chromatic` 18.7.2 engines `node >=22.0.0` (registry). The setup page still says "officially
  maintained version of Node, currently 18, 20 & 21", which is stale; trust the package.
  Sources: `npm view chromatic@18.7.2 engines`, https://www.chromatic.com/docs/storybook/setup/.

### Two viewports (375 and 1440), disableSnapshot, pauseAnimationAtEnd

- Modes: define `.storybook/modes.ts`, for example
  `export const allModes = { mobile: { viewport: 375 }, desktop: { viewport: 1440 } } as const;`
  then
  `parameters: { chromatic: { modes: { mobile: allModes.mobile, desktop: allModes.desktop } } }`
  in preview (project wide) or on a story. "Chromatic combines them all into a stack and tests the
  story against each mode in the stack", so two modes double the snapshot count. Other keys in a
  mode (`backgrounds: { value }`, `theme`) are applied as Storybook globals.
  Source: https://www.chromatic.com/docs/modes/.
- The `viewport` key accepts a Storybook viewport option key (`viewport: 'xsm'`), a width
  (`viewport: 1280`), or `{ width, height }`; "A width or height can be any whole number between
  200 and 2560 pixels"; "When a mode includes a valid viewport parameter, Chromatic will adjust
  the viewport size to match the defined dimensions while capturing the snapshot". Chromatic also
  respects `initialGlobals.viewport` and story level `globals.viewport`, but ignores non pixel
  values such as `50%` or `65em`. Numbers avoid any dependence on the core viewport option keys.
  Sources: https://www.chromatic.com/docs/modes/viewports/, https://www.chromatic.com/docs/viewports/.
- Legacy `parameters.chromatic.viewports: [320, 1200]` is "now replaced by the new Modes API"
  (width only, same 200 to 2560 range, 25,000,000 pixels per snapshot maximum); "We will continue
  to support both APIs, but we plan to deprecate the viewport feature".
  Sources: https://www.chromatic.com/docs/legacy-viewports/, https://www.chromatic.com/docs/modes/viewports/.
- `parameters.chromatic.disableSnapshot: true` works at story, component and project level; the
  stories stay in the Library but are not snapshotted. Source: https://www.chromatic.com/docs/disable-snapshots/.
- `pauseAnimationAtEnd`: by default "CSS animations are paused at the end of their animation
  cycle (i.e., the last frame)"; `false` pauses at the first frame; a `delay` exists for
  animations that cannot be disabled. Source: https://www.chromatic.com/docs/animations/.

### Visual Tests addon

- `@chromatic-com/storybook` (5.3.1, peer `storybook ^10.1.0` and up) runs visual tests from the
  Storybook UI during local development; "the addon doesn't replace CI, Chromatic still requires
  CI to do its job". CI snapshots need only the action or the CLI.
  Sources: https://www.chromatic.com/docs/visual-tests-addon/, `npm view @chromatic-com/storybook@5.3.1`.

## Repo fit

- Node 22.22.1 (mise) satisfies the framework's `>=22.19.0`; Vitest 4.1.11 satisfies the guide's
  4.1.0 floor; Bun 1.4.2 installed the whole set in the scratch directory without peer errors.
- `packages/ui/vitest.config.ts` now uses the framework's `defineConfig` (async config function,
  15 s default timeout) with `root` set to the package directory, because the framework resolves
  `astro/config` from `process.cwd()` and Bun's isolated linker keeps `astro` under
  `packages/ui/node_modules`, not the repo root.
- Story files in `.ts` need either Astro's `*.astro` module types or the framework shim in a
  `.d.ts` inside `packages/ui`.
- `docs/design` asks for grain-dots cards via `data-card="grain-dots"` on the page root; that
  attribute lives on the page, not in slot HTML, but any `data-*`, `section`, `nav`, `header`,
  `footer` or `button` inside a slot string is stripped unless `sanitization.sanitizeHtml`
  extends the allowlist.

## Open questions for the session

- Story typing: local `Meta` and `StoryObj` aliases over `AstroRenderer` (derived from the
  `@storybook/html` pattern, undocumented for Astro), CSF factories (`definePreview`,
  `preview.meta`, marked preview by Storybook, with the `meta.input` caveat in portable tests), or
  plain objects with `satisfies ComponentAnnotations<AstroRenderer>`. Pick one for `@oy/ui`.
- The `.oy-dark` wrapper: a `Wrapper.astro` decorator with `props: { theme }` read from
  `context.globals.backgrounds` (unsanitised, typed), or the HTML string form (keeps `class`,
  drops `data-*`). Both re-render live only in `storybook dev`; in `storybook build`, which is
  what Chromatic snapshots, decorators are frozen at build time. Unverified whether story level
  `globals` reach the decorator during prerender; if not, dark variants need an explicit theme
  arg or a dedicated wrapper decorator per story rather than a backgrounds toggle.
- Where Storybook resolves Astro from: add `astro` 7.3.1 to `packages/ui` devDependencies and
  decide whether `packages/ui` gets its own `astro.config.ts` (fonts, integrations) or
  `resolveFrom` points at `packages/web`. The Source Serif 4 and Source Sans 3 faces must reach
  the preview either way (fonts API in dev only, or `preview.css` plus `staticDirs`).
- Sanitisation allowlist: which extra tags and attributes (`data-*`, `section`, `nav`, `button`)
  slot fixtures need, set once in `framework.options.sanitization.sanitizeHtml`.
- a11y in CI needs `@storybook/addon-vitest` with Playwright browser mode; without it the addon
  is panel only. Decide whether that lands in Phase 1 or waits for the Phase 3 Playwright and axe
  work.
- Chromatic on fork PRs fails with exit 254 when the secret is absent; the docs' only remedy is a
  plaintext token. Decide between running the Chromatic job on `push` only (Chromatic's
  recommendation) or guarding the job on pull requests with a same-repository condition
  (not verified against GitHub's docs in this note).
- Chromatic modes by number (375 and 1440) versus `parameters.viewport.options` keys shared with
  the toolbar; numbers are unambiguous, keys keep the toolbar and snapshots aligned.
- Whether `storybook-addon-pseudo-states` reaches Astro scoped styles delivered as hoisted
  `<link rel="stylesheet">` tags in the preview iframe. Unverified; check in the prototype.
- Play functions on Astro stories in the canvas are "unverified" upstream; the first story with a
  `play` should confirm the Interactions panel and Chromatic both run it.
- The roadmap table lists component description extraction as "Manual" while the 1.11.0 changelog
  says descriptions are extracted from JSDoc; verify on the first autodocs page.
- CI Node version: `.github/actions/setup-js` must produce Node 22.19 or newer for the framework
  (not read in this note).
