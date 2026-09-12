# Public pages are cached by type tag, and draft mode opts out per request with a preview host for editors

Decided 12 September 2026 (Phase 4 grill, `docs/tickets/phase-4/spec.md`; the owner was not in the
session). Every public page sets `Astro.cache` with one day fresh, seven days stale-while-revalidate
(ROUTES section 1) and one `type:<type>` tag per document type that reaches its route, derived
from the same route map the Presentation locations use (`tagsForRoute` in `@oy/content/routes`),
and the Vercel provider adds its own path tag. `/api/revalidate` purges a published document's type
tag as a tag and each of its routes as a path (`purgePlan`), so a publish reaches every page that
reads the type without the site keeping a list of pages per document. Draft mode opts out per
request: the middleware switches the cache off after the render whenever the perspective cookie is
present, on anything but a GET, and on every request to the preview host, so a response with drafts
is never stored. Because Vercel's CDN key ignores cookies, an editor on the public host could still
be served the public copy; the Presentation tool therefore previews on `PUBLIC_PREVIEW_ORIGIN` when
the owner sets it, a second hostname of the same deployment with its own key space and no cache,
and on its own origin until then (right locally, where the cache is a no-op).

## Considered options

- Route tags only (`route:/odunde`) purged per page: rejected, every new page would have to be
  registered against every document type; the type tag is one line in the route map.
- `Vary: Cookie` on cached pages: rejected, the CDN would key on every visitor's cookies (PostHog
  sets them) and the cache would fragment to nothing.
- Vercel's own draft mode bypass: it applies to prerendered routes only, not to functions.
- A separate preview deployment: preview deployments sit behind Vercel Authentication, which the
  Studio's iframe cannot pass.

## Consequences

- A purge is soft: the CDN serves the stale copy once more while it revalidates, so "within a
  minute" is one request after the publish.
- `cache.set(false)` is not sticky; the middleware's opt-out runs last so a page cannot switch the
  cache back on for a draft request.
- The preview host needs `allowOrigins` in the Presentation config, the partitioned cookie the
  enable route already sets, and `frame-ancestors` that admits the Studio's origin when the CSP is
  enforced (Phase 9).
