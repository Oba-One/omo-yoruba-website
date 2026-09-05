# Astro 7: CSP, route caching, astro:env

Date: 4 September 2026. Sources: the Astro configuration reference
(https://docs.astro.build/en/reference/configuration-reference/), the API reference
(https://docs.astro.build/en/reference/api-reference/), the caching guide
(https://docs.astro.build/en/guides/caching/), the environment variables guide
(https://docs.astro.build/en/guides/environment-variables/) and the v7 upgrade guide
(https://docs.astro.build/en/guides/upgrade-to/v7/).

## Content Security Policy (`security.csp`)

- Stable, `boolean | object`, default `false`. Options: `algorithm` (`SHA-256` default,
  `SHA-384`, `SHA-512`), `directives: string[]`, `styleDirective: { resources, hashes }`,
  `scriptDirective: { resources, hashes, strictDynamic }`.
- Delivered as `<meta http-equiv="content-security-policy">` in each page's head, never
  as an HTTP header. There is no report-only option, and browsers do not support a
  report-only meta tag.
- Documented limitations: not supported with `<ClientRouter />` view transitions, not
  active in `dev` (test with `build` and `preview`), Shiki unsupported, external scripts
  and styles need explicit hashes or resources.
- Runtime API (`Astro.csp`, added in 6.0): `insertDirective`, `insertStyleResource`,
  `insertStyleHash`, `insertScriptResource`, `insertScriptHash`; the `kind` scoping
  parameter arrived in 7.1.

What the repo does about it is recorded in `docs/adr/0011` (report-only header from
middleware) and decided for enforcement in wayfinder ticket 13.

## Route caching

- `cache.provider` in config; `Astro.cache` and `context.cache` at runtime (added 7.0).
  `cache.set({ maxAge, swr, tags, etag, lastModified })`, `cache.set(false)` to opt out,
  `cache.invalidate({ tags })` or `{ path }` (exact path only), `cache.enabled`,
  `cache.options`, `cache.tags`.
- `routeRules` maps route patterns to defaults (`maxAge`, `swr`, `tags`); more specific
  patterns win. Multiple `cache.set` calls merge: scalars last-write-wins, tags accumulate.
- Disabled in dev; test with build and preview.
- Vercel provider: `import { cacheVercel } from '@astrojs/vercel/cache'` on
  `@astrojs/vercel` 11.0.0 or later; it sets `Vercel-CDN-Cache-Control` and
  `Vercel-Cache-Tag` headers. Phase 4 wires it with the `/api/revalidate` purge.

## astro:env

- `env.schema` in config with `envField.string | number | boolean | enum`, each taking
  `context: 'client' | 'server'`, `access: 'public' | 'secret'`, `optional`, `default`.
  `context: 'client'` with `access: 'secret'` is not allowed.
- Import from `astro:env/client` or `astro:env/server`; `getSecret('NAME')` reads a
  secret at runtime as `string | undefined`.
- `env.validateSecrets: true` checks secrets at build time; left `false` in Phase 0
  because no secrets exist yet.

## Other v7 facts that shape the code

- The Rust compiler is the default and rejects unclosed tags and invalid HTML nesting.
- Sätteri replaces remark and rehype; the repo adds no remark plugins.
- `compressHTML` defaults to `'jsx'` whitespace handling.
- `src/fetch.ts` is a reserved file name.
- `@astrojs/db` is removed; `astro:transitions` internals are gone.
- `logger` config, queued rendering, advanced routing and route caching are stable and
  no longer under `experimental`.
