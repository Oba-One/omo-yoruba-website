# The gallery's content model: an album's year, what the gallery shows, and the owner's policy

Decided with the owner on 13 September 2026 (Phase 8 grill, `docs/tickets/phase-8/spec.md`, Q4 to Q16). The
gallery is the page most full of identifiable faces, children's included, and it had the least content the
owner has confirmed: three seeded albums without a date or a confirmed credit, captions that are the
register's descriptions, and a prototype whose policy copy is invented. The model changes where the
prototype or the schema would otherwise make the page claim something nobody confirmed.

- **An album's year is its own date's, else its edition's.** Odunde 2026 and End-of-Year Gala 2025 belong to
  editions whose years are confirmed, so they never ask for a year; the registry's "the year of the album"
  narrows to albums with neither (today the summer camp, whose year the register leaves unstated). The
  gallery orders the albums newest year first, undated albums last, ties by title, and the newest leads the
  mosaic at double size.
- **An album shows only with a photograph.** The gallery, past years on the event pages and the album presence
  row all count albums holding at least one photograph; an empty album's own page shows "the photographs".
- **One `captions` option for both pages.** It governs the album tiles' titles on `/gallery` and the
  photograph captions on album pages; `hover` applies only where a pointer can hover, so a phone never shows a
  wall of unnamed photographs.
- **`open` changes where a tile links.** `viewer` links to the album's first photo address (ADR 0037), `grid`
  to the album's page; the album page is the same under both.
- **`soon` is the editor's switch, Pending is the data's.** `state: soon` replaces the mosaic with one sentence
  that claims nothing unconfirmed and points to the event pages' photographs; with no album holding a
  photograph, `built` shows the registry's Pending line instead.
- **The policy is the owner's words.** `galleryPage.creditsAndConsent` becomes plain text, one row of the
  credit and permissions section beside a Credits row that states only how the site credits ("Given with each
  album, and with a photograph where it differs.") and a Removal requests row with the general inbox and the
  contact form. `galleryPage.intro` retires: the header line says what it would.
- **Credits stay honest at every level.** The album's credit carries its chip until confirmed; a photograph's
  own credit, where one exists, carries its own row and chip ("a photograph's own credit to confirm").

## Considered options

- A manual order field on albums: the year already orders them, and a second number to keep in step would
  drift.
- The album's `date` as the only year: every edition's album would show a chip for a year the edition states.
- Portable Text for the policy: the section's rows hold plain text, and nothing was stored in the field.
- The prototype's soon sentence and consent rows as seeded copy: the register marks them invented, and the
  soon sentence waits for a set the dataset already holds.

## Consequences

- The seed changes one stored value, the gallery's header line, through a revision (ADR 0035), and writes no
  date, album, caption or credit.
- `event` reaches `/gallery` and `/gallery/[album]`, and `galleryPage` reaches the album pages, so a publish of
  an edition or of the gallery singleton purges them.
- CONTENT-MODEL's `gallerySettings` (`intro`, `creditsAndConsent` as Portable Text, `state`) reads as amended
  here; the singleton is `galleryPage`, and `state` is a layout option.
