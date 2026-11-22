# Three sections added after the first showing

Accepted 11 October 2026, from the same notes as ADR 0056. These three add a part the handoff does not
draw, where ADR 0056 changed parts it does. The owner's words are quoted.

Amends ADR 0023 (the homepage follows its prototype), ADR 0028 (the event pages follow theirs) and
ADR 0036 (the trust pages follow theirs), each noted there.

## Decision

- **The homepage introduces its two events.** "The homepage does not have a section highlighting the core
  events Odunde and End of Year Gala". The prototype gives the homepage the lead edition's band and nothing
  on the other event. Under the band a section now sets the two side by side, one `EventCard` each:
  the event page's own photograph, kicker, name and line, when and where the next edition is once the
  Studio holds them, and a quiet link to the page. The cards read the two page singletons' headers, so
  the homepage and the page it opens never say two things; nothing new is asked of the Studio. The band
  stays: it says what is next and carries the ticket or the vendor action.
- **Partners are cards with a line and a link.** "the partner section can look better with more detail
  and links to the partner/sponsors". The prototype draws a row of name chips. `PartnerCards` draws one
  card each: what the partner is to us (partner, sponsor or funder), its name, one line on what it does
  with us, and a quiet link worded by its site's address. The line is a new optional field on the
  partner (`line`); a card without one, or without a link, is still whole. `PartnerRow` keeps the chips
  for a list of names alone (Get Involved's associations, should the owner list them).
- **Impact closes on its partners, with the ask among them.** "Fund next year section does not look good
  with it background similar to the footer. And we also have partners and funders right above so we
  should combine the two". The prototype ends Impact on a dark band, which sat on the dark footer. The
  ask is now an `AskCard` at the foot of Partners and funders, on the section's own ground: the kicker,
  "Fund the next year", the line on who answers and the two buttons. It keeps the anchor `#fund`. With
  the partners hidden by the page's option, the section stands on the ask alone.

Impact's voices lose a line with them: the page said "A parent, an elder, and a vendor, in their own
words", which the Studio's voices need not be. It now says only that the words are theirs.

## Consequences

- The homepage reads the two event pages' singletons, so publishing either purges the homepage too
  (`TYPE_ROUTES`).
- One more section on the homepage, between the band and the programs. The lead event shows twice in
  one screen on a wide display, once as what is next and once as what it is.
- A partner's line is the organization's to write. The cards show without it.
