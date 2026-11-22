# Feature map

The eight flows a change can touch, where each lives, the specs that guard it, and what the two CI
modes can and cannot show. **Placeholder** is CI's `Playwright and axe` job: every read answers null,
so pages render Pending. **Fixture** is `Playwright with fixture data`: the seed's documents and
photographs plus one video, served by `packages/content/scripts/fixture-api.ts`. The fixture holds
no Zeffy addresses, because the seed leaves every owner-only value empty.

| Flow | Routes and entry points | Code | Specs | Placeholder shows | Fixture adds | Never provable headless |
| --- | --- | --- | --- | --- | --- | --- |
| Donate | every Donate button; `/donate`; `#give` on any page | `packages/ui/src/forms/GiveDialog`, `ZeffyDialog`, `packages/web/src/lib/csp.ts` (`framableSrc`) | `give`, `donate` | the dialog's pending mode and its human fallback | the Donate page's giving levels and facts | Zeffy's own form: Zeffy refuses headless browsers, so its frame is checked by address only |
| Join | a button set to the membership form; `#join` | `packages/ui/src/forms/JoinDialog`, `ZeffyDialog` | `join` | the member enquiry fallback | the take-part rows that open it | Zeffy's membership form, as for Donate |
| Gala tickets | Get tickets on `/gala`; `#tickets` | `packages/ui/src/forms/TicketsDialog`, `packages/ui/src/cards/TicketTierCard/tickets.ts` | `tickets`, `gala` | the Pending ticket state | the Gala page's editions | Zeffy's ticket form; a non-Zeffy link opens a new tab |
| Enquiries | the eight enquiry cards (sponsor, performer, table, member, volunteer, enrol, vendor, contact) | `packages/ui/src/forms/EnquiryCard`, `EnquiryModal`, `Field`; `packages/web/src/actions`, `lib/forms` | `enquiry` | the modal, validation and the "Ẹ ṣé! ✓" success, with the action intercepted (`interceptActions`) | the cards on pages that need content | a real write: specs never send one, and verification must not either |
| Newsletter | the footer form | `packages/ui/src/forms/NewsletterForm`, the subscribe action | `newsletter` | the form and its success, intercepted | nothing more | a real subscription, as for Enquiries |
| Gallery | `/gallery`, `/gallery/<album>`, `?photo=<key>` | `packages/web/src/pages/gallery`, `packages/ui/src/media` (`Lightbox`, `PhotoCarousel`, `VideoGrid`), `packages/content/src/videos.ts` | `gallery`, `album`, `carousel`, `video` | the albums-being-prepared line | the mosaic, album pages, the Lightbox, the carousel, the video's play link | YouTube's player: specs answer its address themselves |
| Event pages | `/odunde`, `/gala` | `packages/web/src/lib/sanity/festival-page.ts`, `gala-page.ts` | `odunde`, `gala` | the Pending sections | past years with an album and its video | nothing beyond Zeffy, above |
| Studio | `/admin` | `packages/content` (schema, structure, roles), mounted by `@sanity/astro` (`studioBasePath`) | none: Vitest covers the schema and structure | nothing | nothing | the signed-in Studio: it needs a Sanity login, so verification there is the owner's |

Owned forms never reach Sanity in any run: the specs intercept the actions, and the fixture API
answers queries only (a mutation answers 404).
