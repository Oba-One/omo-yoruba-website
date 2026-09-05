---
name: oy-release
description: Seasonal event release checklist for a new Odunde or Gala edition.
disable-model-invocation: true
---

# Seasonal event release

Stages one edition of the festival or the Gala in a Sanity Content Release and publishes it
on one day. Shapes: `docs/design/CONTENT-MODEL.md` sections 3 and 4. Content comes from the
owner; nothing here is guessed.

1. Create a Content Release named for the edition ("Odunde 2027", "Gala 2026") through the
   Sanity MCP server.
2. In the release, create or version the `event` document: kind, title, edition year, start,
   end, doors, venue, cost, dress, hero image (with alt, caption, credit), summary,
   `ticketsUrl` (Gala seats, Eventbrite) and `status: upcoming`.
3. Festival: zones (`zone`, four today plus the pending fifth), schedule items, vendor
   terms on `festivalPage` (fees, close date, decision date, permit note). Gala:
   `ticketTier` documents (buy-now and enquiry variants, one featured), `sponsorLevel`,
   `honoree` if the awards option is on, the running order.
4. Update the page singleton's `glance` facts and, for the homepage, `layout.season` if the
   automatic date choice needs overriding.
5. Run the voice check on every new string (no em dash, marks on Yoruba words, sentence
   case). Every image has alt, caption and credit.
6. Preview the release in Presentation on `/odunde` or `/gala` and the homepage event band.
7. Publish the release on the announce date.
8. Verify: the routes update within a minute (the webhook purges by tag); the Pending view
   shows nothing new for the edition; the previous edition's `status` is `past` and its
   album is linked for the past-years carousel.
