# 09: The Studio embedded at /admin and running

Labels: infra
Status: resolved
Blocked by: 07, 08

**What to build:** `@sanity/astro` and `@astrojs/react` in `astro.config.ts` with
`studioBasePath: '/admin'`, stega pointed at `/admin`, the Studio route exempt from the CSP as it
already is, and the site building and serving the Studio locally so the owner can open it, log in
and see the structure, the Inbox and the Pending view.

- [x] `bun run build` succeeds; the dev server serves `/admin` and the Studio loads to its login screen
- [x] `/admin` is reachable in the in-app browser (login screen seen on 11 September 2026; described in the handoff)
- [x] The runbook's preview section describes the login, the CORS origin and the Pending view

## Comments

11 September 2026. `bun run build` writes the Studio chunks and the Vercel output routes
`/admin/[...params]`, `/api/preview/enable`, `/api/preview/disable` and `/api/revalidate`. On the dev
server, `/admin` shows Sanity's login with the workspace title "Omo Yorùbá"; the structure, the
Inbox and the Pending view are behind the owner's login (Claude in Chrome was not connected, so no
logged-in screenshot). The disable route clears both cookie variants and redirects; enable and
revalidate name their missing secrets; GET on revalidate returns 405.
