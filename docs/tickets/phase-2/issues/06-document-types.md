# 06: The document types

Labels: content
Status: resolved
Blocked by: 03

**What to build:** every document type from CONTENT-MODEL section 4 as built under ADR 0013:
`event` (kind, edition, dates, venue, cost, dress, schedule, vendor terms, tickets URL, hero image,
album), `zone`, `ticketTier`, `sponsorLevel`, `honoree`, `program`, `initiative`, `person`,
`timelineEntry`, `testimonial`, `newsPost`, `album` (album-level credit), `photographer`, `partner`,
`outcome`, `stat`, `door`, `hometownAssociation`, `givingLevel`, `governanceDoc`, plus
`lintReport` for the content-lint function. Orderings and previews make the Studio lists readable.

- [x] Every type is registered, previews show a useful title and subtitle, list orderings exist
      where a group sorts (events by start, people by group and order)
- [x] References resolve to the intended types only; images are `oyImage`
- [x] No derived field is stored (no `hasPage`, `status`, `contactVia`)

## Comments

11 September 2026. `stat` stores the sourced figure's fields flat; `outcome.figure` is a
`sourcedFigure` object. `album` carries `credit`, `creditConfirmed` and `consentNote` for every
photo (ADR 0013). `lintReport` exists for the content-lint function (ADR 0014).
