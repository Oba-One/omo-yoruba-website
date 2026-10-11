# Coming soon is the consent hold for the albums

Amended by ADR 0051: the hold withholds an album's videos with its photographs, on the album page and under past
years.

Decided on 27 September 2026, when the owner asked for the deep review's blockers to be fixed (R01 of the deep
review, `docs/plans/review-alignment-and-quality.md` in pull request 16). The owner's decisions of 26 September treat
the gallery's `state` as the photo consent switch (a held-back switch, ADR 0042, open-work D5), and the Studio
described it to administrators as the hold while photo consent is settled. It was not one. ADR 0039 made `soon`
replace the gallery's mosaic and nothing else, so every album page, every photo address (`?photo=`, ADR 0037) and
the Odunde and Gala pages' past years kept every photograph public. An administrator who flipped it to protect
identifiable children would have withdrawn almost nothing.

`state: soon` now holds every photograph a page reaches through an album:

- The gallery shows its one sentence and the two event pages, as before, and its builder makes no tile, so no cover
  and no photo address leave it.
- An album page keeps its title and year and shows the same sentence and links in place of its photographs: no
  tile, nothing in the viewer, so a photo address opens nothing. Its description names the album and the sentence,
  without a count of photographs it does not show.
- The Odunde page keeps its past years in words (the heading, the intro and the attendance of the edition the
  photographs come from) and leaves out the photographs, their credit and the way to the albums. The Gala's past
  years, which are photographs and two links, are withdrawn.
- One rule decides it everywhere: `albumsHeld` in `packages/web/src/lib/sanity/gallery-page.ts`, which fills the
  schema default first, so a missing or unknown value shows the albums. The album query and both event page
  queries read the gallery's `state`, and a publish of the gallery singleton purges the event pages as well as the
  gallery's own routes.

What the switch does not do: a photograph a page shows through its own image field stays. In the seeded data every
one of those fields shows a photograph an album also holds: the homepage's hero and its seven tiles, the Odunde
header and its figure of a child beside a masquerade performer, the zones, the Gala header, Impact's photographs,
the programs' images and the doors. The Studio's description says so, and tells an administrator to change those on
their pages. Whether the hold should reach them too is D5's "on the pages" half, the owner's decision.

## Considered options

- Keep ADR 0039's meaning and correct the description instead, so the hold is unpublishing albums: one document
  at a time, and again one at a time to restore, for a question that may be settled in either direction. One
  switch an administrator can flip back is the safer tool while consent is unsettled.
- Hold the photograph wherever it appears, at the one place every builder resolves an image (`resolveImage`),
  dropping any asset an album holds: with the seeded data that removes every photograph from every page, headers
  included, and the pages' image slots would then draw their Pending placeholders for photographs that exist.
  Left to the owner (D5).
- A 404 for an album page under the hold: a visitor with a shared photo address would meet an error, where the
  sentence says the albums are being prepared.
- Withdraw Odunde's past years whole: the attendance is no photograph, and it is a fact grant reviewers read.
- Keep the Gala's past years without photographs: a heading over an intro and two links.
- Filter the photographs out in GROQ: the builders hold the pages' rules and their tests.
- An exception for draft mode, so editors see the photographs in the Presentation tool: an administrator checking
  the hold there would see the photographs and think it failed. The Presentation tool shows what visitors see;
  editors check photographs in the album's own form.

## Consequences

- Amends ADR 0039: `soon` holds the album pages and the event pages' past photographs too, so Phase 8's "album
  pages render under either state" no longer holds for their photographs. Amends ADR 0037 (a photo address opens
  nothing while held) and ADR 0024 (past years while held), each noted in place.
- The soon sentence ("the Odunde and Gala pages carry their own photographs") stays true while those pages keep
  their header photographs. If the owner takes those down under D5, the sentence needs rewording; it is the
  owner's copy (Phase 8's spec, Q14).
- Taken by the agent under the owner's request to fix the blockers, as R01's first option. Undoing it is the
  description in `packages/content/src/layout-options.ts` and the one check.
- The purge is soft (ADR 0021): after a publish, each cached page serves its old copy once more while it
  revalidates, so one more visitor to an album page, a photo address, `/odunde` or `/gala` may still see the
  photographs. A hard delete (`dangerouslyDeleteByTag` from `@vercel/functions`) would close that; it needs the
  package as a direct dependency, which is the owner's call.
- `TYPE_ROUTES.galleryPage` includes `/odunde` and `/gala`, so the Presentation tool lists them for the gallery
  singleton.
- The gallery, album page, festival and gala builders each have a test of the hold that fails without it, and the
  album, Odunde and Gala specs read the gallery's state and check the held pages when the dataset holds them.
