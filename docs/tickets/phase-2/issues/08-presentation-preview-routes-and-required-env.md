# 08: Presentation config, the preview routes, the revalidate stub and required env

Labels: infra
Status: open
Blocked by: 05, 06

**What to build:** the Presentation tool configured with a location resolver for every singleton
and document type and `mainDocuments` for every route in ROUTES section 1; `/api/preview/enable`
validating the preview URL secret and setting the perspective cookie, `/api/preview/disable`
clearing it; `/api/revalidate` verifying the Sanity webhook signature and logging the cache tags
the document type maps to (the purge itself waits for Phase 4); `PUBLIC_SANITY_PROJECT_ID` and
`PUBLIC_SANITY_DATASET` required in the astro:env schema, with CI supplied placeholder values.

- [ ] Tests cover the cookie logic, the signature check and the cache tag map
- [ ] A missing `PUBLIC_SANITY_PROJECT_ID` fails the build with a message naming the wizard
- [ ] Every route has a `mainDocuments` entry and every type resolves to at least one location
