# Phase 2: Sanity Studio v6 and @sanity/astro 3.5.1 verified before pinning

Date: 5 September 2026. Method: `npm view <pkg> version|peerDependencies|engines|dependencies|time` against the
npm registry; the packages installed into a scratch directory with Bun 1.4.2 (not the repo) so the shipped `dist/*.d.ts`,
`lib/*.d.ts`, `dist/*.mjs`, `bin` files and READMEs could be read (`node_modules/...` paths refer to that install; `bun add`
lands the same files in the repo); the `sanity` CLI 8.9.1 under Node 22.22.1 (`--help`, `schema extract`, `typegen
generate`) against a throwaway schema with a fake project id and no network; one `astro build` of a scratch Astro 7.3.1
site with `output: 'server'`, `@astrojs/vercel` 11.0.10 and the embedded Studio; the primary docs named per bullet;
GitHub releases, issues and pull requests through `gh api`. Every pin is exact (`bunfig.toml` sets `exact = true`).
`@sanity/client`, `@sanity/image-url` and `groq` are covered in `phase-2-sanity-client-and-image-url.md`.

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `sanity` | 6.12.0 (recommended) | 6.12.0 (2026-09-01) | Current major (`latest` tag); `engines.node >=22.12`; peers `react ^19.2.2`, `react-dom ^19.2.2`, `styled-components ^6.1.15`; depends on `@sanity/cli ^8.7.0`, `@sanity/client ^8.4.0`, `@sanity/preview-url-secret ^4.1.5`, `@sanity/types 6.12.0`, `react-is ^19.2.8`. v5 ended at 5.31.2 (2026-08-19, tag `maintenance-v5`). |
| `@sanity/astro` | 3.5.1 (recommended) | 3.5.1 (2026-08-21) | Peers `astro ^2 || ^3 || ^4 || ^5 || ^6 || ^7`, `sanity ^3.99 || ^4 || ^5 || ^6`, `@sanity/client ^7.14.1 || ^8`, `react`, `react-dom`, `react-is` `^18.2 || ^19`, `styled-components ^6.1.19`; `engines.node >=20.19.0 || >=22.12.0`. 3.5.2 (visual-editing v6) is an unmerged release PR. |
| `@sanity/vision` | 6.12.0 (recommended) | 6.12.0 (2026-09-01) | Peers `sanity ^6.0.0-0`, `react ^19.2.2`; locked to the Studio major (5.31.2 peers `^4 || ^5`). |
| `@sanity/preview-url-secret` | 4.1.5 (recommended) | 4.1.5 (2026-08-21) | Peer `@sanity/client ^7.26.2 || ^8.0.0`; `sanity` depends on `^4.1.5`, so one copy; `engines.node >=20.19 <22 || >=22.12`. |
| `@astrojs/react` | 6.0.5 (recommended) | 6.0.5 (2026-08-31) | Required for the embedded Studio (`client:only="react"`); 6.0.0 is the Vite 8 (Astro 7) major; peers `react`, `react-dom` `^17.0.2 || ^18 || ^19`, `@types/react ^17.0.50 || ^18.0.21 || ^19`, `@types/react-dom ^17.0.17 || ^18.0.6 || ^19`; `engines.node >=22.12.0`. |
| `react`, `react-dom`, `react-is` | 19.2.8 (recommended) | 19.2.8 (2026-07-21) | `sanity` and `@sanity/vision` peer `react ^19.2.2`; `react-dom` 19.2.8 peers `react ^19.2.8`; `react-is` is a peer of `@sanity/astro` and `sanity` depends on `^19.2.8`. |
| `styled-components` | 6.5.3 (recommended) | 6.5.3 (2026-08-15) | Peers `sanity ^6.1.15`, `@sanity/astro ^6.1.19`, `@sanity/visual-editing ^6.1`; `@sanity/astro` declares it as a peer, so `packages/web` installs it. |
| `@types/react`, `@types/react-dom` | 19.2.18, 19.2.7 (recommended) | 19.2.18 (2026-07-30), 19.2.7 (2026-09-03) | Peers of `@astrojs/react`; `@sanity/types` peers `@types/react *`. |
| `@sanity/client`, `groq` | 8.5.0, 6.12.0 (see the client note) | 8.5.0 (2026-09-03), 6.12.0 (2026-09-01) | The `sanity:client` virtual module imports `createClient` from `@sanity/client`, so `packages/web` lists it directly; `groq` gives `defineQuery`. |
| `@sanity/visual-editing` | not pinned | 6.1.2 (2026-09-01) | Arrives as 5.7.3 through `@sanity/astro ^5.5.0` (5.7.3 peers `@sanity/client ^7.24.0`; 6.1.2 peers `^7.26.2 || ^8.0.0`); add 6.1.2 directly only for the docs' `@sanity/visual-editing/react` pattern. |
| `@sanity/cli`, `@sanity/types`, `@sanity/codegen` | not pinned | 8.9.1, 6.12.0, 8.1.0 | Arrive through `sanity`. |

Sources for the table: `npm view` of each package on 2026-09-05 (`version`, `time`, `engines`, `peerDependencies`,
`dependencies`, `dist-tags`), the installed `package.json` of `sanity`, `@sanity/astro`, `@sanity/visual-editing`, https://github.com/sanity-io/sanity-astro/pull/445.

## Studio v6 versus v5

- Registry: dist-tags `latest` 6.12.0, `maintenance-v5` 5.31.2, `maintenance-v4` 4.22.1, `next` 6.13.0-next.65; 6.0.0
  shipped 2026-06-11 and the v5 line received 5.31.2 on 2026-08-19, after 6.10.1. How long v5 receives fixes is
  unverified. The upgrade page: "Upgrading with `sanity@latest` installs the current major version, which is v6."
  Source: `npm view sanity dist-tags time`, `gh api repos/sanity-io/sanity/releases`, https://www.sanity.io/docs/help/upgrading-sanity-studio.
- v5 and v6 share the peers `react ^19.2.2`, `react-dom ^19.2.2`, `styled-components ^6.1.15` (5.31.2, 6.0.0, 6.12.0);
  the React floor came with v5 ("Sanity Studio v5 raises the minimum React version to 19.2.2"). Engines: 5.31.2
  `node >=20.19 <22 || >=22.12`, 6.x `node >=22.12`; the repo's 22.22.1 satisfies both. Vite: 5.31.2 builds against
  `vite ^7.3.5`, 6.12.0 against `vite ^8.2.2` (a devDependency; `@sanity/cli` 8.9.1 depends on `vite ^8.2.2` for
  `sanity dev` and `sanity build`); embedded, Astro's own Vite 8.2.2 bundles the Studio. Source: `npm view sanity@5.31.2
  peerDependencies engines devDependencies.vite`, `npm view sanity@6.12.0 engines`, `node_modules/sanity/package.json`,
  `node_modules/@sanity/cli/package.json`, `node_modules/astro/package.json`, https://www.sanity.io/docs/help/v4-to-v5.
- The v5 to v6 guide lists five changes: Node 22.12 minimum (set `engines.node`; the repo pins `22.x`); React strict
  mode on by default in development, off with `reactStrictMode: false` in `sanity.cli.ts` (a `sanity dev` behaviour;
  whether the embedded Studio under `astro dev` gets it is unverified); `auth.mode` removed, a static `providers`
  array replaces the built ins and `providers: (prev) => [...prev]` appends (the repo defines none); search default
  `groq2024`, `enableLegacySearch` removed, revert with `search.strategy: 'groqLegacy'` (the repo sets neither); Vite 8
  with Rolldown, so a custom `build.rollupOptions` becomes `build.rolldownOptions` (the repo has none). Schemas,
  plugins, the configuration shape and content APIs are unchanged; upgrade with `npm install sanity@^6`. The v6.0.0
  release body carries the matching `!` commits (#12859 Node 20, #12865 `auth.mode`, #12960 Vite 8) and "fix: use v6
  peer dep for `sanity` in `@sanity/vision` (#12967)". Source: https://www.sanity.io/docs/help/v5-to-v6,
  https://github.com/sanity-io/sanity/releases/tag/v6.0.0, `packages/web/package.json`,
  `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts` (`reactStrictMode?: boolean`).
- Nothing the brief asks for is gone or renamed in 6.12.0: `structureTool`, `S.view.component`, `presentationTool`,
  `defineLocations`, `defineDocuments`, `document.newDocumentOptions`, `document.actions`, `schema.templates`,
  `defineQuery`, `sanity schema extract` and `sanity typegen generate` are all quoted from the shipped files below.
  6.9.0 (2026-08-04) changed only typings: "Schema define helpers now preserve explicitly supplied optional properties
  on their return types." No 6.x changelog title mentions a deprecation. Source: the sections below,
  https://www.sanity.io/docs/changelog/studio-Ni44LjA, https://www.sanity.io/docs/changelog?product=c91b88aa-f3eb-481f-879a-8a1cebc1297c.
- Recommendation: pin v6 (6.12.0). It is `latest`; the repo already meets the one hard change (Node 22.12); the other
  v6 changes touch nothing the brief configures; `@sanity/astro` accepted `sanity ^6` in 3.4.1 and `@sanity/vision`
  6.12.0 peers only `^6`; Astro 7 already runs Vite 8, so Studio and site share one bundler line. v5 would mean a
  maintenance line (5.31.2), `@sanity/vision` 5.x and a Vite 7 built Studio inside a Vite 8 site.
  Source: the bullets above, https://github.com/sanity-io/sanity-astro/releases/tag/v3.4.1.

## @sanity/astro 3.5.1

### Options, virtual modules, exports

- `type IntegrationOptions = ClientConfig & { studioBasePath?: string; studioRouterHistory?: 'browser' | 'hash'; logClientRequests?: 'dev' | 'build' | 'always' }`,
  `export default function sanityIntegration(integrationConfig?: IntegrationOptions): AstroIntegration`. `ClientConfig`
  supplies `projectId`, `dataset`, `useCdn`, `apiVersion`, `token`, `perspective`, `withCredentials` and
  `stega?: StegaConfig | boolean` with `StegaConfig { enabled?; studioUrl?: StudioUrl | ResolveStudioUrl; filter?; logger?; omitCrossDatasetReferenceData? }`.
  Source defaults: `apiVersion: "v2023-08-24"` when none is given; `studioRouterHistory` is `'hash'` when Astro
  `output` is `'static'` and `'browser'` otherwise; `studioBasePath` must be relative (an `http(s)://` value throws);
  `logClientRequests` omitted means no request logging. Source: `node_modules/@sanity/astro/dist/types/index.d.ts`,
  `node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` line 7855, `node_modules/@sanity/client/dist/types-CfGzbXrl.d.ts`,
  `node_modules/@sanity/astro/dist/sanity-astro.mjs` (`ae`, `ue`, `fe`), `node_modules/@sanity/astro/README.md`.
- Virtual modules: `sanity:client` exports `sanityClient: SanityClient` (built with `createClient` from `@sanity/client`);
  `sanity:studio` exports `config: Config` (the `sanity.config.ts` default export with `basePath` rewritten); types need
  `/// <reference types="@sanity/astro/module" />` in `src/env.d.ts`; a `page-ssr` script sets `globalThis.sanityClient`.
  Package exports: `.`, `./module`, `./studio/studio-route.astro`, `./studio/studio-route-hash.astro`,
  `./studio/studio-component.tsx`, `./visual-editing`, `./visual-editing/component`. No `loadQuery`.
  Source: `node_modules/@sanity/astro/module.d.ts`, `node_modules/@sanity/astro/dist/sanity-astro.mjs`,
  `node_modules/@sanity/astro/package.json`, `node_modules/@sanity/astro/README.md`.

### The Studio route and where sanity.config.ts lives

- The config file must sit in the Astro project root: the `sanity:studio` plugin calls `this.resolve("/sanity.config")`
  and throws "Sanity Studio requires a `sanity.config.ts|js` file in your project root." when nothing resolves; the
  README: "Create a new file in your project root called `sanity.config.ts` (or `.js`)". Not configurable. For this
  repo that is `packages/web/sanity.config.ts`, re-exporting the config built in `@oy/content` (the scratch used
  `export {default} from './content/sanity.config'`). `studioBasePath` is required and the integration owns `basePath`:
  it warns "This integration ignores the basePath setting in sanity.config.ts|js" and overwrites it (`/admin`,
  `/admin/<workspace>` per workspace in browser mode; `#/` and `#/<workspace>` in hash mode).
  Source: `node_modules/@sanity/astro/dist/sanity-astro.mjs`, `node_modules/@sanity/astro/README.md`, scratch `sanity.config.ts`.
- Route registration in `astro:config:setup`: browser mode calls
  `injectRoute({ entrypoint: '@sanity/astro/studio/studio-route.astro', pattern: '/admin/[...params]', prerender: false })`;
  hash mode injects `studio-route-hash.astro` at `/admin` with `prerender: true`. `studio-route.astro` sets
  `export const prerender = false` and renders `<StudioComponent client:only="react" />`, which renders
  `<Studio config={config} unstable_history={history} />` from `sanity`. Astro's `injectRoute` takes
  `{ pattern; entrypoint; prerender? }`. A dev only dedupe plugin (3.4.2, "duplicate React in astro dev") sets
  `resolve.dedupe` and `optimizeDeps.include` for React, `styled-components`, `sanity` and `@sanity/ui`;
  `SANITY_ASTRO_DISABLE_MODULE_DEDUPE=1` turns it off. Source: `node_modules/@sanity/astro/dist/sanity-astro.mjs`,
  `node_modules/@sanity/astro/dist/studio/studio-route.astro`, `node_modules/@sanity/astro/dist/studio/studio-component.tsx`,
  `node_modules/@sanity/astro/dist/types/vite-plugin-sanity-module-dedupe.d.ts`,
  https://docs.astro.build/en/reference/integrations-reference/, https://github.com/sanity-io/sanity-astro/releases/tag/v3.4.2.

### @astrojs/react, peers, Astro 7

- `@astrojs/react` is required: "`@astrojs/react` is only needed if you plan to embed a Sanity Studio in your project"
  and "`VisualEditing` ... is a React component under the hood, so you'll need the React integration for Astro"; both
  islands use `client:only="react"`, and Astro "doesn't know what framework your component uses unless you tell it
  explicitly". Manual install list: `@astrojs/react @sanity/astro @sanity/client sanity @types/react-dom @types/react-is
  @types/react react-dom react-is react styled-components`; with Bun's isolated linker every peer is a direct
  dependency of `packages/web`. `@astrojs/react` 6.0.0 (2026-06-22) is "Upgrade to Vite v8"; 6.0.1 to 6.0.5 only bump
  `@astrojs/internal-helpers`. Source: `node_modules/@sanity/astro/README.md`,
  `node_modules/@sanity/astro/dist/studio/studio-route.astro`, https://docs.astro.build/en/reference/directives-reference/,
  https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md.
- Verified build: a scratch Astro 7.3.1 site with `output: 'server'`, `adapter: vercel()` (`@astrojs/vercel` 11.0.10),
  `studioBasePath: '/admin'`, `stega: { studioUrl: '/admin' }`, a page importing `sanity:client` and `VisualEditing`, and
  `sanity.config.ts` at the root built in 11.3 s; the Vercel output routes `^/admin(?:/(.*?))?/?$` to `_render` and
  ships `studio-component.*.js`. Bun installed the whole pin set with no peer errors. Static output in the same
  scratch failed at Astro's prerender step ("Received protocol 'astro:'") both with and without the integration, so
  the hash router path is unverified here and the failure is not attributable to `@sanity/astro`.
  Source: scratch `bun add` and `astro build` runs, `.vercel/output/config.json`.
- Upstream: the examples still pin `astro` 5.4.1 or 5.11.1, `sanity ^5.31.1`, `@astrojs/react ^4.4.1`; an Astro 7
  reference app is open PR #441. Open issues: #415 (dev only "Invalid hook call" from unresolvable
  `optimizeDeps.include` entries under an isolated linker, reported on Astro 7.0.7 and `@astrojs/react` 6.0.1; PR #449
  drops `lodash/startCase.js` from the candidates), #414 (Windows dedupe aliasing), #390 (`NoMatchingRenderer` for
  `StudioComponent` on Netlify with Astro 6), #435 (pre optimise syntax highlighting deps). Pending PRs: #445 releases
  3.5.2 with `@sanity/visual-editing` v6, #451 injects the virtual module types and adds a `sanityLoader`, #388 (open
  since 2026-03-15) would add preview routes and an exported `loadQuery`.
  Source: https://github.com/sanity-io/sanity-astro/blob/main/apps/movies/package.json, and in
  https://github.com/sanity-io/sanity-astro the issues 415, 414, 390, 435 and the pull requests 449, 441, 445, 451, 388.

### Visual Editing, loadQuery and the preview routes

- Exports: `VisualEditing` (an `.astro` component) from `@sanity/astro/visual-editing` with props `enabled?: boolean`,
  `zIndex?`, `keepStegaOnCopy?`; it renders `<VisualEditingComponent client:only="react" />` only when `enabled`.
  `VisualEditingComponent` from `@sanity/astro/visual-editing/component` takes
  `Pick<VisualEditingOptions, 'zIndex' | 'refresh' | 'history' | 'keepStegaOnCopy' | 'onSuspiciousStega'>` and defaults
  `refresh` to `window.location.reload()`. The brief's `<SanityVisualEditing />` does not exist.
  Source: `node_modules/@sanity/astro/dist/visual-editing/visual-editing.astro`,
  `node_modules/@sanity/astro/dist/types/visual-editing/visual-editing-component.d.ts`, `node_modules/@sanity/astro/dist/visual-editing/visual-editing-component.tsx`.
- README, Enabling Visual Editing: "Please note that Visual Editing only works for server-side rendered pages." Steps:
  "Enable Overlays using the `VisualEditing` component", "Add the Presentation tool to the Studio", "Enable Stega" with
  `stega: { studioUrl: '/admin' }` beside `studioBasePath: '/admin'`. "Now, all you need is a `loadQuery` helper function
  akin to this one": it reads `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` and `SANITY_API_READ_TOKEN` (a Viewer token), sets
  `perspective = visualEditingEnabled ? 'drafts' : 'published'` and calls `sanityClient.fetch(query, params,
  { filterResponse: false, perspective, resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
  stega: visualEditingEnabled, token when enabled, useCdn: !visualEditingEnabled })`. So `loadQuery` is written in the
  site, not imported. Source: `node_modules/@sanity/astro/README.md`.
- The docs' Astro guide (Astro 7 `output: "server"`, `@sanity/astro` 3.5.0+, `@astrojs/react` 6+) uses a perspective
  cookie: `src/pages/api/draft-mode/enable.ts` calls `validatePreviewUrl(clientWithToken, request.url)`, answers 401
  "Invalid secret" when `!isValid`, sets
  `cookies.set(perspectiveCookieName, studioPreviewPerspective ?? "drafts", { httpOnly: false, sameSite: "none", secure: true, path: "/", partitioned })`
  (partitioned when `sec-fetch-dest` is `iframe` and `sec-fetch-site` is `cross-site`) and redirects 307 to `redirectTo`;
  `disable.ts` expires the cookie with two `Set-Cookie` headers (one `Partitioned`) and redirects to `/`. `loadQuery`
  treats the cookie as draft mode, parses it as the perspective (default `drafts`) and passes `stega: draftMode`,
  `resultSourceMap: 'withKeyArraySelector'` and the token. Studio side:
  `previewUrl: { initial: "http://localhost:4321", previewMode: { enable: "/api/draft-mode/enable" } }`. The guide runs
  a separate Studio and imports `VisualEditing` from `@sanity/visual-editing/react` with `onPerspectiveChange` and a
  reload `refresh`: "when an editor changes a field, the component triggers a full page reload to fetch fresh content".
  Source: https://www.sanity.io/docs/visual-editing-with-astro.
- `@sanity/preview-url-secret` 4.1.5: `validatePreviewUrl(_client: SanityClientLike, previewUrl: string): Promise<PreviewUrlValidateUrlResult>`,
  result `{ isValid; redirectTo?; studioOrigin?; studioPreviewPerspective?; studioPreviewVariant? }`. Constants from
  `@sanity/preview-url-secret/constants`: `perspectiveCookieName = 'sanity-preview-perspective'`,
  `urlSearchParamPreviewSecret = 'sanity-preview-secret'`; secrets are `sanity.previewUrlSecret` documents with a one
  hour `SECRET_TTL`. The client must carry a token ("Required, otherwise the URL preview secret can't be validated");
  creating a secret needs Contributor or above. Route names are free (`previewMode.enable` names them) and "The
  Presentation Tool doesn't call [`disable`] automatically". Source: `node_modules/@sanity/preview-url-secret/dist/index.d.ts`,
  `node_modules/@sanity/preview-url-secret/dist/constants-BUNGdmdB.d.ts`, `node_modules/@sanity/preview-url-secret/README.md`,
  https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.

## The sanity CLI, schema extract and TypeGen in 6.12.0

- Binary and commands: `sanity` declares `bin: { sanity: './bin/sanity' }`, a shim that resolves the `@sanity/cli`
  binary; Bun linked `node_modules/.bin/sanity -> ../@sanity/cli/bin/run.js`, and `bunx` "checks for a locally
  installed package first", so `bunx sanity` and package scripts work from any workspace that depends on `sanity`.
  `sanity --help` (CLI 8.9.1) lists commands `build`, `deploy`, `dev`, `exec`, `init`, `manage` ("Open project
  settings in your browser"), `preview`, `undeploy`, `versions`, `doctor`, `debug` and topics `schemas`, `typegen`,
  `documents` (`create`, `delete`, `get`, `query`, `validate`), `datasets` (`copy`, `create`, `delete`, `export`,
  `import`, `list`), `blueprints`, `functions`, `hooks`, `cors`, `tokens`, `users`, `migrations`, `media`, `manifest`,
  `mcp`, `graphql`, `backups`. `sanity schema` and `sanity dataset` print the `schemas` and `datasets` help; `sanity dev`
  takes `--port` (3333), `--host`, `--[no-]auto-updates`, `--[no-]load-in-dashboard`. Source: `node_modules/sanity/package.json`,
  `node_modules/sanity/bin/sanity`, `ls node_modules/.bin`, https://docs.bun.sh/docs/pm/bunx, the `--help` outputs at 8.9.1.
- `sanity schemas`: `delete`, `deploy`, `extract`, `list`, `validate`. `extract` flags `--enforce-required-fields`,
  `--force`, `--format` (only `groq-type-nodes`), `--path`, `--watch`, `--watch-patterns`, `--workspace` ("experimental
  and subject to change"); `deploy` flags `--[no-]extract-manifest`, `--manifest-dir` (default `./dist/static`), `--tag`,
  `--verbose`, `--workspace`. `schemas list --help` and `schemas validate --help` answered "Command schemas list not
  found" in this install; whether they run inside a project is unverified. `sanity deploy` "builds the Studio through
  Vite, extracts your schema and manifest, packages everything"; `--no-build` "still runs schema extraction and
  upload"; `--schema-required` fails on schema errors; `--external` registers an externally hosted Studio.
  Source: `sanity schemas extract --help`, `sanity schemas deploy --help`, `sanity deploy --help`,
  https://www.sanity.io/docs/schemas-cli-command-reference, https://www.sanity.io/docs/cli-reference/deploy.
- `sanity typegen generate` flags: `--config-path` (default `sanity-typegen.json`) and `--watch`; its help still describes
  that file's `path`, `schema` and `generates`. The real config is `CliConfig.typegen?: Partial<TypeGenConfig> & { enabled?: boolean }` with
  `TypeGenConfig { formatGeneratedCode: boolean; generates: string; overloadClientMethods: boolean; path: string | string[]; schema: string }`
  (`enabled` runs typegen "as part of sanity dev and sanity build"). Defaults in `@sanity/codegen` 8.1.0:
  `formatGeneratedCode` true (or `'oxfmt' | 'prettier'`), `generates` `./sanity.types.ts`, `overloadClientMethods` true,
  `schema` `./schema.json`, `path`
  `['./src/**/*.{ts,tsx,js,jsx,mjs,cjs,astro,vue,svelte}', './app/**/*.{ts,tsx,js,jsx,mjs,cjs,astro,vue,svelte}', './sanity/**/*.{ts,tsx,js,jsx,mjs,cjs}']`.
  No `augmentGroqModule` exists in this version. `sanity-typegen.json` is deprecated: the CLI prints "The separate
  typegen config has been deprecated. Use `typegen` in the sanity CLI config instead." and, when both exist, "The config
  from the Sanity CLI config is used."; the move landed in Studio 4.19.0 (2025-11-25). TypeGen GA needs Studio 5.10.0 or
  later per the docs. `defineQuery<const Q extends string>(query: Q): Q` comes from `groq` ("This is a no-op").
  Source: `sanity typegen generate --help`, scratch `sanity typegen generate` runs,
  `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts`, `node_modules/@sanity/codegen/dist/_exports/index.d.ts`,
  `node_modules/@sanity/cli/dist/commands/typegen/generate.js`, `node_modules/groq/groq.d.ts`,
  https://www.sanity.io/docs/changelog/a2e12b4f-d3ed-4bc4-9663-565407157c91, https://www.sanity.io/docs/apis-and-sdks/sanity-typegen.
- `sanity.cli.ts`: `defineCliConfig(config: CliConfig): CliConfig` (`@beta`) from `sanity/cli` (`createCliConfig` is
  deprecated); `CliConfig.api` is `{ dataset?: string; projectId?: string }`;
  `schemaExtraction { enabled?; enforceRequiredFields?; path?; watchPatterns?; workspace? }` (`path` "Defaults to
  `schema.json` in the working directory"); also `deployment`, `server`, `vite`, `graphql`, `reactStrictMode`,
  `reactCompiler`, `mediaLibrary`, `app`; `studioHost` is deprecated. Source: `node_modules/@sanity/cli/dist/exports/index.d.ts`,
  `node_modules/@sanity/cli-core/dist/cliConfig-DUt8uaF6.d.ts`, https://www.sanity.io/docs/cli-configuration.
- Monorepo layout, verified: the CLI walks up from the cwd for `sanity.config.(ts|js)` (a "studio" root), then
  `sanity.cli.(ts|js)` (an "app" root), up to 50 parents, else "No project root found". In a directory holding both files
  (a `post` type with a required `title` and a `url` field), `sanity schema extract --path ./schema.json
  --enforce-required-fields` wrote `schema.json` offline with a fake project id. In a sibling `web/` with only
  `sanity-typegen.json` the generate command failed with "No project root found"; with `web/sanity.cli.ts` holding `api` and
  `typegen: { path: './src/**/*.{ts,tsx,astro}', schema: '../content/schema.json', generates: './src/sanity.types.ts', overloadClientMethods: true }`
  it generated "2 queries and 12 schema types", one query from a `.ts` file and one from `.astro` frontmatter, formatted
  with prettier. The docs cover split layouts: point `sanity schema extract --path` at the consuming app, or set
  `typegen` paths in `sanity.cli.ts` to files outside the Studio root. Source: `node_modules/@sanity/cli-core/dist/config/findProjectRootSync.js`,
  scratch `content/` and `web/` runs, https://www.sanity.io/docs/apis-and-sdks/sanity-typegen.

## Studio configuration APIs in 6.12.0

- `defineConfig<const T extends Config>(config: T): T`, `Config = SingleWorkspace | WorkspaceOptions[]`; `PluginOptions`
  carries `schema?: SchemaPluginOptions`, `document?: DocumentPluginOptions`, `tools?`, `form?`, `search?: { strategy? }`,
  `releases?`. `defineType`, `defineField`, `defineArrayMember` take `(schemaDefinition, defineOptions?: DefineSchemaOptions)`
  and return the definition. `BaseSchemaDefinition { name; title?; description?; hidden?: ConditionalProperty; readOnly?: ConditionalProperty; icon?; validation?; initialValue?; deprecated? }`,
  `ConditionalProperty = boolean | ConditionalPropertyCallback | undefined` with context `{ document; parent; value; currentUser; path }`,
  `InitialValueProperty<Params, Value> = Value | InitialValueResolver | undefined`; `DocumentDefinition` adds
  `orderings?: SortOrdering[]` (`{ title; name; by: SortOrderingItem[] }`, item `{ field; direction: 'asc' | 'desc' }`) and
  `PreviewConfig { select?; prepare? }`. Validation: `ValidationBuilder = (rule: T, context?) => RuleBuilder`;
  `RuleDef<T> { required(); skip(); custom(fn: CustomValidator); info(message?); error(message?); warning(message?); valueOfField(path) }`;
  `StringRule` adds `min`, `max`, `length`, `uppercase`, `lowercase`, `regex`, `email`; `UrlRule` adds
  `uri(options: UriValidationOptions)` with `{ scheme?; allowRelative?; relativeOnly?; allowCredentials? }`; `DocumentRule`
  is a bare `RuleDef`. Source: `node_modules/sanity/lib/index-BCCyfvTv.d.ts`, `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts`,
  `node_modules/@sanity/types/lib/index.d.ts` lines 298 to 1547, 1923 to 1965, 2093 to 2134 and 2481.
- Singletons: `S.listItem().title('Site Settings').child(S.document().schemaType('siteSettings').documentId('siteSettings'))`
  and `...S.documentTypeListItems().filter(listItem => !['siteSettings'].includes(listItem.getId()))`; create menu
  `document.newDocumentOptions: (prev, {currentUser, creationContext}) => prev.filter((templateItem) => !['siteSettings', 'navigation'].includes(templateItem.templateId))`
  with `creationContext.type` `'global' | 'document' | 'structure'`. Types:
  `NewDocumentOptionsResolver = ComposableOption<TemplateItem[], NewDocumentOptionsContext>`,
  `ComposableOption<TValue, TContext> = (prev: TValue, context: TContext) => TValue`,
  `TemplateItem { templateId; title?; parameters?; icon?; initialDocumentId?; subtitle?; description? }`.
  Source: https://www.sanity.io/docs/studio/create-a-link-to-a-single-edit-page-in-your-main-document-type-list,
  https://www.sanity.io/docs/studio/new-document-options, `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts`.
- Actions and templates: `document.actions?: DocumentActionComponent[] | DocumentActionsResolver`,
  `DocumentActionsResolver = ComposableOption<DocumentActionComponent[], DocumentActionsContext>`,
  `DocumentActionsContext extends ConfigContext { documentId?; schemaType; releaseId; versionType }`,
  `DocumentActionComponent.action?: keyof DocumentActionKeys` with keys `delete`, `discardChanges`, `discardVersion`,
  `duplicate`, `restore`, `publish`, `unpublish`, `unpublishVersion`, `linkToCanvas`, `editInCanvas`, `unlinkFromCanvas`,
  `schedule`; the docs filter on `originalAction.action === 'publish'`, so a singleton drops `delete` and `duplicate`
  with `prev.filter((a) => !['delete', 'duplicate'].includes(a.action))` gated on `context.schemaType`.
  `schema.templates?: Template[] | TemplateResolver` (`ComposableOption<Template[], ConfigContext>`),
  `Template { id; title; schemaType; icon?; value; parameters?; description? }`; docs: `templates: (prev, context) => [...prev, {...}]`,
  "Parameterized templates are only supported in Structure". Source: `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts`
  (`SANITY_DEFINED_ACTIONS`), https://www.sanity.io/docs/studio/document-actions, https://www.sanity.io/docs/initial-value-templates.
- Structure tool: `structureTool` from `sanity/structure` takes
  `StructureToolOptions { icon?; name?; title?; structure?: StructureResolver; defaultDocumentNode?: DefaultDocumentNodeResolver }`;
  `StructureResolver = (S: StructureBuilder, context: StructureResolverContext) => unknown`,
  `StructureResolverContext extends ConfigContext { documentStore; i18n; perspectiveStack; selectedVariantName? }`,
  `ConfigContext { projectId; dataset; schema; currentUser; getClient; i18n }` (structure can branch on `currentUser`).
  `StructureBuilder` members: `list`, `listItem`, `documentList`, `documentTypeList`, `documentTypeListItem`,
  `documentTypeListItems`, `document`, `divider` (returns `DividerBuilder`; the docs page says `void`),
  `component(spec?: ComponentInput | UserComponent)`, `defaults`, `editor`, `initialValueTemplateItem`, and
  `view: { form(spec?): FormViewBuilder; component(componentOrSpec?: Partial<ComponentView> | React.ComponentType<any>): ComponentViewBuilder }`.
  Builders: `DocumentListBuilder` has `apiVersion(apiVersion: string)`, `filter(filter: string)`, `schemaType(type)`,
  `params(params: Record<string, unknown>)`, `defaultOrdering(ordering: SortOrderingItem[])` plus inherited `id`, `title`,
  `child(child: Child)`, `menuItems`, `defaultLayout`; `ListBuilder.items(items: (ListItemBuilder | ListItem | Divider | DividerBuilder)[])`;
  `ListItemBuilder` has `id`, `title`, `icon`, `child(child: UnserializedListItemChild)`, `schemaType`; `DocumentBuilder`
  has `id`, `title`, `child`, `documentId(documentId: string)`, `schemaType(documentType: SchemaType | string)`,
  `initialValueTemplate(templateId, parameters?)`, `views(views: (View | ViewBuilder)[])`.
  Source: `node_modules/sanity/lib/types-CPL35yMg.d.ts` (lines 2214, 2272, 2294, `interface StructureBuilder`, the builder
  classes), `node_modules/sanity/lib/useVirtualizerScrollInstance-gXzFwfIY.d.ts` line 7797,
  https://www.sanity.io/docs/studio/structure-builder-api-reference.
- Pending view, two shapes: a pane `S.component(Component)` with
  `UserComponent = React.ComponentType<{ child?; childItemId?; id: string; isActive?; isSelected?; itemId: string; options?; paneKey: string; urlParams }>`
  (chain `.title()`, `.options()`, `.child()`, `.menuItems()`), or a document tab `S.view.component(Component).title('JSON')` with
  `UserViewComponent<TOptions> = React.ComponentType<{ document: { draft; displayed; historical; published }; documentId: string; options: TOptions; schemaType: SchemaType }>`
  registered through `defaultDocumentNode: (S, {schemaType, documentId}) => S.document().views([S.view.form(), ...])`.
  A plain list needs no component: `S.documentList().title('Pending').filter('!defined(ein)').apiVersion('2026-09-01').schemaType('siteSettings')`.
  Queries from a component: `useClient(clientOptions: SourceClientOptions): SanityClient` from `sanity`,
  `SourceClientOptions { apiVersion: string }`; docs: `useClient({ apiVersion: '2023-01-01' }).withConfig({ perspective: 'raw' })`.
  Source: `node_modules/sanity/lib/types-CPL35yMg.d.ts` lines 1884 to 1912 and `ComponentBuilder`,
  `node_modules/sanity/lib/index-BCCyfvTv.d.ts` lines 3292 and 3312,
  https://www.sanity.io/docs/studio/create-custom-document-views-with-structure-builder, https://www.sanity.io/docs/studio/studio-react-hooks.
- Presentation: `presentationTool: Plugin<PresentationPluginOptions>`, `defineDocuments(resolvers: DocumentResolver[])`,
  `defineLocations<K>(resolver: DocumentLocationResolverObject<K> | DocumentLocationsState)` from `sanity/presentation`
  ("This function doesn't do anything itself, it is used to provide type information").
  `PresentationPluginOptions { devMode?; icon?; name?; title?; allowOrigins?: PreviewUrlAllowOption; previewUrl: PreviewUrlOption; locate?; resolve?: { mainDocuments?: DocumentResolver[]; locations?: DocumentLocationResolvers | DocumentLocationResolver }; components?; unstable_showUnsafeShareUrl? }`;
  `PreviewUrlOption = string | DeprecatedPreviewUrlResolver | PreviewUrlResolverOptions`,
  `PreviewUrlResolverOptions { initial?: PreviewUrlInitialOption; previewMode?: PreviewUrlPreviewModeOption; origin?: string; preview?: string; draftMode? (deprecated) }`,
  `PreviewUrlPreviewMode { enable: string; shareAccess?; check?; disable? }` (`initial` and `previewMode` also accept
  context functions). The brief's `previewUrl: { origin?, previewMode: { enable: '/api/preview/enable' } }` type checks;
  the docs use `initial`. `allowOrigins` "controls which frontend origins the Presentation Tool trusts for Comlink
  (`postMessage`) communication". Source: `node_modules/sanity/lib/presentation.d.ts`,
  `node_modules/sanity/lib/types-BXXMkn4Q.d.ts` lines 452 to 536 and 655 to 675,
  https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.
- Resolvers: `DocumentResolver` is `{ route: string | string[]; type: string }` or
  `{ route; filter: ContextFn<string> | string; params?: ContextFn<Record<string, string>> | Record<string, string> }` or
  `{ route; resolve: ContextFn<{ filter; params? } | undefined> }`, with `DocumentResolverContext { origin; params; path }`;
  docs: routes are "evaluated in order", `filter` uses `$paramName` for URL parameters, `type` is the shorthand without
  parameters. `DocumentLocationResolvers = Record<string, DocumentLocationResolverObject | DocumentLocationsState>`,
  `DocumentLocationResolverObject<K> { select: Record<K, string>; resolve: (value: Record<K, any> | null) => DocumentLocationsState | null | undefined | void }`,
  `DocumentLocationsState { locations?: DocumentLocation[]; message?: string; tone?: 'positive' | 'caution' | 'critical' }`,
  `DocumentLocation { title: string; href: string; icon?; showHref? }`. Source: `node_modules/sanity/lib/types-BXXMkn4Q.d.ts` lines 332 to 652,
  https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.

## Roles (ticket 22)

- "Each plan type has access to specifically defined roles. Custom roles are available for Enterprise customers."
  Administrator and Viewer on all plans; Editor, Developer and Contributor on Growth and Enterprise; Custom on
  Enterprise. Pricing: Free "2 permission roles", 20 seats, $0; Growth "5 permission roles", $15 per seat per month;
  Enterprise "Custom roles" and "Custom access control". The brief's Editors need at least Growth; its structure and
  document action fallback is the Free plan path. Source: https://www.sanity.io/docs/roles, https://www.sanity.io/pricing,
  https://www.sanity.io/docs/content-lake/roles-concepts ("Custom roles are an Enterprise plan feature").

## Repo fit

- Contradictions with `docs/design/README.md`: "Studio v5" (v6 above); "a plain `loadQuery` helper from `@sanity/astro`"
  (not exported, written in the site per README and docs); `<SanityVisualEditing />` (the export is `VisualEditing`
  from `@sanity/astro/visual-editing`); "routes that set the draft cookie" (the documented cookie is
  `sanity-preview-perspective` holding the perspective). Source: the bullets above, `docs/design/README.md` lines 63,
  139 and 164 to 173.
- `packages/web` needs `sanity.config.ts` at its root (re-exporting `@oy/content`), `src/env.d.ts` with the module
  reference, and direct dependencies on `@sanity/astro`, `@astrojs/react`, `sanity`, `@sanity/client`, `react`, `react-dom`,
  `react-is`, `styled-components` and the two `@types` packages; `@sanity/vision` and `@sanity/preview-url-secret` go
  where they are imported. `packages/content` owns `sanity.config.ts` and `sanity.cli.ts` (`api`, `typegen`,
  `schemaExtraction`), so `bun typegen` is `sanity schema extract` then `sanity typegen generate` run there, as the
  brief's `bun typegen` line expects. Source: the README manual install list, the root resolution and monorepo bullets
  above, `packages/content/package.json`.

## Open questions for the session

- Env flag or perspective cookie for draft mode: the README pattern (`PUBLIC_SANITY_VISUAL_EDITING_ENABLED`) versus the
  docs pattern (`perspectiveCookieName` set by the enable route, the shape with enable and disable routes the brief
  asks for); and `VisualEditing` from `@sanity/astro/visual-editing` (reload on mutation, no `onPerspectiveChange`) or
  from `@sanity/visual-editing/react` as a `client:only` island (needs `@sanity/visual-editing` 6.1.2 directly).
- React strict mode in the embedded Studio under `astro dev` is unverified; `reactStrictMode` in `sanity.cli.ts` only
  documents the `sanity dev` path. Static prerender of the hash router Studio route is unverified (the scratch failed
  on Astro's prerender entry with and without the integration); the server output path built.
- `sanity schemas list` and `schemas validate` printed "Command ... not found" for `--help`; check them inside the real
  project before wiring CI to either. Whether typegen `path` globs outside the CLI root (`../web/src/**`) are honoured
  is unverified; the scratch only exercised a `schema` path outside the root and globs inside it.
