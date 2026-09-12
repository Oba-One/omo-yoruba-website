# Phase 4: Astro.cache on 7.3.1, the Vercel cache provider and invalidateByTag

Date: 12 September 2026. Method: the installed sources under `packages/web/node_modules/astro/dist/core/cache/*`,
`dist/types/public/{context,config}.d.ts`, `packages/web/node_modules/@astrojs/vercel/dist/cache/*` and the
`@vercel/functions` 3.9.5 copy Bun resolved for the adapter (`node_modules/.bun/@vercel+functions@3.9.5/...`),
read with line numbers; `npm view @vercel/functions version peerDependencies dependencies engines time` from a
scratch directory; the Astro docs (caching guide, API reference, configuration reference, cache provider
reference) and the withastro/docs and withastro/astro changelogs on GitHub; the Vercel docs (CDN cache,
Cache-Control headers, purge, cache status, response headers, the `@vercel/functions` reference, the REST
`invalidate-by-tags` endpoint, how the CDN works, Routing Middleware, Draft Mode, Deployment Protection and
Protection Bypass for Automation) and three Vercel changelog posts; and a throwaway Astro 7.3.1 site in the
scratchpad (`cache-probe/`, `output: 'server'`, `cacheVercel()`, Bun 1.4 isolated linker) built with
`astro build` and executed with Node 24.20.0 by importing `.vercel/output/functions/_render.func/entry.mjs`
and calling `fetch` (`run.mjs`, `run2.mjs`, `run3.mjs`). Nothing in the repo was changed for the probe. Paths
below are relative to `packages/web/node_modules/` unless they start with `packages/` or `docs/`.

Versions: `astro` 7.3.1 installed, 7.3.2 latest; `@astrojs/vercel` 11.0.10 installed and latest, dependency
`@vercel/functions ^3.7.5`, peer `astro ^7.0.0`; `@vercel/functions` 3.9.5 resolved in `bun.lock`, 3.9.7 latest
(published 2026-09-09; 3.9.6 on 2026-09-08, 3.9.5 on 2026-08-20), `engines.node >= 20`, dependency
`@vercel/oidc` (3.8.5 in 3.9.5, 3.8.7 in 3.9.7), optional peers `ws >=8` and
`@aws-sdk/credential-provider-web-identity *`. Route caching left `experimental` in Astro 7.0.0 ("Stabilizes
route caching, removing the `experimental.cache` and `experimental.routeRules` flags"); the Vercel provider
arrived in `@astrojs/vercel` 11.0.0 and no later entry touches it. Source: `astro/package.json`,
`@astrojs/vercel/package.json` (dependencies, peerDependencies), the scratch `npm view`,
https://raw.githubusercontent.com/withastro/astro/main/packages/astro/CHANGELOG.md,
https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/CHANGELOG.md.

## 1. The Astro.cache runtime API

- Surface. `APIContext.cache: CacheLike` ("In dev mode, the cache object is available but performs no
  caching"); `AstroGlobal` extends `APIContext`, so `Astro.cache` in pages and layouts and `context.cache` in
  middleware, endpoints and action handlers are one object per request. Source: `astro/dist/types/public/context.d.ts`
  lines 14 and 210 to 217; the docs' `cache` entry is marked "Added in: astro@7.0.0"
  (https://docs.astro.build/en/reference/api-reference/).
- `CacheLike` (Source: `astro/dist/core/cache/runtime/cache.d.ts` lines 2 to 21):

  ```ts
  readonly enabled: boolean;                                   // false without a provider or in dev
  set(input: CacheOptions | CacheHint | LiveDataEntry | false): void;
  readonly tags: string[];
  readonly options: Readonly<CacheOptions>;
  invalidate(input: InvalidateOptions | LiveDataEntry): Promise<void>;
  ```

  `CacheOptions = { maxAge?: number; swr?: number; tags?: string[]; lastModified?: Date; etag?: string }`,
  `CacheHint = { tags?; lastModified? }`, `LiveDataEntry = { id; data; cacheHint? }` (live content loader
  entries pass straight in), `InvalidateOptions = { path?: string; tags?: string | string[] }`. The docs type
  `cache.set()` as `(options: CacheOptions | false) => void`; the two extra input shapes are in the source only.
  Source: `astro/dist/core/cache/types.d.ts` lines 4 to 23, https://docs.astro.build/en/reference/api-reference/.
- Option meanings: `maxAge` seconds fresh, `swr` "Stale-while-revalidate window in seconds", `tags` "A list of
  cache tags for targeted invalidation", `etag` and `lastModified` become `ETag` and `Last-Modified` response
  headers. In `routeRules` the schema requires integers `>= 0` for `maxAge` and `swr`; `cache.set` itself does
  not validate. Source: https://docs.astro.build/en/reference/cache-provider-reference/,
  `astro/dist/core/cache/provider-utils.js` lines 18 to 25, `astro/dist/core/cache/config.js` lines 7 to 11.
- Repeated `set` calls merge. `maxAge`, `swr` and `etag` are overwritten by the last call that carries them
  (a call that omits a key leaves it alone); `lastModified` keeps the most recent date; `tags` go into a `Set`,
  so they accumulate and dedupe. The docs: "Scalar values (`maxAge`, `swr`, `etag`): last-write-wins",
  "`lastModified`: most recent date wins", "`tags`: accumulate across all calls". Probe: two calls on `/`
  produced `Vercel-Cache-Tag: type:event,route:/,type:siteSettings,astro-path:/`.
  Source: `astro/dist/core/cache/runtime/cache.js` lines 30 to 42, https://docs.astro.build/en/guides/caching/, scratch `run.mjs`.
- `set(false)` sets a disabled flag, clears the tag set and empties the options. Any later `set(options)`
  clears the flag again (`this.#disabled = false` runs before the merge), so `set(false)` is not sticky: the
  last call wins. Probe: `set({maxAge: 60})` then `set(false)` gave no cache headers and `options.tags` of `[]`;
  `set(false)` then `set({maxAge: 5, tags: ['again']})` gave `public, max-age=5` and `again,astro-path:/reenable`.
  The docs describe `false` as the way "to explicitly opt a request out of caching. This is useful when a
  matched route rule would otherwise cache the response". Source: `cache.js` lines 15 to 22, scratch `run.mjs`,
  https://docs.astro.build/en/guides/caching/.
- `cache.tags` returns a copy of the set; `cache.options` returns `{ ...options, tags }` as a snapshot
  ("including all merged `maxAge`, `swr`, `etag`, `lastModified`, and `tags` values"). `cache.enabled` is a
  class constant: `true` on `AstroCache`, `false` on the no-op and disabled classes. Source: `cache.js` lines
  11 and 44 to 56, `astro/dist/core/cache/runtime/noop.js` lines 5 and 19, https://docs.astro.build/en/reference/api-reference/.
- `invalidate({ tags })`, `invalidate({ path })` or both in one call, returning `Promise<void>`; a
  `LiveDataEntry` is reduced to its `cacheHint.tags`. Without a provider it throws `CacheNotEnabled`
  ("`Astro.cache` is not available because the cache feature is not enabled. To use caching, configure a cache
  provider in your Astro config under `cache`."). The docs: "Tag-based invalidation removes all cached entries
  whose tags include any of the provided tags", "Path-based invalidation is exact-match only (no glob or
  wildcard patterns)". Source: `cache.js` lines 57 to 68, `astro/dist/core/errors/errors-data.js` lines 799 to
  804, https://docs.astro.build/en/guides/caching/.
- Where headers are applied. `core/routing/handler.js` calls `provideCache(state)` (line 61) and, when the
  manifest has a provider, wraps middleware plus page rendering in `handleCache(state, runPipeline)` (line 92).
  `handleCache` runs the pipeline, then `applyCacheHeaders(cache, response, request)` (line 79): the `AstroCache`
  method returns early when disabled or when neither `maxAge` nor a tag is set, otherwise it asks the provider's
  `setHeaders(finalOptions, request)` (falling back to `defaultSetHeaders`, which writes `CDN-Cache-Control` and
  `Cache-Tag`) and copies every header onto the response; if only `ETag` or `Last-Modified` ended up on a response
  with no `Cache-Control` or `Expires`, it adds `Cache-Control: no-cache`. Only providers with `onRequest`
  (the memory provider) get the `CDN-Cache-Control` and `Cache-Tag` headers stripped afterwards. Errors thrown
  while rendering are turned into a 500 outside `handleCache`, so a 500 never carries cache headers.
  Source: `astro/dist/core/routing/handler.js` lines 61, 78 to 92 and 101 to 108, `astro/dist/core/cache/handler.js`
  lines 43 to 81, `cache.js` lines 70 to 81, `astro/dist/core/cache/runtime/utils.js` lines 1 to 23.
- Not GET only, not status aware, not cookie aware. Neither `handleCache` nor `applyCacheHeaders` looks at the
  method, the status, the request `Cookie` header or a response `Set-Cookie`. Probe: `HEAD /` and a JSON
  `POST /` got the same two Vercel headers as `GET /`; a page that called `Astro.cookies.set()` and `cache.set()`
  answered with both `Set-Cookie: probe=1; Path=/` and the cache headers (the adapter appends cookies in its
  entrypoint after Astro applied the headers); a 404 under a matching route rule carried
  `public, max-age=60, stale-while-revalidate=30` and `rule,astro-path:/rules/anything`. The request method and
  cookie checks belong to the CDN (section 3). The memory provider is the exception and does check: it caches
  `GET` only, refuses responses with `Set-Cookie`, `Vary: Cookie` or `Vary: *`, ignores `set-cookie` in `Vary`,
  and drops tracking query parameters from its key; none of that runs with the Vercel provider.
  Source: scratch `run.mjs` and `run2.mjs`, `@astrojs/vercel/dist/serverless/entrypoint.js` lines 53 to 60,
  `astro/dist/core/cache/memory-provider.js` lines 23 to 49, 92 to 108, 229 to 231, 249 to 258 and 289 to 298.
- Dev, build and preview. `provideCache` installs `DisabledAstroCache` when the config has no `cache` block
  (`set`, `tags` and `options` warn once: "`cache.set()` was called but caching is not enabled", `invalidate`
  throws `CacheNotEnabled`); `NoopAstroCache` when `runtimeMode` is `development` (`enabled` false, `set` does
  nothing, `invalidate` resolves without doing anything); and the real provider otherwise, which is also what the
  built function runs (the default environment is `production`; the probe printed `enabled` as `true`). The docs:
  "In dev mode, the cache API is available so that route code does not need conditional checks, but no actual
  caching occurs", "To test your caching locally, build then preview your site". That last sentence does not
  apply here: `@astrojs/vercel` 11.0.10 declares no `previewEntrypoint`, so `astro preview` throws
  "[preview] The @astrojs/vercel adapter does not support the preview command." Test by importing the built
  entrypoint as the probe does, or on a Vercel preview deployment. Today `packages/web/astro.config.ts` has no
  `cache` block, so the `context.cache.set(false)` calls in `packages/web/src/actions/index.ts` (lines 17 and 36)
  hit the warning path in production until Phase 4 adds the provider.
  Source: `astro/dist/core/cache/handler.js` lines 12 to 42, `noop.js` lines 4 to 45, `astro/dist/core/environment/index.js`
  lines 6 to 8, `astro/dist/core/preview/index.js` lines 48 to 52, `grep previewEntrypoint @astrojs/vercel/dist` (no match),
  https://docs.astro.build/en/guides/caching/, scratch `run.mjs`.
- `routeRules`. `Record<string, { maxAge?; swr?; tags? }>` keyed by route pattern in file routing syntax
  ("Uses the same `[param]` and `[...rest]` syntax"; "glob wildcards (`*`) are not supported"). Patterns are
  compiled with Astro's `getPattern` (so `base` and `trailingSlash` apply) and sorted by route priority; the
  first match by pathname seeds `cache.set(matched)` the first time the request touches `cache`, and page calls
  merge on top ("Per-route `cache.set()` calls merge with config-level route rules"). Rules are only carried
  into the manifest when a provider is configured. Because the seed keys on the pathname, not on the matched
  route, a rule also seeds 404 renders under its pattern (probe above).
  Source: `astro/dist/core/cache/config.d.ts` lines 13 to 30, `astro/dist/types/public/config.d.ts` lines 3119 to 3196,
  `astro/dist/core/cache/runtime/route-matching.js` lines 5 to 24, `handler.js` lines 28 to 42,
  `astro/dist/core/cache/utils.js` lines 30 to 41, https://docs.astro.build/en/guides/caching/.
- Config shape: `cache: { provider: { name?, entrypoint: string | URL, config? } }`; `cacheVercel()` returns
  `{ name: 'vercel', entrypoint: '@astrojs/vercel/cache/provider' }`, the Vite plugin resolves that from the
  project root (`CacheProviderNotFound` otherwise) and the built manifest loads it lazily. Source:
  `astro/dist/core/cache/types.d.ts` lines 36 to 48, `@astrojs/vercel/dist/cache/index.js` lines 1 to 6,
  `astro/dist/core/cache/vite-plugin.js` lines 29 to 49, `astro/dist/core/cache/provider.js` lines 2 to 9.

## 2. The cacheVercel provider

- Headers. `setHeaders` builds `["public", "max-age=<maxAge>", "stale-while-revalidate=<swr>"]` (each only when
  set, joined with ", ") into `Vercel-CDN-Cache-Control`, then `Vercel-Cache-Tag` as the request tags plus
  `pathTag(pathname)` joined with `,` (no space), then `Last-Modified` and `ETag` when given. For the brief's
  numbers the probe emitted exactly `Vercel-CDN-Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
  No `Cache-Control` for browsers is written. Tags alone (no `maxAge`) still produce `Vercel-Cache-Tag` and a
  bare `Vercel-CDN-Cache-Control: public` (the `public` extra directive is always pushed first), which enables
  no caching since the CDN needs `s-maxage` or `max-age`. Source: `@astrojs/vercel/dist/cache/provider.js` lines 10 to 22,
  `astro/dist/core/cache/provider-utils.js` lines 5 to 25, scratch `run.mjs`.
- Path tag. `pathTag(path)` is `` `astro-path:${path}` `` with `PATH_TAG_PREFIX = "astro-path:"`, and the
  header side uses `new URL(request.url).pathname`: the query string is dropped (`/reenable?x=1&y=2` tagged
  `astro-path:/reenable`) but a trailing slash is kept (`/reenable/` tagged `astro-path:/reenable/`). With
  Astro's default `trailingSlash: 'ignore'` both spellings render, so they are two CDN entries with two path
  tags. The docs: "Each provider automatically tags cached responses with the request path, so
  `cache.invalidate({ path })` works on platforms that only support tag-based purges."
  Source: `provider-utils.js` lines 1 to 4, `provider.js` lines 17 to 18, scratch `run2.mjs`,
  `astro/dist/core/routing/trailing-slash-handler.js` lines 43 to 51, https://docs.astro.build/en/guides/caching/.
- `collectInvalidationTags`. `normalizeTags(options.tags)` (string or array to array, `undefined` to `[]`),
  then `pathTag(options.path)` appended when `path` is set: `{ tags: ['type:event'] }` gives `['type:event']`,
  `{ path: '/odunde' }` gives `['astro-path:/odunde']`, both together give
  `['type:event', 'astro-path:/odunde']`. Source: `provider-utils.js` lines 26 to 36.
- `invalidate`. `const { invalidateByTag } = await import("@vercel/functions")`, then
  `Promise.all(tags.map((tag) => invalidateByTag(tag)))`: one call per tag, no batching, and a rejected call
  rejects the whole `cache.invalidate`. The docs: "Tag invalidation is a soft invalidation: cached responses
  are marked as stale and revalidated in the background using stale-while-revalidate."
  Source: `provider.js` lines 23 to 27, https://docs.astro.build/en/guides/caching/.
- Dependency. `@vercel/functions ^3.7.5` is a dependency of `@astrojs/vercel` 11.0.10, so the site does not add
  it. Under Bun's isolated linker it is not reachable from `packages/web` (`import.meta.resolve` fails there
  and succeeds from the adapter's directory), but that does not matter: the build inlines the provider and
  rewrites the dynamic import to a chunk. The scratch build's `_virtual_astro_cache-provider_*.mjs` reads
  `await import("./functions_B93Pt9X8.mjs")` and that chunk opens with
  `node_modules/.bun/@vercel+functions@3.9.7/node_modules/@vercel/functions/headers.js`; the optional `ws` peer
  becomes a throwing stub chunk that only the WebSocket helper would load. A copy of `_render.func` run from an
  unrelated directory answered `POST /api/revalidate` with 200 "invalidated". Adding `@vercel/functions` to the
  site only made `@vercel/nft` copy a second copy under `_render.func/node_modules/.bun/` and move the handler to
  `dist/server/entry.mjs`. Add it only if the site imports the package itself (for `dangerouslyDeleteByTag`);
  then pin 3.9.5 to match `bun.lock`.
  Source: `@astrojs/vercel/package.json` (dependencies), scratch `func-copy/chunks/_virtual_astro_cache-provider_*.mjs`
  and `functions_*.mjs`, `run3.mjs`, `node --input-type=module -e "import.meta.resolve('@vercel/functions')"` from
  `packages/web` (ERR_MODULE_NOT_FOUND) and from the adapter directory.
- Runtime. The adapter emits one Node function for the whole app (`launcherType: "Nodejs"`, `handler:
  "entry.mjs"`) and picks `nodejs<major>.x` from the local Node version, so with the repo's Node 22 the function
  runs on `nodejs22.x` (the scratch, built with Node 24, got `nodejs24.x`). Source: `@astrojs/vercel/dist/index.js`
  lines 531 to 560, scratch `.vercel/output/functions/_render.func/.vc-config.json`.

## 3. Vercel CDN semantics that matter for draft mode

- Cache key: "The request method (such as `GET`, `POST`, etc)", "The request URL (query strings are ignored for
  static files)", "The host domain", "The unique deployment URL", "The scheme". "Since each deployment has a
  different cache key, you can promote a new deployment to production without affecting the cache of the
  previous deployment." "Cache keys are not configurable. To purge the cache you must configure cache tags."
  `Accept` and `Accept-Encoding` are in the key by default; other request headers join it only through `Vary`:
  the CDN "combines the cache key ... with the values of any request headers specified in the `Vary` header".
  The cache is regional and best-effort ("If your asset is rarely requested (e.g. once a day), it may be evicted").
  Source: https://vercel.com/docs/caching/cdn-cache/purge (Cache keys), https://vercel.com/docs/caching/cdn-cache
  (Vary header, Limits).
- Cacheable response criteria, quoted in full: "Request uses `GET` or `HEAD` method.", "Request doesn't contain
  `Range` header.", "Request doesn't contain `Authorization` header.", "Response uses `200`, `404`, `410`, `301`,
  `302`, `307` or `308` status code.", "Response doesn't exceed `10MB` in content length.", "Response doesn't
  contain the `set-cookie` header.", "Response doesn't contain the `private`, `no-cache` or `no-store` directives
  in the `Cache-Control` header.", "Response doesn't contain `Vary: *` header". So: a `POST` response is never
  stored; a 404 is; a 500 or a 303 is not; a `Set-Cookie` response is not; and a request that carries a
  `Cookie` header is not in the list, so it is served the cached copy like any other request. Draft Mode
  `BYPASS` in Vercel's cache status list is the ISR mechanism only: "Draft Mode is triggered when the request's
  `__prerender_bypass` cookie matches the route's `bypassToken`", and Draft Mode requires ISR ("Using ISR is
  required on pages that you want to view in Draft Mode"), which the Astro CDN provider does not use.
  Source: https://vercel.com/docs/caching/cdn-cache (Cacheable response criteria),
  https://vercel.com/docs/caching/cache-status (BYPASS), https://vercel.com/docs/draft-mode.
- `Vary: Cookie`. No fetched Vercel page names `Cookie` as excluded from `Vary`, so the general sentence applies
  and it would key on the whole `Cookie` value; whether the CDN honours it in practice is unverified. It would
  also be self-defeating: every distinct cookie string (analytics cookies included) becomes its own entry, and
  "each additional header exponentially increases the number of cache entries". The 2025 changelog only names
  `X-Vercel-IP-Country` and `Accept-Language` as examples.
  Source: https://vercel.com/docs/caching/cdn-cache (Vary header, Best practices),
  https://vercel.com/changelog/serve-personalized-content-faster-with-vary-support.
- Header handling. `Vercel-CDN-Cache-Control` "has top priority" and "Vercel's proxy consumes this header for all
  requests. After processing it, the CDN does not include it in the final HTTP response to the client."
  `s-maxage` and `max-age` in that header both cap at "31536000 seconds (1 year)"; `stale-while-revalidate` too.
  With no `Cache-Control` from the function, the client receives Vercel's default
  `cache-control: public, max-age=0, must-revalidate`. Whether `Vercel-Cache-Tag` reaches the client is not
  stated. `Pragma: no-cache` on a request "will revalidate any stale resource synchronously" and sets
  `x-vercel-cache` to `REVALIDATED`. Source: https://vercel.com/docs/caching/cache-control-headers,
  https://vercel.com/docs/headers/response-headers.
- `x-vercel-cache`: `HIT`, `MISS`, `STALE` ("a cached response was served while Vercel refreshed it in the
  background"), `PRERENDER`, `REVALIDATED`, `BYPASS`. After a tag invalidation the next request is `STALE` with
  reason "Tag-based invalidation"; a tag deletion gives `REVALIDATED`. "Vercel scopes cached responses to the
  deployment that produced them." Source: https://vercel.com/docs/headers/response-headers,
  https://vercel.com/docs/caching/cache-status.
- Preview deployments. "CDN caching is available for all deployments and domains on your account"; the key
  includes host and deployment URL, and "Cache tags are scoped to your project and environment (production or
  preview)". Deployment Protection "requires authentication for all requests, including those to Routing
  Middleware"; Standard Protection "protects all domains except production domains" and Vercel Authentication
  sets a cookie scoped to one deployment URL after login. No fetched page says whether a protected deployment's
  responses are cached after that cookie is set: unverified, check `x-vercel-cache` on a preview URL. Protection
  Bypass for Automation takes `x-vercel-protection-bypass` as a header or query parameter and
  `x-vercel-set-bypass-cookie: true` or `samesitenone` (for iframes); `@sanity/preview-url-secret` 4.1.5 carries
  both names as constants, so the Presentation tool can open a protected preview deployment.
  Source: https://vercel.com/docs/caching/cdn-cache, https://vercel.com/docs/caching/cdn-cache/purge (Cache tag scope),
  https://vercel.com/docs/deployment-protection, https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication,
  https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation,
  `node_modules/.bun/@sanity+preview-url-secret@4.1.5*/node_modules/@sanity/preview-url-secret/dist/constants-*.js` line 2.
- Tag limits: "UTF-8 bytes per tag 256", "Tags per cached response 128", "Tags per bulk REST API call 16";
  "Cache tags are case-sensitive"; "Cache tags must not contain commas" (the comma is the delimiter of
  `Vercel-Cache-Tag`); characters needing escaping count at escaped length. The site's largest set today is
  `tagsForRoute('/')` (eight `type:` tags) plus the path tag, and the longest tag is under 45 bytes.
  Source: https://vercel.com/docs/caching/cdn-cache/purge (Cache tags, Limits), `packages/content/src/routes.ts` lines 41 to 67 and 90 to 95.
- Routing Middleware runs "globally before the cache", but "You can't use `proxy` with frameworks that build
  their own routing middleware, such as Next.js and Astro", so it is not a lever here. The adapter's
  `edgeMiddleware` option is a different thing (Astro middleware compiled to an edge function that forwards to
  `_render` or `_isr`) and is out of scope for this note. Source: https://vercel.com/docs/routing-middleware,
  `@astrojs/vercel/dist/serverless/middleware.js` lines 96 to 108.

## 4. invalidateByTag from @vercel/functions

- Signature: `invalidateByTag(tag: string | string[]): Promise<void>`; sibling
  `dangerouslyDeleteByTag(tag, options?: { revalidationDeadlineSeconds?: number })`, `invalidateBySrcImage`,
  `dangerouslyDeleteBySrcImage`; `addCacheTag(tag: string | string[])` is the header's programmatic twin. JSDoc:
  "Invalidate all content associated with a tag or tags by marking them as stale. On the next access to content
  associated with any of the tags, the stale content will be served and a background revalidation will be
  triggered." Added in 3.1.0 ("Introduces Vercel Purge APIs: invalidateByTag, dangerouslyDeleteByTag"),
  `addCacheTag` in 3.3.0 (fixed in 3.3.2), a URL-encoding change to tags reverted in 3.4.3.
  Source: `@vercel/functions/purge/index.d.ts` lines 2 to 5, `purge/types.d.ts` lines 1 to 29, `index.d.ts` lines
  11 to 14, `CHANGELOG.md`, https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package.
- No token. The implementation is `getContext().purge?.invalidateByTag(tag)` where `getContext()` reads
  `globalThis[Symbol.for("@vercel/request-context")]?.get?.() ?? {}`: the Vercel runtime supplies the purge API
  on the request context, and off Vercel the call resolves without doing anything (the probe's local
  "invalidated"). The docs: "When you purge a tag using `@vercel/functions` at runtime, the function's current
  environment is used which is derived from the deployment url that invoked the function." The package is CJS
  (`index.js` for both `import` and `require`), `engines.node >= 20`.
  Source: `@vercel/functions/purge/index.js` lines 27 to 34, `get-context.js` lines 25 to 29, `package.json`,
  https://vercel.com/docs/caching/cdn-cache/purge (Cache tag scope), scratch `run3.mjs`.
- Scope: tags are per project and per environment, not per deployment, and a runtime purge targets the invoking
  function's environment; the REST endpoint can name `target: "production" | "preview"` and "default is all
  environments". "When you purge by cache tag, Vercel purges all three types of cache: CDN cache, Runtime Cache,
  and Data Cache." Source: https://vercel.com/docs/caching/cdn-cache/purge, https://vercel.com/docs/rest-api/edge-cache/invalidate-by-tag.
- Propagation and limits: no fetched page gives a propagation time for a CDN tag purge (the "within 300ms"
  figure is the Runtime Cache `expireTag`), and none states a rate limit; the only numbers are the tag limits
  above and the 16-tag REST batch. Purges are not billed but "can temporarily increase related usage".
  Source: https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package (getCache),
  https://vercel.com/docs/caching/cdn-cache/purge (Manually purging, Limits).
- From an Astro API route: yes. `/api/revalidate` is part of the one Node function the adapter builds, and the
  provider's `invalidate` is the same dynamic import any route could make. `context.cache.invalidate` keeps the
  call provider-neutral and turns `path` into the provider's tag. Source: section 2, `@astrojs/vercel/dist/index.js`
  lines 531 to 560, `astro/dist/core/cache/runtime/cache.js` lines 57 to 68.
- Alternatives: `POST https://api.vercel.com/v1/edge-cache/invalidate-by-tags?projectIdOrName=<id>&teamId=<id>`
  with a bearer token, body `{ "tags": string[] | string, "target"?: "production" | "preview" }` (each array
  tag `maxLength` 256, the string form `maxLength` 8196), answers 200, 400, 401, 403, 404 or 410; the delete twin
  is `/v1/edge-cache/dangerously-delete-by-tags`; the CLI is `vercel cache invalidate --tag a,b` and
  `vercel cache dangerously-delete --tag a --yes`; the dashboard purges by tag or by `*` for the whole project.
  Source: https://vercel.com/docs/rest-api/edge-cache/invalidate-by-tag, https://vercel.com/docs/caching/cdn-cache/debug-cache-issues,
  https://vercel.com/docs/caching/cdn-cache/purge.

## 5. What /api/revalidate must send

- `cacheTagsFor(type, slug)` returns `type:<type>` then `route:<path>` per affected route
  (`packages/content/src/routes.ts` lines 84 to 88); `tagsForRoute(route)` (lines 90 to 95) returns the `type:`
  tags a page should attach. Only tags that a response actually carries can purge it: the provider attaches the
  page's `cache.set` tags plus `astro-path:<pathname>`. So `route:/odunde` purges nothing unless a page also
  attaches that literal tag; the correct move is to turn each `route:` tag into the provider's own path tag by
  calling `invalidate({ path: '/odunde' })`, which `collectInvalidationTags` maps to `astro-path:/odunde`. The
  path must equal the request pathname exactly (no query, same trailing slash), which is why `trailingSlash:
  'never'` belongs in the config (the adapter also writes it into Vercel's routing config, so `/odunde/`
  redirects before the cache). Source: section 2, `@astrojs/vercel/dist/index.js` lines 369 to 374.
- The call from an `APIRoute`:

  ```ts
  export const POST: APIRoute = async ({ request, cache }) => {
    // ... signature check and JSON parse as today ...
    const tags = cacheTagsFor(payload._type, payload.slug ?? undefined);
    const typeTags = tags.filter((t) => t.startsWith('type:'));
    const paths = tags.filter((t) => t.startsWith('route:')).map((t) => t.slice('route:'.length));
    await Promise.all([
      typeTags.length ? cache.invalidate({ tags: typeTags }) : undefined,
      ...paths.map((path) => cache.invalidate({ path })),
    ]);
    return Response.json({ type: payload._type, tags, purged: cache.enabled });
  };
  ```

  Each `invalidate` ends as one `invalidateByTag` per tag (a `siteSettings` publish is fifteen calls); the
  `type:` purge already reaches every page that reads the type, so the path purges are belt and braces for the
  dynamic routes. `purged: cache.enabled` is honest in dev (no-op) and off Vercel (resolves, purges nothing).
  Source: sections 1, 2 and 4, `packages/web/src/pages/api/revalidate.ts` lines 18 to 52.

## Contradictions with the brief (docs/design/ROUTES-AND-INTERACTIONS.md section 1)

- "`s-maxage` 1 day, `stale-while-revalidate` 7 days": the provider never writes `s-maxage` or a browser
  `Cache-Control`. It writes `Vercel-CDN-Cache-Control: public, max-age=86400, stale-while-revalidate=604800`,
  which Vercel consumes and never forwards, and the browser gets Vercel's default `public, max-age=0,
  must-revalidate`. Same intent, different header; read the brief's `s-maxage` as the CDN TTL.
- "purged by the Sanity webhook": `cache.invalidate` is a soft purge. After a publish the first visitor of a
  tagged page still gets the old copy (`x-vercel-cache: STALE`) while the CDN re-renders in the background; the
  second gets the new one. A hard purge needs `dangerouslyDeleteByTag`, which `Astro.cache` does not expose.
- "Preview, Studio, API and action routes are never cached": true only because nothing tags them. Astro applies
  the headers to any method and status that reaches the pipeline, and the CDN stores GET and HEAD responses with
  200, 404, 410, 301, 302, 307 and 308. A route rule such as `/[...all]` would tag `/admin`, the 404 page and the
  preview redirects. Tag pages one by one and write no catch-all rule.
- "All public routes are server-rendered and cached (`Astro.cache` ...)": `astro.config.ts` has no `cache`
  block yet, so today `Astro.cache.set` only warns and `invalidate` throws.
- Draft mode on the same host and cookie: the CDN key has no cookie in it and the Astro provider never checks
  one, so once a page is cached an editor with the `sanity-preview-perspective` cookie is served the published
  copy without the function running. `cache.set(false)` when the cookie is present is still required (it stops
  a draft render from ever being stored) but does not solve the HIT. See the recommendation.

## Recommendation for Phase 4

1. `packages/web/astro.config.ts`: `import { cacheVercel } from '@astrojs/vercel/cache'`, add
   `cache: { provider: cacheVercel() }` and `trailingSlash: 'never'`. No `routeRules`. No new dependency.
2. One helper in `packages/web/src/lib/cache.ts`, called from `SiteLayout.astro`:
   `Astro.cache.set({ maxAge: 86400, swr: 604800, tags: tagsForRoute(Astro.routePattern) })`, skipped when
   `loadQuery` reported `preview`. `Astro.routePattern` is the file-routing pattern of the current page
   (`/gallery/[album]` for an album page), the same strings `PUBLIC_ROUTES` holds, so no route prop is needed
   (`astro/dist/types/public/context.d.ts` line 583, https://docs.astro.build/en/reference/routing-reference/#routepattern). Because a later `set(options)` re-enables caching, put the guarantee last: in
   `packages/web/src/middleware.ts`, after `const response = await next()`, call `context.cache.set(false)` when
   `context.cookies.has(PERSPECTIVE_COOKIE)`. Headers are applied after the middleware returns, so that call wins.
3. `/api/revalidate` as in section 5; keep the signature check; log `{ type, slug, tags, purged }`.
4. Runbook: on the production host, `curl -sI https://omoyorubasocal.org/odunde | grep -i -E 'x-vercel-cache|^cache-control'`
   twice (second is `HIT`); after a publish expect `STALE` once, then `HIT`; `curl -sI -H 'Pragma: no-cache' ...`
   forces a synchronous `REVALIDATED` when a check must not wait. The Vercel headers are not visible from the
   client; read the function response in the probe style or the deployment's runtime logs (Cache section).
5. Draft mode, the open question for the owner. The CDN key includes the host, so the smallest change that
   keeps one deployment is a second hostname for editors (for example `preview.omoyorubasocal.org` aliased to
   production): the middleware calls `cache.set(false)` for that host and adds `X-Robots-Tag: noindex`, the
   Presentation tool gets `previewUrl.origin` set to it (the option exists in `PreviewUrlResolverOptions`,
   docs/research/phase-2-sanity-studio-v6-and-astro.md lines 295 to 300; today `presentationOptions.previewUrl`
   only sets `previewMode`, `packages/content/src/studio/presentation.ts` lines 49 to 54) and `allowOrigins`
   lists it. The fallback without a new hostname is to opt the whole `preview` environment out of caching
   (`process.env.VERCEL_ENV === 'preview'` in the middleware) and have editors preview on a branch deployment,
   which costs them the protected-deployment login and a Studio opened from that deployment. `Vary: Cookie` is
   not recommended (section 3), and Vercel's own Draft Mode needs the adapter's ISR mode, a different caching
   model than the brief's. Decide before wiring step 2's `preview` branch.
6. Verify on the first Phase 4 preview deployment: `x-vercel-cache` on a cached page, the `Vercel-Cache-Tag`
   contents in the runtime log, a publish reaching `STALE` then `HIT`, and whether a protected preview deployment
   serves `HIT` at all (unverified above). Record the answers in the runbook.
