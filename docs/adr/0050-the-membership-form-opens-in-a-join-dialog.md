# The membership form opens in a Join Dialog, and every Zeffy form shares one dialog shell

Built on 10 October 2026 at the owner's request: they gave the embed code of the organization's Zeffy membership
form (`/embed/ticketing/omo-yoruba-of-southern-california-memberships`: one membership at $50, renewing monthly, with
an optional gift) as "the membership form we can embed on the website", and asked for the site's own styling on
Zeffy's forms where that is possible. The choices below are the build's, for the owner to accept with the pull
request; two questions stay open and are named under Consequences. Follows ADR 0045, which keeps Zeffy as a frame
inside our own dialog and never a script, and ADR 0020.

Zeffy's membership form is a ticketing form, and it speaks the same messages as the donation form: framed with
`embed-version=v2&embedId=join` on a page of another origin, it posted `zeffy-embed:connected` 1.8 seconds after
insertion (checked on 10 October 2026, nothing typed or submitted). Its own page answers at the embed address
without the `/embed` segment, as the donation form's does.

What this change builds:

- One shell, `ZeffyDialog.astro`, holds what the Give Dialog was: the native dialog, the embed box, the timer and
  the fallback, the listener for Zeffy's messages and the link to Zeffy's own page. A dialog gives it its form's key
  and its own words. The key names everything a dialog needs a name for: the dialog (`dialog#give`), its triggers
  (`data-give`), its hash (`#give`), its track events (`give_opened`) and the form in Zeffy's messages
  (`embedId=give`). One element, `oy-zeffy-dialog`, runs every dialog on the page; the document and window
  listeners still register once (ADR 0041) and find their dialog by the key. The Give Dialog is now that shell with
  the Give Dialog's words, and behaves as before; its element was `oy-give-dialog`.
- The Join Dialog is the same shell with the key `join`: the title "Become a member", the membership form, and a
  fallback that hands over to the member enquiry. `#join` in the URL opens it on load, the third address that opens
  something, beside `#give` and a photo address (ADR 0037). It announces `join_opened`, `join_embed_failed`,
  `join_completed` and `join_page_opened`. Like `give_completed`, `join_completed` is a sign seen in the browser:
  the payment and the membership are Zeffy's records, and nothing about either reaches the site. It is a handoff.
- Organization details gain the membership form's address (`siteSettings.zeffyMembershipUrl`). The layout mounts
  the Join Dialog only while that address is one the policy frames, so the dialog has no pending mode and a page
  carries nothing for it until the form exists.
- A Studio action gains a fifth thing to open, the membership form (`cta.kind: 'join'`). Its trigger carries
  `data-join` and links to the member enquiry on the same page (`?enquiry=member#enquiry`), so without JavaScript,
  or while the settings hold no membership form, a membership button opens the form the site owns. No button is
  changed by this decision: the take-part rows' member way in and the member door still open the member enquiry
  until the owner points a button at the membership form.
- The membership form's frame rides the page, written by the layout from the settings it already read, where the
  donation form's frame comes from a server island (ADR 0020). A second island would add a second function run and
  an uncached settings read to every page view (review ticket R129), and a publish of the settings already purges
  every page.

- Two things follow from a second dialog on the page, both met in the browser and not in the element tests. The
  parser connects it before its children exist, since the first dialog's script has already defined the element, so
  each dialog's own copy of the script wires whatever connected unwired. And because its frame rides the page, a
  page opened at `#join` mounts the frame while it parses, so that page's load event waits for Zeffy's frame; the
  Give Dialog's island arrives after it.

## Considered options

- A second copy of the Give Dialog for memberships: two copies of the contract with Zeffy (the origin and id
  filter, the ready and height messages, the timer, the iPhone flag), which must change together.
- Zeffy's own embed code as pasted (`data-zeffy-embed` and its v2 script): the script ADR 0045 rejected, for the
  same reasons, and an inline `onerror` handler the policy would refuse.
- The membership form inline on Get Involved: it would load Zeffy's form for every visitor to the page, or need a
  second element to mount it late, and every other form on the site opens in a dialog from a card that says what it
  asks.
- Every membership button opening the Join Dialog as soon as the settings hold the form, as every Donate button
  opens the Give Dialog: one switch, but it would retire the member enquiry as the first step without the owner
  deciding so, and the Studio would say a button opens one form while the site opened another.
- A link to Zeffy's own page instead of an embed: the handoff the Gala's seats use. The owner asked for the form
  on the site.
- One element name per form (`oy-give-dialog`, `oy-join-dialog`): the script would need the list of forms before
  any dialog is on the page.

## Consequences

- Still the owner's to decide (open-work D28): which buttons open the membership form, and whether the member
  enquiry stays the first step. The enquiry's own words still say "Dues are not paid here.", which stays true of
  that form.
- The Join Dialog's words are new and unconfirmed (open-work D29), as the Give Dialog's were (D8).
- Zeffy draws the inside of its forms. The site cannot style it: a page cannot reach into a frame of another
  origin, and the form's address takes no styling (among the parameters the form's code reads by name, read on
  10 October 2026, none sets a colour or a theme). Each form's colour, its light or dark mode and its background are
  set in Zeffy, per form, in its "Style your campaign" panel; Zeffy "applies a variation of that color instead of
  the exact code", and fonts and shapes are Zeffy's. What the site styles is everything around the form: the
  dialog, its title and lead, the bottom sheet on a phone, the fallback and the foot.
- `zeffy.ts` moves beside the shell (`packages/ui/src/forms/ZeffyDialog/zeffy.ts`) and derives Zeffy's own page for
  a ticketing form as it does for a donation form. The Studio's "Zeffy embed URL" is now "Zeffy donation form URL",
  beside "Zeffy membership form URL"; the field's name, `zeffyEmbedUrl`, stays.
- A third Zeffy form (sponsor levels, Gala seats, vendor fees) is a key, a field in Organization details and a
  dialog's words. None is built or decided here.
- Amends ADR 0045 and ADR 0020, noted in both: the Give Dialog's element is the shared `oy-zeffy-dialog`, and
  `#join` joins `#give` among the addresses that open a dialog on load. AGENTS.md's rule on what opens on load
  reads as amended here.
