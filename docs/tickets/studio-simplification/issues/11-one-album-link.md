# 11: One link between an album and its edition

Labels: infra
Status: resolved
Blocked by: 09

**What to build:** S9 (spec Q6). The album's link stays; the edition's is retired.

- [x] Queries find an edition's album through the album's link: the first made that holds a photograph
- [x] The registry rows; `event.album` in `RETIRED_FIELDS`; the seed
- [x] The To do's editions query (`studio/todo.ts`, `"photos": count(album->photos)`) reads the album that names the edition, as the site does, so past years' rows keep counting
- [x] Migrations `album-link` and a generic `retired-fields`
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/restructure` (pull request B). The festival and Gala pages and
Impact read an edition's album as the first album made that names it and holds a photograph; the gallery
and the album page read only the album's own link. The edition loses its Album input, `event.album` joins
`RETIRED_FIELDS`, the seed's editions no longer name their albums (its albums always named their
editions), the registry's past-years rows ask for an edition an album with photographs names, the album
year row reads only the album's edition, and the To do counts an edition's photographs through the albums
that name it. `album-link` moves a link found only on the edition onto the album and drops the edition's
own; an album naming another edition, or named by two, is left to the owner. `retired-fields` leaves
`event.album` alone and reports it until `album-link` has run. On `development` both albums already name
their editions, so the dry run drops the two editions' links and moves nothing. Order on the migration
day: deploy, then `album-link`, then `retired-fields`.
