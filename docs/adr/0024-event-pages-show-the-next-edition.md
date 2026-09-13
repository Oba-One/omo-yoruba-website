# Event pages show the next edition, with Pending between editions, and the last one as past years

Decided with the owner on 12 September 2026 (Phase 5 grill, `docs/tickets/phase-5/spec.md`). `/odunde`
and `/gala` each show the next edition of their kind: the nearest one still to come by the rule the
homepage band already uses (`leadEvent` in `@oy/content`: a dated edition until it ends, an undated one
by the calendar). Every fact the edition lacks renders the registry's Pending chip, and when no edition
is still to come the same chips stand for the next one. The newest past edition appears only as past
years: the first eight photographs of its album, with the album's credit and a Pending chip while the
credit is unconfirmed. Per-edition facts stay on the edition (ADR 0013), the Eventbrite link for Gala
seats included: `event.ticketsUrl` is its one source, and `siteSettings.eventbriteUrl` and
`PUBLIC_EVENTBRITE_URL` retire. A block the Studio has nothing for renders its heading and a Pending line
whenever its option shows it, although the prototypes mark the schedule, the running order and past
galas "hidden until set".

## Considered options

- A recap of the past edition in the header between editions: rejected by the owner; a returning
  visitor wants the next date, and a recap header would read as a stale page.
- A reference on each page singleton, like the homepage's `leadEvent`: rejected; one rule shared with
  the band keeps the homepage and the event page on the same edition without an editor updating two
  fields each year.
- The settings' Eventbrite field as a default with the edition overriding: rejected; each Gala sells
  through its own Eventbrite event, so a site-wide link would point at last year's once it went stale.
- Hiding empty blocks until they have content (the prototypes' tweak labels): rejected; AGENTS.md
  holds that empty renders Pending, so the page and the Studio's Pending view name the same owed item.

## Consequences

- The day an edition ends the page moves to the next one, or to Pending chips if it has not been
  entered; creating the next edition in the Studio is the editor's cue (the content-ops recipe).
- The calendar is read in Los Angeles (refined in the Phase 5 code review). An edition with a start and
  no end stays the next one until its start day ends there; an undated edition stays ahead until the
  last month of its season in its year (June for Odunde, December for the Gala). The band and the page
  both take the nearest edition still to come.
- The Gala's honorees block defaults to hidden (ticket 06); shown with no honorees it is a Pending line.
- The festival page draws four zone cards, named zones first and placeholders for the rest (ticket 05).
