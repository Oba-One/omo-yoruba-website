# Astro server output on Vercel with route caching, not a static build

Visual Editing and draft previews need server rendering, so `apps/web` uses
`output: 'server'` with `@astrojs/vercel`. Every public route sets `Astro.cache` (long
`s-maxage`, stale-while-revalidate) through the Vercel cache provider and a Sanity webhook
purges by tag on publish, which keeps the cost and speed of a static site. Studio, preview,
API and action routes are never cached.

## Consequences

- Caching is invisible in `astro dev`; prove it on a Vercel preview (Phase 4).
- Draft mode must bypass the cache; that interplay is wayfinder ticket 21.
