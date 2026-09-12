# Phase 4: live collections, the Sanity loaders and loadQuery (ticket 20)

Date: 12 September 2026. Method: the shipped Astro 7.3.1 package at `packages/web/node_modules/astro`
(paths below are relative to it, line numbers from the built files) and the generated
`packages/web/.astro/content.d.ts`; `@sanity/astro` 3.5.1 and `@sanity/client` 8.5.0 as installed under
`packages/web/node_modules`; the Astro docs (the content collections guide, the content loader reference,
the caching guide, the v7 upgrade guide) and the raw Markdown of the first two from `withastro/docs`; the
GitHub release notes for astro@6.0.0, 6.2.2, 6.3.4, 7.0.0 and 7.0.6, the pull requests 13685 and 14550 and
the roadmap proposal 0055, all read with `gh api`; `sanity-io/sanity-astro` (releases, the main branch, the
open pull requests 388, 398, 445, 451 and 452 with their review threads and the loader sources on their
branches) and `sanity-io/agent-toolkit`, also through `gh api`; `npm view` and `npm search` against the
registry, run from the scratch directory, never the repo; the Sanity docs for Astro. The Sanity MCP server
needs an OAuth login that this non interactive session could not run, so the Astro rule was read from its
source file in `sanity-io/agent-toolkit` (section E). One Sanity URL failed: `/docs/visual-editing-with-astro`
(cited by the Phase 2 note) now answers 404; the guide lives at `/docs/astro/astro-visual-editing`. Nothing
was installed and no repo file changed except this note.

## The question

Ticket 20 asks which loader serves the homepage's lists now (the next event, three news posts, the four
programs, the testimonials, the stats, the doors) and the news, events, album and people lists later, per
request, with stega and drafts for Visual Editing: (a) Astro 7 live content collections, (b) an official
Sanity live loader for Astro, or (c) the repo's `loadQuery`. Source:
`docs/tickets/wayfinder/issues/20-sanity-loader-for-live-collections.md`.

## A. Live content collections are stable in Astro 7.3.1

- History: the feature landed experimentally through PR 13685 (commit 3c04c1f, 19 June 2025, Astro 5.10)
  from roadmap proposal 0055 (start date 2 May 2025; stage 1 discussion 1137, stage 2 issue 1151, stage 3
  PR 1164). PR 14550 "Stabilize live collections" ("Removes the `experimental.liveContentCollections` flag
  and enables it for all sites") merged on 4 November 2025 and shipped in astro@6.0.0: "Adds support for
  live content collections" and "If you were using the experimental feature, you must remove the
  `experimental.liveContentCollections` flag from your `astro.config.*` file". Source:
  `gh api repos/withastro/astro/commits/3c04c1f43027e2f9be0854f65c549fa1832f622a`,
  `gh api repos/withastro/astro/pulls/14550`, `gh api repos/withastro/astro/releases/tags/astro@6.0.0`,
  `proposals/0055-live-content-loaders.md` lines 17 to 21 in `withastro/roadmap`.
- Astro 7: the v7 upgrade guide does not mention live collections (the flags it lists as stabilised are the
  logger, queued rendering, the Rust compiler, advanced routing and route caching), and
  `grep liveContentCollections` over `dist` finds nothing in 7.3.1, so there is no flag left to set. The
  content collections guide documents "Live content collections" as a plain section; its one
  `<Since v="7.0.0" />` marker sits in the "Caching live data" subsection, because `Astro.cache` became
  stable in 7.0.0 ("Stabilizes route caching, removing the `experimental.cache` and `experimental.routeRules`
  flags", PR 17116). Source: https://docs.astro.build/en/guides/upgrade-to/v7/,
  https://docs.astro.build/en/guides/content-collections/#live-content-collections, the raw
  `content-collections.mdx`, `gh api repos/withastro/astro/releases/tags/astro@7.0.0`.
- Patches since 6.0.0: PR 15349 in 6.0.0 "Passes collection name to live content loaders" (the `collection`
  field in both contexts); 6.2.2 PR 16018 accepts `LiveLoader` data types declared as interfaces (issue
  16012: `astro check` failed on a custom loader on 6.0.7); 6.3.4 PR 16614 fixes `entry.data` inference when
  a live collection has no schema; 7.0.6 PR 17274 adds the missing `render()` overload for live entries when
  only `live.config.ts` exists. No 7.1 to 7.3 release note touches the API. Source: the release notes for
  astro@6.0.0, 6.2.2, 6.3.4 and 7.0.6, `gh api repos/withastro/astro/issues/16012`.
- Requirements and limits: "you must have an adapter configured for on-demand rendering of live collection
  data" (the repo has `output: 'server'` and `@astrojs/vercel`); no MDX, no image optimisation, no data
  store persistence, and "Data is fetched on each request (unless cached)". Source:
  https://docs.astro.build/en/guides/content-collections/#live-content-collections,
  `packages/web/astro.config.ts` lines 35 to 36.

## B. The API as shipped in 7.3.1

- The file: `searchLiveConfig` looks for `src/live.config.mjs`, `.js`, `.mts` or `.ts`
  (`dist/content/utils.js` lines 580 to 583). `defineLiveCollection` throws "Live collections must be
  defined in a `src/live.config.ts` file." when the importing file's name does not contain `live.config`
  (`dist/content/config.js` lines 13 to 23); `defineCollection` inside a live config throws "Collections
  in a live config file must use `defineLiveCollection`." (lines 63 to 73), and a loader with `loadEntry`
  or `loadCollection` but no `load` handed to `defineCollection` throws as well (lines 80 to 84). Inside the
  live config only `defineLiveCollection` and `z` work; `getCollection`, `getEntry`, `getLiveCollection`,
  `getLiveEntry`, `render`, `reference` and `defineCollection` throw "The X() function is not available in
  live config files." So the brief's `src/content.config.ts live collections` line names the wrong file.
  Source: the files named, `dist/virtual-modules/live-config.js`, `docs/design/README.md` line 226.
- `defineLiveCollection<L extends LiveLoader, S extends BaseSchema | undefined = undefined>(config: { type?: 'live'; schema?: S; loader: L })`
  returns the config (`dist/content/config.d.ts` lines 70 to 80). The schema is an optional Zod object; the
  proposal rules out loader defined Zod schemas ("loaders define types using TypeScript generics") and
  schema functions with `SchemaContext`. Source: the file named, proposal 0055 lines 169 to 170.
- The loader contract, `import type { LiveLoader } from 'astro/loaders'` (`package.json` exports line 65;
  `dist/content/loaders/index.d.ts` re-exports `./types.js`):

  ```ts
  interface LiveLoader<TData extends Record<string, any> = Record<string, any>,
    TEntryFilter extends Record<string, any> | never = never,
    TCollectionFilter extends Record<string, any> | never = never,
    TError extends Error = Error> {
    name: string;
    loadEntry: (context: LoadEntryContext<TEntryFilter>) => Promise<LiveDataEntry<TData> | undefined | { error: TError }>;
    loadCollection: (context: LoadCollectionContext<TCollectionFilter>) => Promise<LiveDataCollection<TData> | { error: TError }>;
  }
  interface LoadEntryContext<TEntryFilter = never> { filter: TEntryFilter extends never ? { id: string } : TEntryFilter; collection: string }
  interface LoadCollectionContext<TCollectionFilter = unknown> { filter?: TCollectionFilter; collection: string }
  ```

  Source: `dist/content/loaders/types.d.ts` lines 57 to 78.
- The shapes: `CacheHint { tags?: string[]; lastModified?: Date }`;
  `LiveDataEntry<TData> { id: string; data: TData; rendered?: { html: string }; cacheHint?: CacheHint }`;
  `LiveDataCollection<TData> { entries: LiveDataEntry<TData>[]; cacheHint?: CacheHint }`; the results
  `LiveDataCollectionResult { entries?; error?: TError | LiveCollectionError; cacheHint? }` and
  `LiveDataEntryResult { entry?; error?; cacheHint? }`. A hint has no `maxAge`: the runtime validates hints
  with `z.object({ tags: z.array(z.string()).optional(), lastModified: z.date().optional() })`, and the
  proposal defines the same two properties. `maxAge` and `swr` belong to `Astro.cache.set` and
  `routeRules`. Source: `dist/types/public/content.d.ts` lines 139 to 171, `dist/content/runtime.js` lines
  26 to 29, proposal 0055 lines 350 to 354 and 539 to 543, `dist/core/cache/types.d.ts` lines 4 to 14 and
  54 to 67.
- `getLiveCollection(collection: string, filter?: Record<string, unknown>): Promise<LiveDataCollectionResult>`
  and `getLiveEntry(collection: string, lookup: string | Record<string, unknown>): Promise<LiveDataEntryResult>`
  (`dist/content/runtime.d.ts` lines 66 to 71). The runtime builds `{ filter, collection }` and hands it to
  `loadCollection` unchanged (`runtime.js` lines 201 to 205); a string lookup becomes `{ id: lookup }`, an
  object passes through as the filter (lines 288 to 292). A filter is therefore any object the loader's
  generics accept; the guide calls them "loader-specific filters"
  (`getLiveCollection("articles", { status: "draft", author: "john-doe" })`). Source: the files named,
  https://docs.astro.build/en/guides/content-collections/#live-content-collections.
- Results and errors, in order: an unknown collection answers `{ error: LiveCollectionError }` ("is not a
  live collection"); a loader's `{ error }` is returned as is; `undefined` from `loadEntry` becomes
  `LiveEntryNotFoundError`; with a schema each entry is parsed and the first failure answers
  `LiveCollectionValidationError`; an invalid hint answers `LiveCollectionCacheHintError`; anything thrown is
  wrapped in `LiveCollectionError` with the cause. Every call answers an object and never throws. The classes
  are exported from `astro/content/runtime` (the guide imports `LiveEntryNotFoundError` from there), each
  with a `name` and a static `is()` for `instanceof` style checks. Source: `dist/content/runtime.js` lines
  188 to 323, `dist/content/loaders/errors.js`, `dist/content/runtime.d.ts` line 12, `package.json` exports
  line 67.
- Hint merging: `getLiveCollection` unions every entry's `tags` into the collection hint and keeps the latest
  `lastModified` (lines 232 to 259); `getLiveEntry` returns the entry's own hint as the result's `cacheHint`
  (lines 309 to 312). The guide: "tags are accumulated, and the most recent `lastModified` wins". Source:
  `dist/content/runtime.js`, the guide.
- Typing: the generated `astro:content` module declares
  `getLiveCollection<C>(collection: C, filter?: LiveLoaderCollectionFilterType<C>)` and
  `getLiveEntry<C>(collection: C, filter: string | LiveLoaderEntryFilterType<C>)`; `ExtractLoaderTypes`
  infers `TData`, both filters and `TError` from the loader's `LiveLoader<...>` generics, and
  `LiveLoaderDataType` is the loader's `TData` unless a `schema` is given, in which case `z.infer` of the
  schema wins (the guide: the schema "takes precedence over the live loader's types when you query the
  collection"). Today `LiveContentConfig = never` because the repo has no live config. Source:
  `packages/web/.astro/content.d.ts` lines 48 to 53, 74 to 77 and 130 to 158, the guide.

## C. cacheHint and Astro.cache: nothing is automatic

- Astro never applies a hint by itself. The proposal: "The returned data is not cached by Astro, but a loader
  can provide hints to assist in caching the response" and "The loader does not define how these should be
  used, and the user is free to use them in any way they like"; the loader reference says the hints help a
  caching strategy and do not cache responses on their own. The guide's example (marked Since 7.0.0) is
  `if (cacheHint) { Astro.cache.set(cacheHint); }` followed by `Astro.cache.set({ maxAge: 300 });`, and
  "You can also pass `LiveDataEntry` objects directly": `Astro.cache.set(entry)`. Source: proposal 0055
  lines 536 to 545, https://docs.astro.build/en/reference/content-loader-reference/#live-loaders, the raw
  `content-collections.mdx` subsection "Caching live data".
- How `set` merges: `AstroCache.set(input)` treats an object with `id`, `data` and `cacheHint` keys as a live
  entry and uses its hint (returning early when the entry has none); any other object is cache options.
  `maxAge`, `swr` and `etag` are last write wins, `lastModified` keeps the latest date, `tags` accumulate in
  a Set, and `set(false)` clears everything and opts the response out. A collection result
  `{ entries, cacheHint }` has no `id`, so pass its `cacheHint`, not the result. `invalidate(entry)` purges
  the entry's tags. Source: `dist/core/cache/runtime/cache.js` lines 15 to 43 and 57 to 68,
  `dist/core/cache/runtime/utils.js` lines 27 to 29.
- Where the tags go: the default provider writes `Cache-Tag` (comma separated), `CDN-Cache-Control`
  (`max-age`, `stale-while-revalidate`), `Last-Modified` and `ETag`; headers are applied only when `maxAge`
  is set or at least one tag exists. The Vercel provider writes `Vercel-CDN-Cache-Control` and
  `Vercel-Cache-Tag` and invalidates through `invalidateByTag` (recorded in the Phase 3 note). Source:
  `dist/core/cache/runtime/utils.js` lines 1 to 23, `cache.js` lines 70 to 81,
  `docs/research/phase-3-astro-actions-transitions-islands.md` section D.
- `routeRules` and page calls merge: per request the cache handler creates the `AstroCache` and, when a
  `routeRules` pattern matches the pathname, calls `cache.set(matched)` before the route runs, so a page's
  `Astro.cache.set(cacheHint)` adds to the rule's tags rather than replacing them. Without `cache.provider`
  the cache is `DisabledAstroCache`; in development it is `NoopAstroCache`, so cache headers can only be
  checked on a build. The repo's `astro.config.ts` has no `cache` block yet. Source:
  `dist/core/cache/handler.js` lines 12 to 42, `packages/web/astro.config.ts`.

## D. What a Sanity live loader receives, and how draft mode would reach it

- The loader sees `{ filter, collection }` and nothing else: no `Request`, no cookies, no headers, no
  `Astro.locals`. The 6.0.0 change that added `collection` is the only growth of the context since 5.10; the
  proposal mentions neither cookies nor locals; the guide's loaders take their configuration (`apiKey`,
  `endpoint`) when the collection is defined, once per process. A search of `withastro/astro` issues for
  request context in live loaders found nothing filed. Source: `dist/content/loaders/types.d.ts` lines 57 to
  66, `runtime.js` lines 201 to 205, astro@6.0.0 PR 15349, proposal 0055 (no match for "cookie" or
  "locals"), the guide's `src/live.config.ts` example, `gh api search/issues`.
- So the perspective must travel in the filter. The page (or a helper) reads
  `Astro.cookies.get(PERSPECTIVE_COOKIE)` exactly as `loadQuery` does and calls
  `getLiveCollection('news', { perspective, limit: 3 })`; the loader's `TCollectionFilter` and
  `TEntryFilter` generics type that object, and `getLiveEntry('news', { slug, perspective })` covers one
  document. Module level state is shared across requests on a warm function, so the filter is the only sound
  channel; stega and the source map then follow the perspective inside the loader, as `loadQuery` lines 47
  to 53 do today. Source: section B, `packages/web/src/lib/sanity/load-query.ts` lines 43 to 53,
  `packages/web/src/lib/sanity/preview.ts` lines 33 to 41.
- Neither Sanity draft switches per request: PR 398's `sanityLiveLoader` takes
  `visualEditing: { enabled, token, perspective, resultSourceMap, useCdn }` when the loader is created and
  builds one set of fetch options from it in `createFetchOptions`, so a deployment reads either drafts or
  published everywhere; PR 452's `createSanityLiveLoader({ name, collectionQuery, entryQuery, client })`
  says "Pass a draft-aware client for Draft Mode" and forwards the filter as GROQ parameters only. Source:
  `packages/sanity-astro/src/live/sanity-live-loader.ts` on branch `feat/live-loader` (lines 18 to 36 and
  the `createFetchOptions` function), `packages/sanity-astro/src/loader/index.ts` on branch
  `cursor/live-loader-codegen-f772` (lines 12 to 15 and 66 to 100), both read through `gh api`.

## E. No official Sanity live loader for Astro exists today

- `@sanity/astro` 3.5.1 (published 21 August 2026, dist-tag `latest`) exports `.`, `./module`,
  `./studio/studio-route.astro`, `./studio/studio-route-hash.astro`, `./studio/studio-component.tsx`,
  `./visual-editing` and `./visual-editing/component`. No `./loader`, no `./live-loader`, no `loadQuery`;
  the README still says "Now, all you need is a `loadQuery` helper function akin to this one" and shows the
  `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` version. The main branch (56dc0c3, 1 September 2026) has the same
  version, exports and README, and the pending release PR 445 (3.5.2, opened 1 September 2026) carries only
  "update dependency @sanity/visual-editing to v6 (#436)". Source: `npm view @sanity/astro@3.5.1 exports`,
  `npm view @sanity/astro time dist-tags`, `packages/web/node_modules/@sanity/astro/README.md` lines 355 to
  411, `gh api repos/sanity-io/sanity-astro/commits/main`, the main branch `packages/sanity-astro/package.json`
  and `CHANGELOG.md`, `gh api repos/sanity-io/sanity-astro/pulls/445`.
- Registry search on 12 September 2026: `sanity-astro-loader`, `@sanity/astro-loader`, `astro-sanity-loader`,
  `astro-loader-sanity`, `sanity-astro` and `@sanity/astro-live` do not exist (404). `astro-sanity` 1.1.7 is a
  third party helper last published on 14 September 2023. `@sanity/core-loader` 2.2.2 and
  `@sanity/react-loader` 2.2.2 (1 September 2026, `sanity-io/visual-editing`) are the Visual Editing query
  stores for React, with `@sanity/svelte-loader` 3.1.2 and `@sanity/nuxt-loader` 1.7.21 as the framework
  variants and `@sanity/next-loader` "replaced by next-sanity"; `core-loader` depends on `@sanity/comlink`,
  `@sanity/presentation-comlink` and `@sanity/visual-editing-csm`, and none of them targets Astro's
  `LiveLoader` contract. `npm search "sanity astro loader"` returns no Astro loader. Source: `npm view` of
  each name, `npm search`.
- The open pull requests on `sanity-io/sanity-astro` that matter, all unmerged on 12 September 2026:
  - 388 "wip: Add Sanity visual-editing draft mode support and exported loadQuery function" (opened 15 March
    2026, last updated 1 July 2026, would fix issue 329): `preview/enable` and `preview/disable` routes with
    `@sanity/preview-url-secret`, a cookie for draft mode, and a `sanity:load-query` virtual module that
    takes `Astro.cookies`. This is the shape the repo built by hand in Phase 2. Source:
    `gh api repos/sanity-io/sanity-astro/pulls/388`, `docs/research/phase-2-sanity-studio-v6-and-astro.md`.
  - 398 "feat: add Sanity live-loader and Astro live collections" by ChrisLaRocque (opened 7 May 2026, 29
    files): `@sanity/astro/live-loader` exporting
    `sanityLiveLoader({ client, collectionQuery, entryQuery, queryParams, mapData, mapId, cacheTagPrefix, visualEditing })`,
    `defineSanityLiveCollections` and schema helpers, plus `scripts/generate-live-schemas.mjs`, which turns
    TypeGen output into Zod with `ts-to-zod`; entries use `_id`, `lastModified` from `_updatedAt`, tags
    `sanity-<name>` and `sanity-<name>:<id>`. Reviews: stipsan on 13 May 2026 ("I love this! ... I want to
    push it further": a `live` integration option, a `sanity:loader` virtual module, `injectTypes`,
    `createCodegenDir`), msfragala on 14 May 2026 (both queries required, a filter example), the author on
    19 June 2026 ("I believe I got there if you'd like to re-review"). Its example app pins astro 6.3.0.
    Source: `gh api repos/sanity-io/sanity-astro/pulls/398`, `.../pulls/398/reviews`, `.../pulls/398/comments`,
    `.../issues/comments/4751743631`.
  - 452 "feat(live): generate schema.json and Zod live loaders from Astro hooks" by stipsan (opened 4
    September 2026, 24 files): the alternative that review asked for.
    `sanity({ live: { schema: './sanity.config.ts', loaders: { movie: { type, projection, orderBy } } } })`
    in `astro.config`; the integration extracts `schema.json` through the non public
    `@sanity/cli-build/_internal/extract` ("not a public API ... a rename breaks with a clear error"), runs
    `groq-js` `typeEvaluate()` and emits TypeScript plus Zod into a `sanity:loader` virtual module
    (`movieLoader()`, `movieSchema`); `@sanity/astro/loader` exports `createSanityLiveLoader`; entries use
    `_id` and `_updatedAt`, tags `sanity:<name>` and `sanity:<name>:<id>`, and collection tags come from the
    API's `syncTags` when present (`filterResponse: false`); "live collections need Astro 6 or later"; out of
    scope: raw query overrides, a separate entry projection, slugs other than `slug.current`. Source:
    `gh api repos/sanity-io/sanity-astro/pulls/452`, `.../pulls/452/files`, branch
    `cursor/live-loader-codegen-f772`.
  - 451 "feat: inject virtual module types, add sanityLoader and ship an ESM-only package" (3 September
    2026): `@sanity/astro/loader` with `sanityLoader({ client, query, params, id })` for build time
    `defineCollection()` (the Content Layer, data frozen at build), not a live loader. Source:
    `gh api repos/sanity-io/sanity-astro/pulls/451`.
- Sanity's Astro docs (eight guides: introduction, quickstart, visual editing, configure, embedding the
  Studio, query content, images and Portable Text, static and server rendering) mention neither content
  collections, live collections, a loader nor caching. "Query content" prescribes `sanity:client` plus
  `defineQuery` in separate `.ts` files ("Sanity TypeGen doesn't fully support `.astro` file syntax") and a
  shared `loadQuery` helper; "Visual Editing with Astro" prescribes a custom `loadQuery` that reads the
  perspective cookie, `parsePerspective` for release stacks, `stega: draftMode`, and the
  `/api/draft-mode/enable` and `disable` routes; "Static and server rendering" pairs `prerender = false`
  with `loadQuery` and says to set `useCdn: false` for the drafts perspective. Source:
  https://www.sanity.io/docs/astro, https://www.sanity.io/docs/astro/query-content-astro,
  https://www.sanity.io/docs/astro/astro-visual-editing,
  https://www.sanity.io/docs/astro/static-and-server-rendering.
- The rule set: the MCP server's `astro` rule (SKILL.md line 48: "`astro` - Astro integration with
  @sanity/astro") is `skills/sanity-best-practices/references/astro.md` in `sanity-io/agent-toolkit`, whose
  README says the MCP server gives "always up-to-date rules"; the file last changed on 21 May 2026
  (fe615e4). It says: fetch with `sanityClient.fetch(POSTS_QUERY)` in frontmatter with `defineQuery` from
  `groq`, "abstract queries into a utility file", define `getStaticPaths` queries inside that function, and
  for Visual Editing "Ensure `stega` is enabled in your client configuration if you want clickable overlays"
  plus "The `@sanity/astro` integration is evolving. Check the latest docs". No loader, no live collection,
  no cache tag, no perspective cookie. Re-run `list_sanity_rules` and `get_sanity_rules` for `astro` once
  the MCP server is logged in; this file is what it serves. Source:
  `gh api repos/sanity-io/agent-toolkit/contents/skills/sanity-best-practices/references/astro.md`,
  `.../SKILL.md`, `.../README.md` line 27, `gh api repos/sanity-io/agent-toolkit/commits?path=...`.

## F. The three options against the repo's constraints

The constraints and where each is fixed: GROQ only in `@oy/content` through `defineQuery`, typed by
TypeGen's `SanityQueries` registry so that `client.fetch` and `ClientReturn<Q>` resolve the result
(`packages/content/src/queries.ts` lines 1 to 7, `packages/content/src/sanity.types.ts` lines 1309 to 1319,
`@sanity/client` `dist/index.node.d.ts` lines 9804 to 9837; TypeGen scans `../web/src/**/*.{ts,astro}` per
`packages/content/sanity.cli.ts`); the Viewer token on every read because the datasets are private
(`packages/web/src/lib/sanity/load-query.ts` lines 29 to 36); the perspective cookie switching a read to
drafts with stega and the source map per request (lines 43 to 53); cache tags per document type from
`cacheTagsFor(type)`, which answers `type:<type>` plus one `route:<route>` per affected route
(`packages/content/src/routes.ts` lines 79 to 84, with `TYPE_ROUTES` at lines 41 to 67), one tag per type a
page reads (`.claude/skills/oy-page/SKILL.md` step 7); one composed homepage read, which GROQ supports as an
object projection ("Combining several unrelated queries in one request
`{'featuredMovie': *[...][0], 'scifiMovies': *[...]}`"); TypeGen typing the results. Source: the files named,
https://www.sanity.io/docs/content-lake/query-cheat-sheet.

| Constraint | (a) live collections with a repo loader | (b) official Sanity loader | (c) `loadQuery` |
| --- | --- | --- | --- |
| GROQ in `@oy/content` with `defineQuery` | Yes: the loader imports the query constants | No: 452 writes projections in `astro.config`, 398 query strings in `live.config.ts` | Yes |
| TypeGen types | Yes: `TData` is the TypeGen result type, no Zod needed | No: 452 generates its own types and Zod through a private CLI entry; 398 converts TypeGen output with `ts-to-zod` | Yes: `ClientReturn<Q>` |
| Viewer token | Yes, inside the loader | 452: on the client passed in; 398: `visualEditing.token` | Yes |
| Perspective per request | Only through the filter object (section D) | No: fixed when the loader is created | Yes, from `cookies` |
| Cache tags per type | Yes, as hints the page applies; `_updatedAt` as `lastModified` | Their own `sanity:<name>` scheme and `syncTags` | Yes, `cacheTagsFor` in `Astro.cache.set` |
| One composed homepage read | No: one collection per type, so six calls, or a contrived single entry collection | No | Yes, one query |
| Adds a package | No | Yes, and unreleased | No |
| Typed filters and error classes | Yes | Yes | No: `data: null` plus `error` |

- (a) meets every constraint except the composed read, at the price of `src/live.config.ts`, a loader
  module, one `defineLiveCollection` per type, and the cookie read moving to the page. The runtime is stable
  and its early typing bugs are fixed (section A). Source: sections A to D.
- (b) is not on the registry, and both drafts miss three constraints (GROQ location and TypeGen, per request
  perspective, the tag scheme); 452 also depends on a private CLI entry and declares raw query overrides out
  of scope. Source: section E.
- (c) exists, matches Sanity's docs and rule set, and is the shape upstream would formalise (388's
  `sanity:load-query` takes `Astro.cookies`). It lacks Astro's error classes and typed filters, which the
  page code does not need: a failed read already answers `data: null` and the page renders Pending. Source:
  sections D and E, `load-query.ts` lines 55 to 64.
- Per document tags, if ever wanted: `client.fetch(query, params, { filterResponse: false })` answers
  `RawQueryResponse` with `syncTags?: SyncTag[]` (strings prefixed `s1:`, `apiVersion` 2021-03-25 or later),
  the identifiers the Live Content API invalidates; `cacheMode: 'noStale'` exists for CDN reads. The repo's
  `type:` and `route:` tags are what `/api/revalidate` computes from a webhook body, so they are the ones
  to attach. Source: `@sanity/client` `dist/index.node.d.ts` lines 9436 to 9484 and 9766,
  `packages/web/src/pages/api/revalidate.ts` lines 34 to 39.

## Recommendation for Phase 4

- Serve the homepage with `loadQuery` and one composed `homepageQuery` in `packages/content/src/queries.ts`:
  an object projection holding the `homepage` singleton and the six lists (`"nextEvent": *[_type == "event"
  && ...] | order(...)[0]{...}`, `"news": *[_type == "newsPost"] | order(...)[0...3]{...}`, and so on), so
  TypeGen registers one result type and one round trip carries the token, the perspective and stega (confirm
  the generated type with `bun typegen`; the `TypeGen drift` job catches a miss). Tag the response with
  `Astro.cache.set({ maxAge, swr, tags: [...cacheTagsFor('homepage'), 'type:event', 'type:newsPost', 'type:program', 'type:testimonial', 'type:stat', 'type:door'] })`,
  the types `TYPE_ROUTES` already lists for `/`, and call `Astro.cache.set(false)` when the perspective
  cookie is present, which is ticket 21's decision. Source: sections C and F, `routes.ts` lines 41 to 67,
  `docs/tickets/wayfinder/issues/21-cache-and-draft-mode.md`.
- The lists later (news, events, albums, people): the same `loadQuery` with list queries in `@oy/content`
  is enough and is what Sanity documents. If the session wants the `getLiveCollection` API for its typed
  filters and error classes, add it as a thin wrapper rather than a second read path:
  `packages/web/src/lib/sanity/live-loader.ts` exporting a `sanityLiveLoader({ collectionQuery, entryQuery, type })`
  that calls `loadQuery` and answers entries with `id: _id` and
  `cacheHint: { tags: cacheTagsFor(type, slug), lastModified: new Date(_updatedAt) }`, plus
  `src/live.config.ts` with one `defineLiveCollection` per type and `TData` taken from the TypeGen result;
  pages pass `{ perspective }` from the cookie in the filter and call `Astro.cache.set(cacheHint)`. Either
  way, reword `oy-page` step 2 ("lists ... through the live content collections") and the brief's "Sanity
  loader" and `content.config.ts` lines to name the repo's own loader and `live.config.ts`, since no package
  supplies one. Source: sections B, D and E, `.claude/skills/oy-page/SKILL.md` lines 17 to 20,
  `docs/design/README.md` lines 137 to 139 and 226.
- Do not add `@sanity/astro`'s loader until a release ships one with a per request perspective and types
  from TypeGen; today none does, and 3.5.2 will not. Source: section E.
- What would change the answer: `@sanity/astro` merging 452 or 398 with a perspective (or cookie) filter and
  TypeGen based types, or 388 exporting `loadQuery` with `Astro.cookies` (then the repo's helper becomes an
  import and keeps `ClientReturn` typing); Astro adding request context to `LoadCollectionContext` (nothing
  filed); Astro applying hints automatically (the docs and the proposal say the opposite). Watch
  `sanity-io/sanity-astro` PRs 388, 398, 445, 451 and 452 and the `astro` changelog entries that mention
  live collections. Source: sections A, D and E.
