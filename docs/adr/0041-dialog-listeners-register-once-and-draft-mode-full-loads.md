# Persisted dialogs listen for their triggers once, and draft mode loads pages in full

Decided on 26 September 2026 after the owner reported, in the notes of 25 September, the home page
flashing endlessly with a white gap at the bottom once it was reached through the nav. Reproduced on the
public host in the browser pane on 25 and 26 September and in Playwright on 26 September. Two things were
found.

Without the perspective cookie, a footer or door trigger clicked after a client-side arrival both opened
its dialog and started a second navigation to the trigger's own address (`?enquiry=<kind>#enquiry`,
`/donate#give`), on Chromium as much as elsewhere. The Enquiry Modal and the Give Dialog are persisted
across navigations (`transition:persist="oy-dialogs"` in the layout, ADR 0018), and a persisted element is
disconnected and connected again on every swap: Astro moves it with `moveBefore` where that exists
(Chromium 133 and later) and re-inserts it elsewhere, and either way the custom element, which defines no
`connectedMoveCallback`, runs `disconnectedCallback` then `connectedCallback` (counted on the public host:
twice per dialog per swap). Both elements added their `document` click listener per connection, so after
the first swap it sat behind the router's, whose `defaultPrevented` check then came too early. On Safari
and Firefox the swap that followed also took the open dialog out of the top layer: open but no longer
modal, the page behind it live, and under 720px the white bottom sheet below the footer.

With the cookie, which the owner's tabs carry after any Presentation session on the same origin, the
Visual Editing overlay drew one of its cards 6266px below the footer after a swap at 1440 wide: the white
gap, with the overlay's hover outlines over the footer's stega text for the flashing.

Three decisions follow.

Each dialog's document and window listeners register once, when its inline script first runs while the
page parses, and find the live element when the event comes (`document.querySelector`). They stay ahead
of the router's own click listener whatever the swaps do to the element, in the bubble phase as before,
so a listener on the trigger itself (the overlay's, in the Presentation tool) still wins by stopping
propagation. A dialog that a re-insertion left open but not modal is shown modal again in
`connectedCallback`. And both `close` handlers write `history.replaceState(history.state, '', ...)` when
they strip `#give` or the `enquiry` and `sent` parameters, instead of `null`, which had wiped the router's
`{ index, scrollX, scrollY }` entry and made it ignore Back and Forward for that entry.

Draft mode has no router: the layout renders `<ClientRouter />` only outside draft mode (since ADR 0044, the perspective cookie beside a verified session). An
editor's navigation is a full load, which is what Sanity's Astro guide sets up: the overlay mounts once per
page and never meets a swap, and the Presentation tool's history adapter, which assigns `location`,
matches. Editors lose the cross-fade and the persisted dialogs while the cookie is set; the public site
keeps both. The overlay's misdrawn geometry after a swap has no known cause yet; the spec's sampler names
the stray element when it recurs.

## Considered options

- The capture phase for the per-connection listeners: order-proof against the router, but a `document`
  capture listener also runs before the overlay's listener on the trigger itself, so in the Presentation
  tool an editor clicking a Studio-set label to edit it would have opened the dialog as well.
- `data-astro-reload` on every trigger: the triggers live in many components, and the attribute would
  announce a full load that does not happen. The PhotoGrid's links keep it on purpose, because the
  Lightbox claims them with a per-instance listener (ADR 0037).
- Registering the listeners again on `astro:page-load` to restore the order: the order is what broke.
- Keeping the router in draft mode and cancelling `astro:before-preparation` there: the router then
  assigns `location.href` itself, the same full load with one more moving part.
- Owning the overlay's React root in a script of the site's own, torn down on `astro:before-swap` and
  mounted again on `astro:page-load` with a history adapter on Astro's `navigate()`: keeps the cross-fade
  for editors at the cost of about eighty lines against `@sanity/visual-editing`'s internals. The path if
  editors ask for the cross-fade back.

## Consequences

- The rule for ADR 0018's elements: a document-level listener that claims a click registers once, at
  definition, and finds its element when the click comes; a history write keeps `history.state`; nothing
  initialises only on `astro:page-load`, since draft mode has no router. `packages/ui/README.md` carries
  it.
- `packages/web/e2e/navigation.spec.ts` keeps the proof in both data modes, on both persist paths (a
  variant hides `moveBefore`): the arrival at `/` through the nav samples the page for two seconds; a
  footer trigger opens its dialog without a navigation; an open dialog stays modal across Back; closing a
  dialog opened by its address keeps the router's history state; in draft mode (seeded runs only) the
  arrival is a full load with one overlay host and a steady height. `PLAYWRIGHT_WEBKIT=1` adds a WebKit
  project locally. The `OpensAfterReconnection` plays disconnect and connect the element and expect the
  click prevented.
- Phase 4's answer that a cross-fade navigation mounts the overlay fresh (`docs/tickets/phase-4/spec.md`,
  Q3) is amended: there is no cross-fade in draft mode.
- The draft-mode cookies belong to the origin, so an editor's normal tabs stay in draft mode until
  `/api/preview/disable` is visited or the session's twelve hours pass (ADR 0044); on the public host a cached page still comes back as the public copy,
  router and all (ADR 0021). The runbook says so; the preview host (open-work D15) keeps the public origin
  clear of it.
- Found on the way: under `astro dev` the overlay never mounted, because Vite served
  `react-compiler-runtime` (CommonJS) raw. `@sanity/astro`'s own dev plugin lists it for pre-bundling but
  keeps only the entries that resolve from the project root, which Bun's isolated linker does not offer.
  `astro.config.ts` pre-bundles the overlay's React entry through `@sanity/astro`; builds were never
  affected.
