# The Gala's tickets open in a Tickets Dialog when the edition's ticket link is a Zeffy form

Built on 10 October 2026 at the owner's request: they gave the embed code of the Gala's Zeffy ticket form
(`/embed/ticketing/end-of-the-year-gala-2`) and asked for it embedded in the site. The choices below are the
build's, for the owner to accept with the pull request. Follows ADR 0050, which gave every Zeffy form one dialog
shell, and amends ADR 0024, which made the edition's `ticketsUrl` the Gala's Eventbrite link.

What this change builds:

- The edition's `ticketsUrl` is its ticket link, whoever sells the seats. When it is a Zeffy form's embed address
  on the origin the policy frames (a ticket form's reads `https://www.zeffy.com/embed/ticketing/<slug>`; a donation
  form's embed address is framed too, since a frame beats a link to a bare embed), the Gala page mounts the
  Tickets Dialog around it: the shell of ADR 0050 with the key `tickets`, so `dialog#tickets`, `data-tickets`,
  `#tickets`, `embedId=tickets` and the track events `tickets_opened`, `tickets_embed_failed`, `tickets_completed`
  and `tickets_page_opened`. Any other link (Eventbrite) opens in a new tab as before, and no link shows the
  registry's chip, now worded "the ticket link".
- A Get tickets button carries `data-tickets` and links to Zeffy's own page for the form, which is where it goes
  without JavaScript. One helper, `ticketsTrigger`, decides between the dialog and a new tab, and words the notice
  beside the button, for the tier cards, the seats block and the page's mount.
- The seats block gains its own Get tickets button while no tier card carries the link: with no ticket tier in
  the Studio, under the Pending line, or with only the table tier. Zeffy's form lists the tickets and their prices
  itself, so seats can be sold before anyone retypes the tiers; the tiers stay owed in the registry.
- The dialog belongs to the Gala page, not to the layout: the link is the edition's, a fact that changes each year
  (ADR 0013), and only the Gala page reads the edition. It sits beside the page's main content, outside its
  sections, so its title is no heading of the page. It is not persisted across the router's swaps; the element's
  definition and its document listeners already are, with the Give Dialog (ADR 0041).
- `#tickets` in the URL opens the dialog on load on the Gala page, the fourth address that opens something, beside
  `#give`, `#join` and a photo address. Like the other two forms' events, `tickets_completed` is a sign seen in the
  browser: the order is Zeffy's record, a handoff.

## Considered options

- A field in Organization details, as the donation and membership forms have: the Gala's form is one edition's
  (Zeffy's own address for it ends `gala-2`), and next year's would overwrite it.
- A new field on the edition beside `ticketsUrl`: two links for one fact, and a rule for which wins.
- A Studio action that opens the Tickets Dialog from any page: the dialog is only on the Gala page, so elsewhere
  the button could only travel there. The page's own Get tickets action already goes to the seats.
- The form inline in the seats block: it would load Zeffy's form for every visitor to the Gala page, where the
  dialog loads it only for someone who asks for tickets (ADR 0020).
- Retiring the ticket tiers, since Zeffy's form lists them: the tiers also feed "Seats from" in the glance strip
  and, in a year that offers one, the table tier, which is an enquiry.

## Consequences

- The Gala page's copy that names Eventbrite is Studio content (`galaPage.tiersIntro`) and the owner's to reword
  once the edition holds the Zeffy form. CONTEXT.md's Gala and Ticket tier no longer name one seller.
- The Tickets Dialog's words are new; asked on 10 October 2026, the owner left them, and the Join Dialog's, to
  the build ("wording do what you recommend", open-work D29 and D31).
- The Gala of 2026 offers no tables (the owner, 10 October 2026, open-work D9). The seats section's heading
  reads "Seats" unless the edition lists a table tier, and the table enquiry stays in the code for a year that
  offers one.
- Read in a browser on 10 October 2026, Zeffy's form shows the night's date, time and place and one ticket,
  General Admission. The site's own facts for
  the edition (date, doors, venue, tiers) are still owed in the Studio (open-work C5); nothing here copies them
  from the form.
- Amends ADR 0024 and ADR 0050, noted in both. AGENTS.md's rule on what opens on load reads as amended here.
