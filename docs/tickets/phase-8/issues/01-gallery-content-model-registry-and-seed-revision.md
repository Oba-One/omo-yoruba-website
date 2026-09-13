# 01: The gallery's content model, the registry and the header line's revision

Labels: infra, content
Status: resolved
Blocked by: none

**What to build:** the seams both gallery routes read (spec, "Content model", "The registry", "Queries and
routes"; ADR 0039). An album's year comes from its own date or its edition, and the Studio's Pending view asks
for a year only where neither exists. An album with no photographs, and a photograph whose own credit is
unconfirmed, each have their row. The gallery's policy field is plain text and the unused intro is gone. The
route map sends an edition's and the gallery singleton's publishes to the album pages. The seed revises the
gallery's header line to name the albums that exist.

- [x] `@oy/content`: `creditsAndConsent` as text, `intro` retired (schema and `RETIRED_FIELDS`); the `album.date`
      and layout option descriptions; TypeGen
- [x] The registry: the album's year as a condition row with its named constant; `album.photos[]`; a
      photograph's own credit (condition row, named constant); the album presence row counting albums with a
      photograph; tested
- [x] A pure helper for an album's year and its tile line ("2026 • 43 photographs", the year left out when the
      title carries it) and the gallery's order; tested
- [x] The route map: `galleryPage` reaches `/gallery/[album]`, `event` both gallery routes; Presentation and cache
      tag tests follow
- [x] `galleryPageQuery` and `albumPageQuery` in `@oy/content/queries`; TypeGen
- [x] The seed's header line and its revision; `bun seed -- --dry-run` reports the one revision on `development`,
      then `bun seed`
- [x] `bun check` green

## Comments

13 September 2026. `@oy/content/albums` holds `albumYear` (the album's own date, else its edition's year),
`photographCount`, `albumLine` (the year and the count; the year left out when the title names it as a whole
number, owed when there is none) and `byNewestAlbum`. The registry gains `ALBUM_CREDIT_PENDING` (past years now
reads it instead of finding the row by its condition), `ALBUM_YEAR_PENDING` on the condition row
`!defined(date) && !defined(event->edition)`, `PHOTO_CREDIT_PENDING` and the `album.photos[]` row; the album
presence row counts `count(photos) > 0`. `galleryPage.creditsAndConsent` is a text field titled "Consent
policy", `intro` is gone and retired, and the album's date, edition and photographs and the three layout
options describe themselves in the Studio. The route map: `galleryPage` reaches both gallery routes, `event`
reaches both, and `photographer` no longer reaches `/gallery` (a tile carries no credit); the Presentation and
purge tests read the static routes. `galleryPageQuery` and `albumPageQuery` live in `queries/gallery.ts`.
The seed's dry run found one revision due on `development`; `bun seed` applied it ("1 earlier seed values
revised") and a second dry run finds none. `bun check`: 132 files, 767 tests.
