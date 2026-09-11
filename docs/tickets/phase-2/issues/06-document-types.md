# 06: The document types

Labels: content
Status: open
Blocked by: 03

**What to build:** every document type from CONTENT-MODEL section 4 as built under ADR 0013:
`event` (kind, edition, dates, venue, cost, dress, schedule, vendor terms, tickets URL, hero image,
album), `zone`, `ticketTier`, `sponsorLevel`, `honoree`, `program`, `initiative`, `person`,
`timelineEntry`, `testimonial`, `newsPost`, `album` (album-level credit), `photographer`, `partner`,
`outcome`, `stat`, `door`, `hometownAssociation`, `givingLevel`, `governanceDoc`, plus
`lintReport` for the content-lint function. Orderings and previews make the Studio lists readable.

- [ ] Every type is registered, previews show a useful title and subtitle, list orderings exist
      where a group sorts (events by start, people by group and order)
- [ ] References resolve to the intended types only; images are `oyImage`
- [ ] No derived field is stored (no `hasPage`, `status`, `contactVia`)
