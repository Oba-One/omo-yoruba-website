# Dialogs are native dialog elements, and the Give embed is a server island mounted on first open

Decided with the owner on 11 September 2026 (Phase 3 grill). The Enquiry Modal, the Give Dialog
and the mobile menu are `<dialog>` elements opened with `showModal()`, so the focus trap,
Escape and the scrim come from the browser (Chrome 37, Firefox 98, Safari and iOS 15.4 onward),
focus return to the trigger is explicit, and the bottom sheet under 720px is CSS on the same
element; the prototypes' `role="dialog"` divs and hand-written traps were not ported. The Zeffy
embed is a server island that reads `siteSettings.zeffyEmbedUrl` itself, tags its response for
the Phase 4 cache, renders Pending while the URL is empty, and hands the iframe over in a
`<template>` that the dialog mounts on first open, when the four second timer starts; the
fallback names the mailing address and opens the contact enquiry. Passing the URL as an island
prop was rejected: the island is fetched on every page view either way, and a public URL gains
nothing from an encrypted prop.

## Consequences

- The cached page never carries the embed; a Studio change to the URL shows on the next island
  fetch without a purge.
- Zeffy loads only for visitors who open the dialog, which keeps the content pages inside the
  JavaScript budget.
- `#give` opens the dialog on load with JavaScript; without it the `/donate` page renders the
  dialog open through the same `:target` fallback the CSS provides.
