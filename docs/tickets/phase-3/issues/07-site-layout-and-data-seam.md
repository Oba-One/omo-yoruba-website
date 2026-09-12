# 07: SiteLayout mounts the chrome and both dialogs over the hand-written loadQuery

Labels: infra
Status: resolved
Blocked by: 03, 04, 05, 06

**What to build:** `loadQuery` in `packages/web/src/lib/sanity` that reads the perspective cookie
from `preview.ts`, queries with the Viewer token, drafts and stega only when the cookie is set,
and never throws for a page (a failed read logs and renders Pending). A `siteSettingsQuery`
in `@oy/content` (the only place GROQ lives) typed by TypeGen. `SiteLayout.astro` loads the
settings once, mounts SiteNav (current section from the path), SiteFooter, the EnquiryModal
(open for `?enquiry=<kind>` or a posted result, refilled from the posted form, redirected to
`sent=1` on success) and the GiveDialog with the island, persists all four across navigations,
adds `<ClientRouter />` with the 380ms fade on the root that reduced motion switches off, the
2px gold progress bar driven by the router events, the analytics bridge that forwards
`oy:track` events to PostHog with the names from ROUTES section 2, and `data-card="grain-dots"`
plus the theme on the body.

- [x] Every page renders the nav first and the footer last with the settings from the development dataset; empty settings show Pending chips, never an invented name, address or phone
- [x] Navigating between two pages cross-fades and shows the bar; with reduced motion neither animates
- [x] `/?enquiry=vendor` renders the modal open for the vendor kind without JavaScript; `#give` opens the Give Dialog on load
- [x] `bun run build` passes and the placeholder home page still renders its confirmed copy

## Comments

11 September 2026. The datasets are private (enquiries and subscribers hold personal data), so
`loadQuery` reads with the Viewer token on every request and without it every read answers null
and the site renders Pending; a `--public` flag on the query script reproduces the anonymous
read that found this. The nav and the footer re-render per navigation (custom elements upgrade
on insertion, so the current page and the source path stay right); only the two dialogs are
persisted. The Zeffy island lives here (`ZeffyEmbed.astro`) and answered Pending against the
seeded settings. The `?enquiry=member` opener renders the modal open and the element turns it
modal once scripts run; `#give` opens the Give Dialog on load in its pending mode.
