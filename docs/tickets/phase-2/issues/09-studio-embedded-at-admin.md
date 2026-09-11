# 09: The Studio embedded at /admin and running

Labels: infra
Status: open
Blocked by: 07, 08

**What to build:** `@sanity/astro` and `@astrojs/react` in `astro.config.ts` with
`studioBasePath: '/admin'`, stega pointed at `/admin`, the Studio route exempt from the CSP as it
already is, and the site building and serving the Studio locally so the owner can open it, log in
and see the structure, the Inbox and the Pending view.

- [ ] `bun run build` succeeds; the dev server serves `/admin` and the Studio loads to its login screen
- [ ] `/admin` is reachable in the in-app browser with a screenshot in the handoff
- [ ] The runbook's preview section describes the login, the CORS origin and the Pending view
