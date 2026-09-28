---
name: oy-release
description: Seasonal event release checklist for a new Odunde or Gala edition.
disable-model-invocation: true
---

# Seasonal event release

Prepares one edition of the festival or the Gala as drafts and publishes it on the announce day;
there are no Content Releases (ADR 0042). Shapes: `docs/design/CONTENT-MODEL.md` sections 3 and 4 as
amended by ADR 0013 and ADR 0042. Which inputs each kind of event shows:
`packages/content/src/edition-fields.ts`. Content comes from the owner; nothing here is guessed.

1. Create the edition as a draft from its list (Events, then Odunde Festival or End-of-Year Gala,
   then Editions), so its kind is already set. Through the Sanity MCP server, set `kind` yourself
   (`festival` or `gala`; only the Studio's lists set it), use the seed's id pattern
   (`event-odunde-2027`, `event-gala-2026`) and leave the document unpublished.
2. Fill what the form shows for that kind: the title, the edition year, start and end (Los Angeles
   time), the venue and the summary. The festival adds the cost, the schedule and the vendor terms; the
   Gala adds the doors, the dress, the tickets link (Eventbrite) and the running order.
3. Gala: `ticketTier` documents for the edition (buy-now and enquiry variants, one featured) and
   `sponsorLevel` documents, each naming the edition; `honoree` documents name it too. Whether the
   honorees show is the awards switch, which only an administrator changes.
4. Festival: the zones (`zone`) when they change, and the page's one extra glance fact if needed.
5. Run the voice check on every new string (no em dash, marks on Yoruba words, sentence case). Every
   image has alt text and a caption.
6. Check the drafts in Presentation on `/odunde` or `/gala` and in the homepage event band.
7. On the announce day, publish the edition first, then its tiers, levels and honorees.
8. Verify on the site: the pages update within a minute (the webhook purges by tag) and show no
   Pending chip for what the edition holds. The To do reads drafts, so it clears as the drafts are
   filled, before the announce day. There is no status to flip: which edition is next and which is past
   comes from the dates. After the event, make its album and name the edition in the album's Edition
   field; after the festival, also fill the attendance with its source (the Gala shows none).
