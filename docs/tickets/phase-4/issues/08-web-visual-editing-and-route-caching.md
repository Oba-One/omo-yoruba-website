# 08: Visual Editing and route caching

Labels: infra
Status: resolved
Blocked by: 07

**What to build:** stega on the loader with the logic keys filtered, the `VisualEditing` overlay
mounted when the perspective cookie is set, `data-sanity` attributes on the images and the option
containers so click-to-edit reaches every field, the Presentation locations for the homepage types
checked. `Astro.cache` on every public page with the Vercel provider, one day and seven days, one
tag per document type the page reads; preview, Studio, API and action routes, non-GET requests and
a form error re-render uncached; `/api/revalidate` purging the tags through the provider.

- [x] A draft-mode request answers without CDN cache headers; a public request answers with them and the type tags
- [x] `/api/revalidate` answers the tags it purged, and a publish shows on the page within a minute (or the handoff says exactly what blocks it)
- [x] The overlay mounts only in draft mode and the public bundle does not carry it

## Comments

12 September 2026. `cacheVercel()` in the config, `cachePage` in `src/lib/cache.ts` (the day
and the week, `tagsForRoute`), the middleware's guard after the render (draft mode, the preview
host, non-GET) with the pure rule in `src/lib/cache-policy.ts`, `PUBLIC_PREVIEW_ORIGIN` through
the Studio config's `previewUrl.origin` and `allowOrigins`, the stega filter on the client, the
perspective cookie validated, `VisualEditing` mounted last in the body, the `data-sanity` encoder
in `src/lib/sanity/data-attribute.ts` (pinned to the csm format by its test) on the hero photo,
the program and door photographs, the tiles and every option's container, and `/api/revalidate`
purging through `context.cache.invalidate` with `purgePlan`. The cache is a no-op locally and the
adapter has no preview server, so the headers and the purge are proved on the deployment
(ticket 09).
