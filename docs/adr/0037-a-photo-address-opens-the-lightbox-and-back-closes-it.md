# A photo address opens the Lightbox, and Back closes it

Decided with the owner on 13 September 2026 (Phase 8 grill, `docs/tickets/phase-8/spec.md`, Q1, Q2 and Q16).
The documents disagreed: AGENTS.md and ROUTES section 3 allow one URL-driven open, `#give`, while ROUTES
section 1 and QUALITY section 2 say `?photo=<key>` opens the Lightbox and is shareable. The rule against
opening on load exists to ban what a visitor did not ask for (an entry pop-up, a scroll-triggered newsletter,
exit intent). An address that names a photograph is the visitor asking for that photograph, the same reason
`#give` opens the Give Dialog and the reason ADR 0019 renders the Enquiry Modal open for `?enquiry=<kind>`.

- **The address opens the Lightbox.** `/gallery/<album>?photo=<key>` renders the album page with the Lightbox
  open on that photograph, server side, so a shared link works without JavaScript: previous and next are
  links to the neighbouring photo addresses and close is a link to the album's page. The element's script
  turns the served dialog modal. A key the album does not hold renders the album page with nothing open; an
  unknown album is a 404.
- **One history entry per visit to the Lightbox.** Opening from a photograph pushes `?photo=<key>` with a
  `null` state. Moving with the arrows, the buttons or a swipe replaces that entry, so Back never steps
  through photographs. Back closes the Lightbox, Forward reopens it on the photograph the entry names.
  Closing with ×, Escape or the dark background goes back one entry when the Lightbox pushed one, and on a
  page that arrived with `?photo=` replaces the address with the album's (keeping the router's state), so
  closing never leaves the page. Focus returns to the tile of the photograph on screen, scrolled into view.
- **The router stays out of it.** Astro's ClientRouter (7.3.1) ignores popstate entries whose state is
  `null` but re-fetches and cross-fades the page when Back reaches one of its own entries, even when only
  the query changed. The Lightbox cancels that one transition: on `astro:before-preparation` for a
  traverse between two addresses of its own album page it calls `preventDefault()`, which the router
  checks before any fetch. The layout's progress bar skips a cancelled preparation.

## Considered options

- The address never opens a dialog, and the album page draws the photograph large above the grid: keeps the
  rule literal, but one address would look two ways (a dialog after a click, a page after a reload).
- JavaScript opens the Lightbox after load, as `#give` does: a shared link would show only the grid without
  JavaScript, and the grid would paint before the photograph.
- `pushState` on every move: Back would walk through every photograph seen before closing.
- A hash address (`#photo-<key>`), as the prototype writes: the router handles hashes without a fetch, but the
  server never sees one, so the photograph could not be served open.
- Letting the router re-fetch on Back: works, but every close by Back would reload the page, cross-fade and
  lose the focus return.

## Consequences

- AGENTS.md names the photo address beside `#give` as the URL-driven exceptions. ROUTES section 3's "Nothing
  opens on load except `#give`" and QUALITY section 2's matching assertion read as amended here; the handoff
  documents stay as written.
- Every photo address is its own cached page (43 for Odunde 2026), carrying the album page's tags, so a
  publish purges them with it, as `?enquiry=` variants are (ADR 0019).
- The e2e checks for "no dialog open on load" stay on every route; the album spec asserts the Lightbox open
  on a photo address and closed on the album's own address.
- Phase 9 decides the photo address's canonical link and whether its Open Graph image is the photograph.
