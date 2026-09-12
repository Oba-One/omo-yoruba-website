# Take-part rows live on the page singleton, in the order the markup draws them

Decided with the owner on 12 September 2026 (Phase 5 grill). The closing take-part band is a list of
row objects on each page singleton, `takePart[]`: the way in (vendor, sponsor, performer, volunteer,
table, give), a title, a line and the button label, in the order the page shows them. It replaces
`takePartOrder`, which held the ways in as keys and left their copy nowhere. The chip, the accent and
what the button opens follow the way in, so an editor cannot point a vendor row at the sponsor form.
Facts never go in a row's line: the vendor row appends the edition's vendor terms with Pending chips.
Odunde's `takepart` option moves the vendor or the sponsor row to the top in the markup; the
prototype's CSS `order` rule is not ported, because reading order and tab order would then differ
from what is seen (WCAG 1.3.2, 2.4.3).

## Considered options

- Keys on the singleton and the copy in page code, like the homepage's section headings: rejected;
  the rows differ per page ("Festival day needs hands", "The night needs hands") and are the copy an
  editor most often adjusts between editions.
- Keys with the copy from `enquiry-kinds.ts`: rejected; the spec's blurbs are written for the modal
  and would read the same on every page.

## Consequences

- The seed writes the prototypes' rows with the register's invented facts taken out and unsets the
  retired `takePartOrder`.
- The program pages (Phase 6) take the same row object for their enrol, volunteer and give rows.
