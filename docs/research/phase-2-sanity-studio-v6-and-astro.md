# Phase 2: Sanity Studio v6 and @sanity/astro 3.5.1 verified before pinning

Date: 5 September 2026. Method: `npm view <pkg> version|peerDependencies|engines|dependencies|time`
against the npm registry; the packages installed into a scratch directory with Bun 1.4.2 (not the
repo) so the shipped `dist/*.d.ts`, `lib/*.d.ts`, `dist/*.mjs`, `bin` files and READMEs could be read
(paths of the form `node_modules/...` refer to that install; `bun add` lands the same files in the
repo); the `sanity` CLI 8.9.1 run under Node 22.22.1 (`--help`, `schema extract`, `typegen generate`)
against a throwaway schema with a fake project id and no network; one `astro build` of a scratch
Astro 7.3.1 site with `output: 'server'`, `@astrojs/vercel` 11.0.10 and the embedded Studio; the
primary docs named per bullet; GitHub releases, issues and pull requests through `gh api`. Every pin
is exact (`bunfig.toml` sets `exact = true`). `@sanity/client`, `@sanity/image-url` and `groq` are
covered in `phase-2-sanity-client-and-image-url.md`; this note only cross references them.

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `sanity` | 6.12.0 (recommended) | 6.12.0 (2026-09-01) | Current major (`latest` tag); `engines.node >=22.12`; peers `react ^19.2.2`, `react-dom ^19.2.2`, `styled-components ^6.1.15`; depends on `@sanity/cli ^8.7.0`, `@sanity/client ^8.4.0`, `@sanity/preview-url-secret ^4.1.5`, `@sanity/types 6.12.0`, `react-is ^19.2.8`. v5 ended at 5.31.2 (2026-08-19, tag `maintenance-v5`). |
| `@sanity/astro` | 3.5.1 (recommended) | 3.5.1 (2026-08-21) | Peers `astro ^2 || ^3 || ^4 || ^5 || ^6 || ^7`, `sanity ^3.99 || ^4 || ^5 || ^6`, `@sanity/client ^7.14.1 || ^8`, `react` and `react-dom` `^18.2 || ^19`, `react-is` same, `styled-components ^6.1.19`; `engines.node >=20.19.0 || >=22.12.0`. 3.5.2 (visual-editing v6) is an unmerged release PR. |
| `@sanity/vision` | 6.12.0 (recommended) | 6.12.0 (2026-09-01) | Peers `sanity ^6.0.0-0`, `react ^19.2.2`; version locked to the Studio major (5.31.2 peers `^4 || ^5`). |
| `@sanity/preview-url-secret` | 4.1.5 (recommended) | 4.1.5 (2026-08-21) | Peer `@sanity/client ^7.26.2 || ^8.0.0`; `sanity` depends on `^4.1.5`, so one copy; `engines.node >=20.19 <22 || >=22.12`. |
| `@astrojs/react` | 6.0.5 (recommended) | 6.0.5 (2026-08-31) | Required for the embedded Studio (`client:only="react"`); 6.0.0 is the Vite 8 (Astro 7) major; peers `react`, `react-dom` `^17.0.2 || ^18 || ^19`, `@types/react ^17.0.50 || ^18.0.21 || ^19`, `@types/react-dom ^17.0.17 || ^18.0.6 || ^19`; `engines.node >=22.12.0`. |
| `react`, `react-dom` | 19.2.8 (recommended) | 19.2.8 (2026-07-21) | `sanity` and `@sanity/vision` peer `^19.2.2`; `react-dom` 19.2.8 peers `react ^19.2.8`. |
| `react-is` | 19.2.8 (recommended) | 19.2.8 (2026-07-21) | Peer of `@sanity/astro`, on the README's manual install list; `sanity` depends on `^19.2.8`. |
| `styled-components` | 6.5.3 (recommended) | 6.5.3 (2026-08-15) | Peers `sanity ^6.1.15`, `@sanity/astro ^6.1.19`, `@sanity/visual-editing ^6.1`; `@sanity/astro` declares it as a peer, so `packages/web` installs it. |
| `@types/react`, `@types/react-dom` | 19.2.18, 19.2.7 (recommended) | 19.2.18 (2026-07-30), 19.2.7 (2026-09-03) | Peers of `@astrojs/react`; `@sanity/types` peers `@types/react *`. |
| `@sanity/client` | 8.5.0 (see the client note) | 8.5.0 (2026-09-03) | The `sanity:client` virtual module imports `createClient` from `@sanity/client`, so `packages/web` lists it directly. |
| `groq` | 6.12.0 (see the client note) | 6.12.0 (2026-09-01) | `defineQuery`; lockstep with `sanity`. |
| `@sanity/visual-editing` | not pinned | 6.1.2 (2026-09-01) | Arrives as 5.7.3 through `@sanity/astro ^5.5.0`; add 6.1.2 directly only for the docs' `@sanity/visual-editing/react` pattern (`onPerspectiveChange`). |
| `@sanity/cli`, `@sanity/types`, `@sanity/codegen` | not pinned | 8.9.1, 6.12.0, 8.1.0 (2026-09-03, 2026-09-01, 2026-09-03) | Arrive through `sanity`. |

Sources for the table: `npm view` of each package on 2026-09-05 (`version`, `time`, `engines`,
`peerDependencies`, `dependencies`, `dist-tags`), `node_modules/sanity/package.json`,
`node_modules/@sanity/astro/package.json`, https://github.com/sanity-io/sanity-astro/pull/445.

## Studio v6 versus v5

### Registry and release facts

- `sanity` dist-tags today: `latest` 6.12.0, `maintenance-v5` 5.31.2, `maintenance-v4` 4.22.1, `next`
  6.13.0-next.65. 6.0.0 shipped 2026-06-11; the v5 line received 5.31.2 on 2026-08-19 after 6.10.1.
  Source: `npm view sanity dist-tags time`, `gh api repos/sanity-io/sanity/releases`.
- v5 and v6 share the React and styled-components peers (`react ^19.2.2`, `styled-components ^6.1.15`
  on 5.31.2, 6.0.0 and 6.12.0). The React 19.2.2 floor came with v5 ("Sanity Studio v5 raises the
  minimum React version to 19.2.2"), not v6. Source: `npm view sanity@5.31.2 peerDependencies`,
  https://www.sanity.io/docs/help/v4-to-v5.
- Engines: 5.31.2 `node >=20.19 <22 || >=22.12`; 6.x `node >=22.12`. The repo runs 22.22.1 (mise), which
  satisfies both. Source: `npm view sanity@5.31.2 engines`, `npm view sanity@6.12.0 engines`.
- Vite: 5.31.2 built against `vite ^7.3.5`, 6.12.0 against `vite ^8.2.2` (devDependency; `sanity` has no
  runtime `vite` dependency, `@sanity/cli` 8.9.1 depends on `vite ^8.2.2` for `sanity dev` and
  `sanity build`). In the embedded case Astro's own Vite 8.2.2 bundles the Studio. Source:
  `npm view sanity@5.31.2 devDependencies.vite`, `node_modules/sanity/package.json`,
  `node_modules/@sanity/cli/package.json`, `node_modules/astro/package.json` (`vite ^8.0.13`).
- `@sanity/vision` follows the major: 5.31.2 peers `sanity ^4.0.0-0 || ^5.0.0-0` and `styled-components`;
  6.12.0 peers `sanity ^6.0.0-0` and `react ^19.2.2` only. Source: `npm view @sanity/vision@5.31.2
  peerDependencies`, `node_modules/@sanity/vision/package.json`.
- `@sanity/astro` accepted `sanity ^6` in 3.4.1 (2026-06-09, "make peer dependencies include sanity
  6.x"). Source: https://github.com/sanity-io/sanity-astro/releases/tag/v3.4.1.

### The v5 to v6 guide, checked against this repo

- Node 20 support dropped, minimum 22.12: "Update `package.json` engines field accordingly". Repo already
  pins `22.x`. Source: https://www.sanity.io/docs/help/v5-to-v6, `packages/web/package.json`.
- React strict mode on by default in development, off with `reactStrictMode: false` in `sanity.cli.ts`.
  This is a `sanity dev` behaviour; whether the embedded Studio under Astro dev gets it is unverified.
  Source: https://www.sanity.io/docs/help/v5-to-v6, `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts` (`reactStrictMode?: boolean`).
- `auth.mode` removed; a static `providers` array now replaces the built ins, append with
  `providers: (prev) => [...prev, ...]`. The repo defines no auth providers. Source: https://www.sanity.io/docs/help/v5-to-v6.
- Search default `groq2024` replaces `groqLegacy`; `enableLegacySearch` removed; revert with
  `search.strategy: 'groqLegacy'`. The repo sets neither. Source: https://www.sanity.io/docs/help/v5-to-v6.
- Vite 8 with Rolldown: rename `build.rollupOptions` to `build.rolldownOptions` in a custom `vite` block
  of `sanity.cli.ts`. The repo has none. Source: https://www.sanity.io/docs/help/v5-to-v6.
- "Schemas, plugins, configuration shape, and content APIs are unaffected." Every API the brief names
  exists in the 6.12.0 type files quoted below: `structureTool`, `S.view.component`, `presentationTool`,
  `defineLocations`, `defineDocuments`, `document.newDocumentOptions`, `document.actions`,
  `schema.templates`, `defineQuery`, `sanity schema extract`, `sanity typegen generate`. Nothing the
  brief asks for was removed or renamed. Sources: https://www.sanity.io/docs/help/v5-to-v6,
  `node_modules/sanity/lib/structure.d.ts`, `node_modules/sanity/lib/presentation.d.ts`.
- The v6.0.0 release lists the breaking commits: "fix!: drop support for node 20 (#12859)", "feat(core)!:
  remove deprecated auth.mode config (#12865)", "feat!: upgrade to vite 8 (#12960)", "feat(studio): use
  `groq2024` search strategy by default", "remove deprecated `enableLegacySearch`", and "fix: use v6 peer
  dep for `sanity` in `@sanity/vision` (#12967)". Source: https://github.com/sanity-io/sanity/releases/tag/v6.0.0.
- 6.9.0 (2026-08-04): "Schema define helpers now preserve explicitly supplied optional properties on
  their return types" for `defineType`, `defineField`, `defineArrayMember`. No deprecations in the 6.x
  changelog titles. Sources: https://www.sanity.io/docs/changelog/studio-Ni44LjA,
  https://www.sanity.io/docs/changelog?product=c91b88aa-f3eb-481f-879a-8a1cebc1297c.
- The upgrade page: "Upgrading with `sanity@latest` installs the current major version, which is v6."
  No statement on how long v5 receives fixes was found (unverified). Source: https://www.sanity.io/docs/help/upgrading-sanity-studio.

### Recommendation

- Pin v6 (6.12.0). Reasons: it is `latest`; the repo already meets the only hard change (Node 22.12);
  the v6 breaking changes touch nothing the brief configures; `@sanity/astro` 3.5.1 and `@sanity/vision`
  6.12.0 target it; and Astro 7 already runs Vite 8, so the Studio and the site share one bundler line.
  Staying on v5 would mean pinning a maintenance line (5.31.2) with `@sanity/vision` 5.x and a Vite 7
  built Studio inside a Vite 8 site. Sources: the bullets above.

## @sanity/astro 3.5.1

### Options and virtual modules

- Integration options, from the shipped types:
  `type IntegrationOptions = ClientConfig & { studioBasePath?: string; studioRouterHistory?: 'browser' | 'hash'; logClientRequests?: 'dev' | 'build' | 'always' }`
  and `export default function sanityIntegration(integrationConfig?: IntegrationOptions): AstroIntegration`.
  `ClientConfig` supplies `projectId`, `dataset`, `useCdn`, `apiVersion`, `token`, `perspective`,
  `stega?: StegaConfig | boolean`, `withCredentials` and the rest of the client options. `StegaConfig` is
  `{ enabled?, studioUrl?: StudioUrl | ResolveStudioUrl, filter?, logger?, omitCrossDatasetReferenceData? }`.
  Sources: `node_modules/@sanity/astro/dist/types/index.d.ts`,
  `node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` (`interface ClientConfig$1`, line 7855),
  `node_modules/@sanity/client/dist/types-CfGzbXrl.d.ts` (`interface StegaConfig`).
- Defaults in the integration source: `apiVersion: "v2023-08-24"` when none is given; `studioRouterHistory`
  falls back to `'hash'` when Astro `output` is `'static'` and `'browser'` otherwise; `studioBasePath` must
  be relative (an `http(s)://` value throws). Source: `node_modules/@sanity/astro/dist/sanity-astro.mjs`
  (`const ae = { apiVersion: "v2023-08-24" }`, function `ue`, function `fe`).
- Virtual modules: `sanity:client` exports `sanityClient: SanityClient` (built with `createClient` from
  `@sanity/client` and the integration options); `sanity:studio` exports `config: Config` (the default
  export of `sanity.config.ts` with `basePath` rewritten). Types come from
  `/// <reference types="@sanity/astro/module" />` in `src/env.d.ts`. The integration also injects a
  `page-ssr` script that sets `globalThis.sanityClient`. Sources: `node_modules/@sanity/astro/module.d.ts`,
  `node_modules/@sanity/astro/dist/sanity-astro.mjs` (`vitePluginSanityClient`, `injectScript("page-ssr", ...)`),
  `node_modules/@sanity/astro/README.md` (Adding types for `sanity:client`).
- Package exports: `.`, `./module`, `./studio/studio-route.astro`, `./studio/studio-route-hash.astro`,
  `./studio/studio-component.tsx`, `./visual-editing`, `./visual-editing/component`. There is no
  `loadQuery` export. Source: `node_modules/@sanity/astro/package.json`.
- `logClientRequests` logs server side `sanity:client` requests in `'dev'`, `'build'` or `'always'`;
  omitted means off. Source: `node_modules/@sanity/astro/README.md` (Setting up the Sanity client).

### The Studio route and where sanity.config.ts lives

- The config file must sit in the Astro project root: the `sanity:studio` plugin calls
  `this.resolve("/sanity.config")` and throws "Sanity Studio requires a `sanity.config.ts|js` file in your
  project root." when nothing resolves. The README: "Create a new file in your project root called
  `sanity.config.ts` (or `.js`)". Not configurable. For this repo that is `packages/web/sanity.config.ts`,
  which can re-export the config built in `@oy/content` (the scratch used
  `export {default} from './content/sanity.config'`). Sources: `node_modules/@sanity/astro/dist/sanity-astro.mjs`
  (`vitePluginSanityStudio`), `node_modules/@sanity/astro/README.md`, scratch `sanity.config.ts`.
- `studioBasePath` is required for the Studio; the integration owns `basePath`: it warns "This integration
  ignores the basePath setting in sanity.config.ts|js" and overwrites it (`/admin`, or
  `/admin/<workspace>` per workspace in browser mode; `#/` and `#/<workspace>` in hash mode).
  Sources: `node_modules/@sanity/astro/dist/sanity-astro.mjs`, `node_modules/@sanity/astro/README.md`
  (Workspaces in embedded Studio).
- Route registration in `astro:config:setup`: browser mode calls
  `injectRoute({ entrypoint: '@sanity/astro/studio/studio-route.astro', pattern: '/admin/[...params]', prerender: false })`;
  hash mode injects `studio-route-hash.astro` at `/admin` with `prerender: true`. `studio-route.astro`
  itself sets `export const prerender = false` and renders `<StudioComponent client:only="react" />`;
  the component renders `<Studio config={config} unstable_history={history} />` from `sanity` inside a
  `div[data-ui="AstroStudioLayout"]`. Astro's `injectRoute` signature is `{ pattern; entrypoint; prerender? }`.
  Sources: `node_modules/@sanity/astro/dist/sanity-astro.mjs` (function `Tr`, hook body),
  `node_modules/@sanity/astro/dist/studio/studio-route.astro`,
  `node_modules/@sanity/astro/dist/studio/studio-component.tsx`,
  https://docs.astro.build/en/reference/integrations-reference/.
- `StudioProps` in 6.12.0: `{ config: Config; basePath?; onSchemeChange?; scheme?; unstable_history?: RouterHistory; unstable_globalStyles?; unstable_noAuthBoundary? }`.
  Source: `node_modules/sanity/lib/index-BCCyfvTv.d.ts`.
- Dev only Vite dedupe (3.4.2, "duplicate React in astro dev"): `resolve.dedupe` for `react`, `react-dom`,
  `react-dom/client`, `styled-components`, `sanity`, `@sanity/ui` plus `optimizeDeps.include` candidates
  (`react-compiler-runtime`, `react-is`, `lodash/startCase.js`, ...). `SANITY_ASTRO_DISABLE_MODULE_DEDUPE=1`
  turns it off. A build time plugin raises `chunkSizeWarningLimit` for Studio chunks (500 kB default).
  Sources: `node_modules/@sanity/astro/dist/types/vite-plugin-sanity-module-dedupe.d.ts`,
  `node_modules/@sanity/astro/dist/sanity-astro.mjs`, https://github.com/sanity-io/sanity-astro/releases/tag/v3.4.2.

### @astrojs/react and the peer set

- Required for the embedded Studio and for the `VisualEditing` overlay: "`@astrojs/react` is only needed if
  you plan to embed a Sanity Studio in your project" and "`VisualEditing` ... is a React component under
  the hood, so you'll need the React integration for Astro". Both islands use `client:only="react"`, and
  Astro requires the framework value because it "doesn't know what framework your component uses
  unless you tell it explicitly". Sources: `node_modules/@sanity/astro/README.md`,
  `node_modules/@sanity/astro/dist/studio/studio-route.astro`,
  `node_modules/@sanity/astro/dist/visual-editing/visual-editing.astro`,
  https://docs.astro.build/en/reference/directives-reference/.
- Manual install list from the README: `@astrojs/react @sanity/astro @sanity/client sanity @types/react-dom
  @types/react-is @types/react react-dom react-is react styled-components`. With Bun's isolated linker
  every peer must be a direct dependency of `packages/web`. Source: `node_modules/@sanity/astro/README.md`.
- `@astrojs/react` 6.0.0 (2026-06-22): "Upgrade to Vite v8"; 6.0.1 to 6.0.5 only bump
  `@astrojs/internal-helpers`. Sources: https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md,
  `npm view @astrojs/react time`.

### Astro 7 compatibility

- Peers accept `astro ^7.0.0` (added Astro 6 in 3.3.0, Astro 7 already in the range on 3.5.1). Bun 1.4.2
  installed `astro` 7.3.1, `@astrojs/react` 6.0.5, `sanity` 6.12.0, `react` 19.2.8, `styled-components`
  6.5.3 and `@sanity/astro` 3.5.1 together with no peer errors. Source: `bun add` in the scratch,
  `node_modules/@sanity/astro/package.json`.
- Verified build: a scratch Astro 7.3.1 site with `output: 'server'`, `adapter: vercel()`
  (`@astrojs/vercel` 11.0.10), `studioBasePath: '/admin'`, `stega: { studioUrl: '/admin' }`, a page importing
  `sanity:client` and `VisualEditing`, and `sanity.config.ts` at the root built in 11.3 s; the Vercel
  output routes `^/admin(?:/(.*?))?/?$` to `_render` and ships `studio-component.*.js`. Static output in
  the same scratch failed at the prerender step with "Received protocol 'astro:'" both with and without
  the Sanity integration, so the hash router path is unverified here and the failure is not attributable
  to `@sanity/astro`. Source: scratch `astro build` runs, `.vercel/output/config.json`.
- The upstream examples still pin `astro` 5.4.1 or 5.11.1, `sanity ^5.31.1` and `@astrojs/react ^4.4.1`;
  an Astro 7 reference app is an open PR (#441). Sources: https://github.com/sanity-io/sanity-astro/blob/main/apps/movies/package.json,
  https://github.com/sanity-io/sanity-astro/pull/441.
- Open issues that touch this stack: #415 (dev only "Invalid hook call" from unresolvable
  `optimizeDeps.include` entries under an isolated node linker, reported on Astro 7.0.7 and
  `@astrojs/react` 6.0.1; fix in PR #449), #414 (Windows dedupe aliasing), #390 (`NoMatchingRenderer` for
  `StudioComponent` on Netlify with Astro 6), #435 (pre optimise syntax highlighting deps). The escape
  hatch for #415 is `SANITY_ASTRO_DISABLE_MODULE_DEDUPE`. Sources: https://github.com/sanity-io/sanity-astro/issues/415,
  https://github.com/sanity-io/sanity-astro/pull/449, https://github.com/sanity-io/sanity-astro/issues/414,
  https://github.com/sanity-io/sanity-astro/issues/390, https://github.com/sanity-io/sanity-astro/issues/435.
- Pending on main: PR #445 releases 3.5.2 with `@sanity/visual-editing` v6 (main already depends on
  `^6.1.1`); PR #451 injects the virtual module types (no `env.d.ts` line), adds a `sanityLoader` for
  content collections and ships ESM only; PR #388 (open since 2026-03-15) would add
  `/preview/enable`, `/preview/disable` routes and an exported `loadQuery`. Sources:
  https://github.com/sanity-io/sanity-astro/pull/445, https://github.com/sanity-io/sanity-astro/pull/451,
  https://github.com/sanity-io/sanity-astro/pull/388.

### Visual Editing, loadQuery and the preview routes

- Exports: `VisualEditing` (an `.astro` component) from `@sanity/astro/visual-editing` with props
  `enabled?: boolean`, `zIndex?`, `keepStegaOnCopy?`; it renders
  `<VisualEditingComponent client:only="react" />` only when `enabled`. `VisualEditingComponent` from
  `@sanity/astro/visual-editing/component` takes
  `Pick<VisualEditingOptions, 'zIndex' | 'refresh' | 'history' | 'keepStegaOnCopy' | 'onSuspiciousStega'>`
  and defaults `refresh` to `window.location.reload()`. The brief's `<SanityVisualEditing />` name does not
  exist. Sources: `node_modules/@sanity/astro/dist/visual-editing/visual-editing.astro`,
  `node_modules/@sanity/astro/dist/types/visual-editing/visual-editing-component.d.ts`,
  `node_modules/@sanity/astro/dist/visual-editing/visual-editing-component.tsx`.
- README, Enabling Visual Editing: "Please note that Visual Editing only works for server-side rendered
  pages." Steps: 1 "Enable Overlays using the `VisualEditing` component", 2 "Add the Presentation tool to
  the Studio", 3 "Enable Stega" with `stega: { studioUrl: '/admin' }` next to `studioBasePath: '/admin'`.
  "Now, all you need is a `loadQuery` helper function akin to this one": it reads
  `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` and `SANITY_API_READ_TOKEN`, sets
  `perspective = visualEditingEnabled ? 'drafts' : 'published'`, and calls `sanityClient.fetch(query, params,
  { filterResponse: false, perspective, resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' :
  false, stega: visualEditingEnabled, token when enabled, useCdn: !visualEditingEnabled })`. The token is a
  Viewer token created at sanity.io/manage. So `loadQuery` is hand written in the site, not imported
  from `@sanity/astro`. Source: `node_modules/@sanity/astro/README.md`.
- The docs' Astro guide (Astro 7, `output: "server"`, `@sanity/astro` 3.5.0+, `@astrojs/react` 6+) uses
  a perspective cookie instead of an env flag: `frontend/src/pages/api/draft-mode/enable.ts` calls
  `validatePreviewUrl(clientWithToken, request.url)`, returns 401 "Invalid secret" when `!isValid`, sets
  `cookies.set(perspectiveCookieName, studioPreviewPerspective ?? "drafts", { httpOnly: false, sameSite:
  "none", secure: true, path: "/", partitioned })` (partitioned when `sec-fetch-dest` is `iframe` and
  `sec-fetch-site` is `cross-site`), and redirects with 307 to `redirectTo`; `disable.ts` expires the
  cookie with two `Set-Cookie` headers (one `Partitioned`) and redirects to `/`. `loadQuery` treats the
  cookie's presence as draft mode, parses it as the perspective (default `drafts`), and passes
  `stega: draftMode`, `resultSourceMap: 'withKeyArraySelector'` and the token. The Studio config uses
  `previewUrl: { initial: "http://localhost:4321", previewMode: { enable: "/api/draft-mode/enable" } }`.
  The guide runs a separate Studio and imports `VisualEditing` from `@sanity/visual-editing/react` with
  `onPerspectiveChange` and a reload `refresh`: "when an editor changes a field, the component triggers a
  full page reload". Source: https://www.sanity.io/docs/visual-editing-with-astro.
- `@sanity/preview-url-secret` 4.1.5: `validatePreviewUrl(_client: SanityClientLike, previewUrl: string): Promise<PreviewUrlValidateUrlResult>`
  with `PreviewUrlValidateUrlResult { isValid; redirectTo?; studioOrigin?; studioPreviewPerspective?; studioPreviewVariant? }`.
  Constants from `@sanity/preview-url-secret/constants`: `perspectiveCookieName = 'sanity-preview-perspective'`,
  `variantCookieName = 'sanity-preview-variant'`, `urlSearchParamPreviewSecret = 'sanity-preview-secret'`,
  `urlSearchParamPreviewPathname = 'sanity-preview-pathname'`, secret documents of type
  `sanity.previewUrlSecret` with an hourly `SECRET_TTL`. The client passed in must carry a token ("Required,
  otherwise the URL preview secret can't be validated"); creating a secret needs Contributor or above.
  Sources: `node_modules/@sanity/preview-url-secret/dist/index.d.ts`,
  `node_modules/@sanity/preview-url-secret/dist/constants-BUNGdmdB.d.ts`,
  `node_modules/@sanity/preview-url-secret/README.md`.
- Route names are free: the brief's `/api/preview/enable` and `/api/preview/disable` are whatever
  `previewMode.enable` names; the docs note "The Presentation Tool doesn't call [`disable`] automatically".
  Source: https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.
- Rendering modes: "Server rendering is necessary when you need Visual Editing, draft previews,
  personalized content, or frequent content updates"; in server mode "Set `useCdn: false` when using the
  `drafts` perspective". Source: https://www.sanity.io/docs/static-and-server-rendering-in-astro.

## The sanity CLI, schema extract and TypeGen in 6.12.0

### Commands and the binary

- `sanity` 6.12.0 declares `bin: { sanity: './bin/sanity' }`; that script resolves the binary of its
  `@sanity/cli` dependency ("the `@sanity/cli` module is the one who actually ship the CLI binary").
  Bun linked `node_modules/.bin/sanity -> ../@sanity/cli/bin/run.js` in the scratch, and `bunx` "checks
  for a locally installed package first", so `bunx sanity` and package scripts work from any workspace
  that depends on `sanity`. Sources: `node_modules/sanity/package.json`, `node_modules/sanity/bin/sanity`,
  `ls node_modules/.bin`, https://docs.bun.sh/docs/pm/bunx.
- `sanity --help` (CLI 8.9.1 under Node 22.22.1) lists commands `build`, `deploy`, `dev`, `exec`, `init`,
  `manage` ("Open project settings in your browser"), `preview`, `undeploy`, `versions`, `doctor`, `debug`,
  and topics `schemas`, `typegen`, `documents`, `datasets`, `blueprints`, `functions`, `hooks`, `cors`,
  `tokens`, `users`, `migrations`, `media`, `manifest`, `mcp`, `skills`, `docs`, `graphql`, `backups`,
  `api`, `assets`, `context`, `openapi`, `organizations`, `projects`, `telemetry`. `sanity schema` and
  `sanity dataset` are accepted and print the `schemas` and `datasets` help. Source: `sanity --help`,
  `sanity schema --help`, `sanity dataset --help` at 8.9.1.
- `sanity schemas`: `delete`, `deploy`, `extract`, `list`, `validate`. `extract` flags:
  `--enforce-required-fields`, `--force`, `--format` (only `groq-type-nodes`), `--path`, `--watch`,
  `--watch-patterns`, `--workspace`; "This command is experimental and subject to change". `deploy`
  flags: `--[no-]extract-manifest`, `--manifest-dir` (default `./dist/static`), `--tag`, `--verbose`,
  `--workspace`. `schemas list --help` and `schemas validate --help` answered "Command schemas list not
  found" in this install; whether they run in a project is unverified. Sources: `sanity schemas extract --help`,
  `sanity schemas deploy --help`, https://www.sanity.io/docs/schemas-cli-command-reference.
- `sanity deploy` "builds the Studio through Vite, extracts your schema and manifest, packages everything"
  and uploads; `--no-build` "still runs schema extraction and upload"; `--schema-required` fails the
  deploy on schema errors; `--external` registers an externally hosted Studio. For an embedded Studio
  the schema still reaches the Content Lake through `sanity schemas deploy`. Sources:
  https://www.sanity.io/docs/cli-reference/deploy, `sanity deploy --help`.
- `sanity dev` flags `--port` (3333), `--host`, `--[no-]auto-updates`, `--[no-]load-in-dashboard`;
  `sanity documents` has `create`, `delete`, `get`, `query`, `validate`; `sanity datasets` has `copy`,
  `create`, `delete`, `export`, `import`, `list`; `sanity blueprints` has `config`, `deploy`, `destroy`,
  `doctor`, `info`, `init`, `logs`, `mint-deploy-token`, `plan`, `promote`, `stacks`; `sanity functions`
  has `add`, `dev`, `logs`, `test`, `env`. Source: the respective `--help` outputs at 8.9.1.

### TypeGen configuration

- `sanity typegen generate` flags: `--config-path` (default `sanity-typegen.json`) and `--watch`; the help
  text still documents `path` (default `./src/**/*.{ts,tsx,js,jsx}`), `schema` (`schema.json`) and
  `generates` (`./sanity.types.ts`) for that file. Source: `sanity typegen generate --help`.
- The real config type is `CliConfig.typegen?: Partial<TypeGenConfig> & { enabled?: boolean }` with
  `TypeGenConfig { formatGeneratedCode: boolean; generates: string; overloadClientMethods: boolean; path: string | string[]; schema: string }`;
  `enabled` runs typegen "as part of sanity dev and sanity build". Defaults from `@sanity/codegen` 8.1.0:
  `formatGeneratedCode` true (also `'oxfmt' | 'prettier'`), `generates` `./sanity.types.ts`,
  `overloadClientMethods` true, `schema` `./schema.json`, `path`
  `['./src/**/*.{ts,tsx,js,jsx,mjs,cjs,astro,vue,svelte}', './app/**/*.{ts,tsx,js,jsx,mjs,cjs,astro,vue,svelte}', './sanity/**/*.{ts,tsx,js,jsx,mjs,cjs}']`.
  There is no `augmentGroqModule` field in this version. Sources:
  `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts`, `node_modules/@sanity/codegen/dist/_exports/index.d.ts` (`configDefinition`).
- `sanity-typegen.json` is deprecated: the CLI prints "The separate typegen config has been deprecated.
  Use `typegen` in the sanity CLI config instead." and, when both exist, "The config from the Sanity CLI
  config is used." The change landed in Studio 4.19.0 (2025-11-25). Sources: scratch `sanity typegen
  generate` runs, `node_modules/@sanity/cli/dist/commands/typegen/generate.js`,
  https://www.sanity.io/docs/changelog/a2e12b4f-d3ed-4bc4-9663-565407157c91,
  https://www.sanity.io/docs/help/configuring-typegen-in-sanity-cli-config.
- `schemaExtraction` in `sanity.cli.ts`: `{ enabled?, enforceRequiredFields?, path?, watchPatterns?, workspace? }`;
  `path` "Defaults to `schema.json` in the working directory"; `enabled` runs extraction during
  `sanity dev` and `sanity build`. Source: `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts`.
- `defineCliConfig(config: CliConfig): CliConfig` (`@beta`) from `sanity/cli`; `createCliConfig` is deprecated.
  `CliConfig.api` is `{ dataset?: string; projectId?: string }`; other keys: `deployment { appId?, autoUpdates? }`,
  `studioHost` (deprecated), `server { hostname?, port? }`, `vite`, `graphql`, `reactStrictMode`,
  `reactCompiler`, `mediaLibrary`, `project.basePath`, `app`, `autoUpdates`, `unstable_bundledDev`.
  Sources: `node_modules/@sanity/cli/dist/exports/index.d.ts`, `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts`,
  https://www.sanity.io/docs/cli-configuration.
- `defineQuery` comes from `groq` 6.12.0: `export declare function defineQuery<const Q extends string>(query: Q): Q`
  ("This is a no-op"); TypeGen "Requires Sanity Studio v5.10.0 or later for GA TypeGen". Sources:
  `node_modules/groq/groq.d.ts`, https://www.sanity.io/docs/apis-and-sdks/sanity-typegen.

### Monorepo layout, verified in the scratch

- Project root detection: the CLI walks up from the cwd looking first for `sanity.config.(ts|js)` (a
  "studio" root) and then for `sanity.cli.(ts|js)` (an "app" root), up to 50 parents, else "No project
  root found". Source: `node_modules/@sanity/cli-core/dist/config/findProjectRootSync.js`.
- Verified run 1: in a directory holding `sanity.config.ts` (a `post` type with a required `title` and a
  `url` field) and `sanity.cli.ts` (`defineCliConfig({ api: { projectId, dataset } })`),
  `sanity schema extract --path ./schema.json --enforce-required-fields` wrote `schema.json` offline with a
  fake project id. Source: scratch `content/` run.
- Verified run 2: in a sibling `web/` directory with only `sanity-typegen.json`, `sanity typegen generate`
  failed with "No project root found". Adding `web/sanity.cli.ts` with `api` plus
  `typegen: { path: './src/**/*.{ts,tsx,astro}', schema: '../content/schema.json', generates: './src/sanity.types.ts', overloadClientMethods: true }`
  generated "2 queries and 12 schema types", one query from a `.ts` file and one from `.astro`
  frontmatter, and formatted the output with prettier. Source: scratch `web/` runs.
- Docs on split layouts: "For monorepos and separate repositories, use `--path` flag with `sanity schema
  extract` to output files to consuming application directories, or configure `typegen` paths in
  `sanity.cli.ts` to reference files outside the Studio root." Source: https://www.sanity.io/docs/apis-and-sdks/sanity-typegen.
- So for this repo: `packages/content` keeps `sanity.config.ts` (the schema owner, so `schema extract`
  runs there) and a `sanity.cli.ts` whose `typegen.path` globs point at `../web/src/**/*.{ts,astro}` and
  `generates` at the file `@oy/web` imports; or `packages/web` gets its own `sanity.cli.ts` with
  `schema: '../content/schema.json'`. Both shapes are what the runs above exercised. Source: the two bullets above.

## Studio configuration APIs in 6.12.0

### Schema helpers and validation

- `defineConfig<const T extends Config>(config: T): T` with `Config = SingleWorkspace | WorkspaceOptions[]`;
  `PluginOptions` carries `schema?: SchemaPluginOptions`, `document?: DocumentPluginOptions`, `tools?`,
  `form?`, `search?: { strategy? }`, `releases?`, `mediaLibrary?`. Sources:
  `node_modules/sanity/lib/index-BCCyfvTv.d.ts`, `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts`.
- `defineType`, `defineField`, `defineArrayMember` are generic over `TType`, `TName`, `TSelect`,
  `TPrepareValue`, `TAlias`, `TStrict`, take `(schemaDefinition, defineOptions?: DefineSchemaOptions)` and
  return the definition (fields and array members widened for `validation` and `initialValue`).
  Source: `node_modules/@sanity/types/lib/index.d.ts` lines 1923, 1944, 1965.
- `BaseSchemaDefinition { name; title?; description?: string | React.JSX.Element; hidden?: ConditionalProperty; readOnly?: ConditionalProperty; icon?; validation?; initialValue?; deprecated? }`;
  `ConditionalProperty = boolean | ConditionalPropertyCallback | undefined` with
  `ConditionalPropertyCallbackContext { document; parent; value; currentUser; path }`;
  `InitialValueProperty<Params, Value> = Value | InitialValueResolver<Params, Value> | undefined`.
  `DocumentDefinition` adds `orderings?: SortOrdering[]` (`{ title; name; by: SortOrderingItem[] }`,
  item `{ field; direction: 'asc' | 'desc' }`) and `PreviewConfig { select?; prepare? }` via `ObjectDefinition`.
  Source: `node_modules/@sanity/types/lib/index.d.ts`.
- Validation: `ValidationBuilder = (rule: T, context?) => RuleBuilder`; `RuleDef<T> { required(); skip(); custom(fn: CustomValidator); info(message?); error(message?); warning(message?); valueOfField(path) }`;
  `StringRule` adds `min`, `max`, `length`, `uppercase`, `lowercase`, `regex`, `email`; `UrlRule` adds
  `uri(options: UriValidationOptions)` with `{ scheme?; allowRelative?; relativeOnly?; allowCredentials? }`;
  `DocumentRule` is a bare `RuleDef`. Source: `node_modules/@sanity/types/lib/index.d.ts` lines 298 to 1547.

### Singletons

- Structure: `S.listItem().title('Site Settings').child(S.document().schemaType('siteSettings').documentId('siteSettings'))`
  and keep the type out of the generic list with
  `...S.documentTypeListItems().filter(listItem => !['siteSettings'].includes(listItem.getId()))`.
  Source: https://www.sanity.io/docs/studio/create-a-link-to-a-single-edit-page-in-your-main-document-type-list.
- Create menu: `document.newDocumentOptions: (prev, {currentUser, creationContext}) => prev.filter((templateItem) => !['siteSettings', 'navigation'].includes(templateItem.templateId))`;
  `creationContext.type` is `'global'`, `'document'` or `'structure'`. Types:
  `NewDocumentOptionsResolver = ComposableOption<TemplateItem[], NewDocumentOptionsContext>`,
  `ComposableOption<TValue, TContext> = (prev: TValue, context: TContext) => TValue`,
  `TemplateItem { templateId; title?; parameters?; icon?; initialDocumentId?; subtitle?; description? }`.
  Sources: https://www.sanity.io/docs/studio/new-document-options,
  `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts`.
- Actions: `document.actions?: DocumentActionComponent[] | DocumentActionsResolver` where
  `DocumentActionsResolver = ComposableOption<DocumentActionComponent[], DocumentActionsContext>`,
  `DocumentActionsContext extends ConfigContext { documentId?; schemaType; releaseId; versionType }`, and
  `DocumentActionComponent.action?: keyof DocumentActionKeys`. The built in keys are `delete`,
  `discardChanges`, `discardVersion`, `duplicate`, `restore`, `publish`, `unpublish`, `unpublishVersion`,
  `linkToCanvas`, `editInCanvas`, `unlinkFromCanvas`, `schedule`; the docs filter by
  `originalAction.action === 'publish'`, so removing delete and duplicate for a singleton is
  `prev.filter((a) => !['delete', 'duplicate'].includes(a.action))` gated on `context.schemaType`.
  Sources: `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts` (`SANITY_DEFINED_ACTIONS`),
  https://www.sanity.io/docs/studio/document-actions.
- Templates: `schema.templates?: Template[] | TemplateResolver` with `TemplateResolver = ComposableOption<Template[], ConfigContext>`
  and `Template { id; title; schemaType; icon?; value; parameters?; description? }`; the docs show
  `templates: (prev, context) => [...prev, {...}]` and note "Parameterized templates are only supported in
  Structure". Sources: `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts`,
  https://www.sanity.io/docs/initial-value-templates.

### Structure builder

- `structureTool` from `sanity/structure` takes `StructureToolOptions { icon?; name?; title?; structure?: StructureResolver; defaultDocumentNode?: DefaultDocumentNodeResolver }`;
  `StructureResolver = (S: StructureBuilder, context: StructureResolverContext) => unknown` and
  `StructureResolverContext extends ConfigContext { documentStore; i18n; perspectiveStack; selectedVariantName? }`
  with `ConfigContext { projectId; dataset; schema; currentUser; getClient; i18n }` (so structure can branch on
  `context.currentUser.roles`). Sources: `node_modules/sanity/lib/types-CPL35yMg.d.ts` lines 2214, 2272, 2294,
  `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts` line 7797.
- `StructureBuilder` members used by the brief: `list(spec?)`, `listItem(spec?)`, `documentList(spec?)`,
  `documentTypeList(typeNameOrSpec)`, `documentTypeListItem(typeName)`, `documentTypeListItems()`,
  `document(spec?)`, `divider(spec?)` (returns `DividerBuilder`; the docs page says `void`),
  `component(spec?: ComponentInput | UserComponent)`, `defaults()`, `editor`, `initialValueTemplateItem`,
  and `view: { form(spec?): FormViewBuilder; component(componentOrSpec?: Partial<ComponentView> | React.ComponentType<any>): ComponentViewBuilder }`.
  Sources: `node_modules/sanity/lib/types-CPL35yMg.d.ts` (`interface StructureBuilder`),
  https://www.sanity.io/docs/studio/structure-builder-api-reference.
- `DocumentListBuilder`: `apiVersion(apiVersion: string)`, `filter(filter: string)`, `schemaType(type)`,
  `params(params: Record<string, unknown>)`, `defaultOrdering(ordering: SortOrderingItem[])`, plus the
  inherited `id`, `title`, `child(child: Child)`, `menuItems`, `defaultLayout`. `ListBuilder.items(items: (ListItemBuilder | ListItem | Divider | DividerBuilder)[])`.
  `ListItemBuilder`: `id`, `title`, `icon`, `showIcon`, `child(child: UnserializedListItemChild)`, `schemaType`.
  `DocumentBuilder`: `id`, `title`, `child`, `documentId(documentId: string)`, `schemaType(documentType: SchemaType | string)`,
  `initialValueTemplate(templateId, parameters?)`, `views(views: (View | ViewBuilder)[])`, `defaultPanes`.
  Source: `node_modules/sanity/lib/types-CPL35yMg.d.ts`.
- The docs describe the same methods: `filter` "Filters the document list based on a GROQ filter
  expression", `params` "Sets the parameters to use when executing the query", `apiVersion` "Sets the API
  version to use for the given filter", `defaultOrdering`, `schemaType`, `documentId` "Sets the document ID
  this document node represents", `views` "Defines which views should be rendered for this document."
  Source: https://www.sanity.io/docs/studio/structure-builder-api-reference.

### Custom panes and views for the Pending list

- Two shapes exist. A pane: `S.component(Component)` where `UserComponent = React.ComponentType<{ child?; childItemId?; id: string; isActive?; isSelected?; itemId: string; options?; paneKey: string; urlParams }>`,
  chainable with `.title()`, `.options()`, `.child()`, `.menuItems()`. A document tab:
  `S.view.component(Component).title('JSON')` where `UserViewComponent<TOptions> = React.ComponentType<{ document: { draft; displayed; historical; published }; documentId: string; options: TOptions; schemaType: SchemaType }>`,
  registered through `defaultDocumentNode: (S, {schemaType, documentId}) => S.document().views([S.view.form(), ...])`.
  Sources: `node_modules/sanity/lib/types-CPL35yMg.d.ts` lines 1884 to 1912 and `ComponentBuilder`,
  https://www.sanity.io/docs/studio/create-custom-document-views-with-structure-builder.
- A plain GROQ driven list needs no component: `S.documentList().title('Pending').filter('!defined(ein)').apiVersion('2026-09-01').schemaType('siteSettings')`
  is the built in path. Source: `node_modules/sanity/lib/types-CPL35yMg.d.ts` (`DocumentListBuilder`).
- Querying from a component: `useClient(clientOptions: SourceClientOptions): SanityClient` from `sanity`
  with `SourceClientOptions { apiVersion: string }`; the zero argument overload also exists. Docs:
  `const client = useClient({ apiVersion: '2023-01-01' }).withConfig({ perspective: 'raw' })`.
  Sources: `node_modules/sanity/lib/index-BCCyfvTv.d.ts` lines 3292 and 3312,
  https://www.sanity.io/docs/studio/studio-react-hooks.

### Presentation tool

- `presentationTool: Plugin<PresentationPluginOptions>`, `defineDocuments(resolvers: DocumentResolver[])` and
  `defineLocations<K>(resolver: DocumentLocationResolverObject<K> | DocumentLocationsState)` come from
  `sanity/presentation` ("This function doesn't do anything itself, it is used to provide type
  information"). Source: `node_modules/sanity/lib/presentation.d.ts`.
- `PresentationPluginOptions { devMode?; icon?; name?; title?; allowOrigins?: PreviewUrlAllowOption; previewUrl: PreviewUrlOption; locate?; resolve?: { mainDocuments?: DocumentResolver[]; locations?: DocumentLocationResolvers | DocumentLocationResolver }; components?; unstable_showUnsafeShareUrl? }`.
  `PreviewUrlOption = string | DeprecatedPreviewUrlResolver | PreviewUrlResolverOptions` and
  `PreviewUrlResolverOptions { initial?: PreviewUrlInitialOption; previewMode?: PreviewUrlPreviewModeOption; origin?: string; preview?: string; draftMode? (deprecated) }`
  with `PreviewUrlPreviewMode { enable: string; shareAccess?; check?; disable? }`; `initial` and
  `previewMode` also accept context functions. So the brief's
  `previewUrl: { origin?, previewMode: { enable: '/api/preview/enable' } }` type checks, and the docs' form
  uses `initial`. Source: `node_modules/sanity/lib/types-BXXMkn4Q.d.ts` lines 452 to 536 and 655 to 675.
- `DocumentResolver` is a union: `{ route: string | string[]; type: string }`, or
  `{ route; filter: ContextFn<string> | string; params?: ContextFn<Record<string, string>> | Record<string, string> }`,
  or `{ route; resolve: ContextFn<{ filter; params? } | undefined> }`, with
  `DocumentResolverContext { origin; params; path }`. Docs: routes are "evaluated in order", `filter` uses
  `$paramName` for extracted URL parameters, `type` is the shorthand when no parameters are needed.
  Sources: `node_modules/sanity/lib/types-BXXMkn4Q.d.ts` lines 572 to 652,
  https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.
- `DocumentLocationResolvers = Record<string, DocumentLocationResolverObject | DocumentLocationsState>`;
  `DocumentLocationResolverObject<K> { select: Record<K, string>; resolve: (value: Record<K, any> | null) => DocumentLocationsState | null | undefined | void }`;
  `DocumentLocationsState { locations?: DocumentLocation[]; message?: string; tone?: 'positive' | 'caution' | 'critical' }`;
  `DocumentLocation { title: string; href: string; icon?; showHref? }`. A static state per type (for
  example a singleton with `message`) is allowed in place of a resolver. Source:
  `node_modules/sanity/lib/types-BXXMkn4Q.d.ts` lines 332 to 556.
- `allowOrigins` "controls which frontend origins the Presentation Tool trusts for Comlink (`postMessage`)
  communication" and needs `sanity` 3.85 or later (met). Source: https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.

## Roles (ticket 22)

- "Each plan type has access to specifically defined roles. Custom roles are available for Enterprise
  customers." Administrator and Viewer on all plans; Editor, Developer and Contributor on Growth and
  Enterprise; Custom on Enterprise. Pricing: Free "2 permission roles", 20 seats, $0; Growth "5
  permission roles", $15 per seat per month; Enterprise "Custom roles" and "Custom access control". So the
  brief's Editors need at least Growth, and the structure or document action fallback it describes is the
  Free plan path. Sources: https://www.sanity.io/docs/roles, https://www.sanity.io/docs/content-lake/roles-concepts
  ("Custom roles are an Enterprise plan feature"), https://www.sanity.io/pricing.

## Repo fit

- Contradictions with `docs/design/README.md`: "Studio v5" (v6 recommended above); "a plain `loadQuery`
  helper from `@sanity/astro`" (not exported, hand written per README and docs); `<SanityVisualEditing />`
  (the export is `VisualEditing` from `@sanity/astro/visual-editing`); "routes that set the draft cookie"
  (the documented cookie is `sanity-preview-perspective` holding the perspective). Sources: the bullets above,
  `docs/design/README.md` lines 63, 139 and 164 to 173.
- `packages/web` needs `sanity.config.ts` at its root (re-exporting `@oy/content`), `src/env.d.ts` with the
  module reference, and direct dependencies on `@sanity/astro`, `@astrojs/react`, `sanity`, `@sanity/client`,
  `react`, `react-dom`, `react-is`, `styled-components` plus the two `@types` packages; `@sanity/vision`
  and `@sanity/preview-url-secret` go where they are imported. Source: README manual install list, the
  root resolution bullet above.
- `packages/content` owns `sanity.config.ts` and `sanity.cli.ts` (`api.projectId`, `api.dataset`, `typegen`,
  `schemaExtraction`), so `bun typegen` is `sanity schema extract` then `sanity typegen generate` run
  there, as the brief's `bun typegen` line expects. Source: the monorepo bullets above,
  `packages/content/package.json` (placeholder `typegen` script).

## Open questions for the session

- Env flag or perspective cookie for draft mode: the README pattern (`PUBLIC_SANITY_VISUAL_EDITING_ENABLED`)
  versus the docs pattern (`perspectiveCookieName` set by the enable route). The cookie pattern is the one
  with enable and disable routes, which is what the brief asks for.
- Whether to import `VisualEditing` from `@sanity/astro/visual-editing` (reload on mutation, no
  `onPerspectiveChange`) or from `@sanity/visual-editing/react` as a `client:only` island (needs
  `@sanity/visual-editing` 6.1.2 as a direct dependency, which 3.5.2 will also bring).
- React strict mode in the embedded Studio under `astro dev` is unverified; `reactStrictMode` in
  `sanity.cli.ts` only documents the `sanity dev` path.
- Static prerender of the hash router Studio route is unverified (the scratch failed on Astro's prerender
  entry with and without the integration); the repo's server output path is the one that built.
- `sanity schemas list` and `schemas validate` printed "Command ... not found" for `--help`; check them
  inside the real project before wiring CI to either.
- Whether typegen `path` globs pointing outside the CLI root (`../web/src/**`) are honoured; the scratch
  only exercised a `schema` path outside the root and globs inside it.
