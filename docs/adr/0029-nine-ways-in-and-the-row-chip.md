# Take-part rows grow to nine ways in, and a row may name its own chip

Decided with the owner on 12 September 2026 (Phase 6 grill, `docs/tickets/phase-6/spec.md`, Q1). ADR
0025 expected the program pages to reuse the event pages' take-part row, but their prototypes need three
ways in `take-part.ts` did not know: `enrol` (Programs), `member` (Lessons) and an Updates row that sends
the reader to the newsletter form (the Collective). They also name a known way in differently: a sponsor
row reads "Partner" on the Collective where the event pages read "Sponsors", a volunteer row reads
"Skills". So the ways in grow from six to nine (vendor, sponsor, performer, volunteer, table, give,
enrol, member, updates) on the same row object, and a row gains an optional `chip` that replaces its
way in's default chip. The way in still decides the accent and what the button opens: an enquiry kind,
the Give Dialog for `give`, and the page's newsletter form for `updates`, so an editor still cannot
point a row at the wrong form. The band's rule is unchanged: the first working row carries the gold
action, give and updates are quiet.

## Considered options

- A second row type for the program pages with a free action (a `cta`): rejected, the reason ADR 0025
  gave: an editor could point a volunteer row at the sponsor form.
- Doors (`door` documents) for the extra rows: rejected, door copy is shared by the homepage, Get Involved
  and Donate, while take-part rows are written per page.
- The chip in page code per page: rejected, the chip reads with the row's title ("Skills" with "Bring a
  skill"), which the editor writes.

## Consequences

- `updates` opens no form: its button is a link to the newsletter block on the same page, which carries
  the anchor wherever it sits (the footer, or the homepage's band). `collectivePage.keepsOwnList` stays
  unread until the owner says the Collective keeps a list of its own.
- `enrol` and `member` borrow the performer accent and `updates` the give accent, as the prototypes draw
  them; the tokens name each way in so a row's markup says what it is.
- A way in that is not an enquiry kind or `give` needs its own branch in `wayAction`; `updates` is the
  first.
