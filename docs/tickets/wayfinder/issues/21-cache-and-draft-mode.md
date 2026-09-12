# Cache and draft mode interplay

Type: grilling
Status: resolved
Owner: no
Labels: infra
Phase: 4
Blocked by: 20

## Question

Cached HTML must never serve draft content. Decide how the draft cookie bypasses `Astro.cache` (opt out per request when the cookie is present, or a separate uncached preview host) and how `/api/revalidate` maps document types to tags.

## Answer

Resolved 12 September 2026 (ADR 0021, `docs/research/phase-4-astro-cache-and-vercel-provider.md`).
The draft cookie opts a request out of the cache per request: the middleware calls
`cache.set(false)` after the render whenever the perspective cookie names drafts or a release, on
anything but a GET, and on every request to the preview host, so a draft response is never
stored. Vercel's CDN key ignores cookies, so on the public host an editor could be served the
public copy; the Presentation tool previews on `PUBLIC_PREVIEW_ORIGIN`, a second hostname of the
same deployment with its own key space and no cache, once the owner attaches one. Tags: every
public page carries `type:<t>` for each type that reaches its route (`tagsForRoute`), and
`/api/revalidate` purges the published document's type tag as a tag and its routes as paths
(`purgePlan`), which the provider maps to the path tag it attached.
