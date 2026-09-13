# 01: The gallery's content model, the registry and the header line's revision

Labels: infra, content
Status: open
Blocked by: none

**What to build:** the seams both gallery routes read (spec, "Content model", "The registry", "Queries and
routes"; ADR 0039). An album's year comes from its own date or its edition, and the Studio's Pending view asks
for a year only where neither exists. An album with no photographs, and a photograph whose own credit is
unconfirmed, each have their row. The gallery's policy field is plain text and the unused intro is gone. The
route map sends an edition's and the gallery singleton's publishes to the album pages. The seed revises the
gallery's header line to name the albums that exist.

- [ ] `@oy/content`: `creditsAndConsent` as text, `intro` retired (schema and `RETIRED_FIELDS`); the `album.date`
      and layout option descriptions; TypeGen
- [ ] The registry: the album's year as a condition row with its named constant; `album.photos[]`; a
      photograph's own credit (condition row, named constant); the album presence row counting albums with a
      photograph; tested
- [ ] A pure helper for an album's year and its tile line ("2026 • 43 photographs", the year left out when the
      title carries it) and the gallery's order; tested
- [ ] The route map: `galleryPage` reaches `/gallery/[album]`, `event` both gallery routes; Presentation and cache
      tag tests follow
- [ ] `galleryPageQuery` and `albumPageQuery` in `@oy/content/queries`; TypeGen
- [ ] The seed's header line and its revision; `bun seed -- --dry-run` reports the one revision on `development`,
      then `bun seed`
- [ ] `bun check` green
