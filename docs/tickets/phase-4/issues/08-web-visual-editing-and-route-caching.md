# 08: Visual Editing and route caching

Labels: infra
Status: open
Blocked by: 07

**What to build:** stega on the loader with the logic keys filtered, the `VisualEditing` overlay
mounted when the perspective cookie is set, `data-sanity` attributes on the images and the option
containers so click-to-edit reaches every field, the Presentation locations for the homepage types
checked. `Astro.cache` on every public page with the Vercel provider, one day and seven days, one
tag per document type the page reads; preview, Studio, API and action routes, non-GET requests and
a form error re-render uncached; `/api/revalidate` purging the tags through the provider.

- [ ] A draft-mode request answers without CDN cache headers; a public request answers with them and the type tags
- [ ] `/api/revalidate` answers the tags it purged, and a publish shows on the page within a minute (or the handoff says exactly what blocks it)
- [ ] The overlay mounts only in draft mode and the public bundle does not carry it
