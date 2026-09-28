# Draft mode needs a session cookie the enable route signs

Decided on 27 September 2026 for the deep review's blocker R03 (`docs/plans/review-alignment-and-quality.md` in
pull request 16). ADR 0021 said drafts need the signed enable route, but the loaders read drafts whenever the
perspective cookie named them, and that cookie is plain and readable by scripts, as the Presentation tool's pattern
keeps it. Anyone
who set `sanity-preview-perspective=drafts` by hand and asked for a page the CDN had not cached (any new query
string) was served every draft the page's query reached: an edition prepared as drafts for its announce day,
draft people and settings, and draft albums whose photographs may still wait on consent. Nothing was cached, so it
was disclosure, not cache poisoning.

Now `/api/preview/enable`, once `validatePreviewUrl` accepts the Studio's secret, also sets `oy-draft-session`:
httpOnly, `SameSite=None; Secure`, partitioned inside a cross-site iframe like the perspective cookie, for twelve
hours. Its value is an expiry and an HMAC-SHA256 of it, keyed with the Viewer token (`SANITY_API_READ_TOKEN`)
under a fixed label (`draftModeCookies` in `packages/web/src/lib/sanity/draft-session.ts`). `loadQuery` reads the
drafts or release stack the perspective cookie names only while the session verifies (`previewPerspective`), and
decides once per request, so the page's read and the layout's agree; that one answer decides whether the overlay
mounts and the router stays out (ADR 0041), even when one of the reads fails. Without it a page reads as
published. The middleware still refuses to cache a request carrying either cookie, verified or not, and
`/api/preview/disable` expires both.

## Considered options

- `SANITY_PREVIEW_SECRET` as the key, as the ticket proposed: a second secret to set in every environment before
  the Presentation tool shows drafts again. The Viewer token is already in every environment that can read drafts,
  and whoever holds it reads drafts from the API without the site, so a key derived from it adds no exposure.
  `SANITY_PREVIEW_SECRET`, read by nothing, retired the same day: the env schema, the wizard and the runbook
  dropped it.
- Checking the Studio's preview secret on every request: the secret document is short-lived, and it would cost a
  query per page.
- Signing the perspective cookie itself: its name and plain value come from `@sanity/preview-url-secret`, and the
  Studio's tooling expects them.
- A session with no expiry, like a framework's draft-mode cookie: a copied cookie would work until the token
  changed.

## Consequences

- Makes ADR 0021's consequence true: drafts need the session the enable route signs.
- Twelve hours after the Presentation tool opened, the iframe reads as published until the tool is opened again,
  which runs the enable route again. Nothing on the server can end one session early: `/api/preview/disable`
  clears the cookies of the browser that visits it. To end every session, rotate the Viewer token (the runbook's
  variables table).
- `packages/web/e2e/navigation.spec.ts` signs a session with the token from `packages/web/.env` for its draft-mode
  case, and proves that a perspective cookie set by hand, without the session, reads as published.
