# Cache and draft mode interplay

Type: grilling
Status: open
Owner: no
Labels: infra
Phase: 4
Blocked by: 20

## Question

Cached HTML must never serve draft content. Decide how the draft cookie bypasses `Astro.cache` (opt out per request when the cookie is present, or a separate uncached preview host) and how `/api/revalidate` maps document types to tags.
