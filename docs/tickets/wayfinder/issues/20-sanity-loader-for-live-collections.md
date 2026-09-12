# Sanity loader for live content collections

Type: research
Status: resolved
Owner: no
Labels: infra
Phase: 2, 4
Blocked by: 14

## Question

Which loader serves news, events, albums and people per request under Astro 7 live collections with stega and drafts: `@sanity/astro`'s `loadQuery`, an official Sanity live loader, or a small one in `@oy/content`? Verify against Sanity's Astro rule set through the MCP server.

## Answer

Resolved 12 September 2026 (`docs/research/phase-4-live-collections-loader.md`). Live content
collections are stable in Astro 7.3.1 but a live loader never sees the request or its cookies, so
draft mode could not reach it, and `@sanity/astro` 3.5.1 exports no loader or `loadQuery` (the
pull requests that would add one are open and unmerged, none with per-request perspective). The
site keeps the hand-written `loadQuery` in `packages/web/src/lib/sanity/load-query.ts` with one
`defineQuery` per page in `packages/content/src/queries/` (TypeGen types the result through
`SanityQueries`), the Viewer token, the perspective cookie, stega with the logic-key filter, and
the page's own `Astro.cache` tags. The homepage reads its singleton and every list in one composed
query; later lists (news, albums, people) use the same helper. Revisit when a `@sanity/astro`
release ships a loader with per-request perspective and TypeGen-based types.
