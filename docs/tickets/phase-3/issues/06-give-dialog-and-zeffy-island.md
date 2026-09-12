# 06: GiveDialog with the Zeffy embed island and the 4 second fallback

Labels: design
Status: resolved
Blocked by: none

**What to build:** `GiveDialog` in `@oy/ui/forms`: the native dialog every Donate trigger opens,
with the aṣọ òkè top edge, the title "Give to Omo Yorùbá", the lead line, the close ×, the
embed slot, the fallback block (the giving form did not load: write to us, or send a check to
the mailing address from the settings or its Pending chip, a Contact button that opens the
contact enquiry, Try again) and the trust foot line with the EIN placeholder. The embed comes
from a server island in `packages/web` that reads `siteSettings.zeffyEmbedUrl` itself, renders
`<Pending what="the Zeffy link" />` while empty, and otherwise hands the iframe over inside a
`<template>` the dialog mounts on first open, starting the 4 second timer that shows the
fallback and announces `give_embed_failed` (ADR 0020). `#give` opens it on load; the dialog
strips the hash on close.

- [x] Stories: Embed (a placeholder frame in Storybook), Fallback, Pending, the bottom sheet at 375
- [x] `play`: the dialog opens from a trigger, Escape closes it and focus returns, Try again re-arms the embed
- [x] Vitest: the fallback names the mailing address or its Pending chip, the Contact button is the contact trigger, the foot line reads the EIN placeholder
- [x] The island answers with the iframe only when the URL is set, and with the Pending chip otherwise

## Comments

11 September 2026. The dialog side is built with a `GiveEmbedPlaceholder` stand-in for the
stories (string slots drop templates and iframes); the island itself lands with the layout in
ticket 07, since it needs `loadQuery`. The element polls for the template for the length of the
timer, so a dialog opened before the island arrives still mounts the iframe, and a missing
template ends in the fallback with `give_embed_failed`. Both play functions pass in the canvas
with the timer shortened to 300ms.
