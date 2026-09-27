# 11: One link between an album and its edition

Labels: infra
Status: open
Blocked by: 09

**What to build:** S9 (spec Q6). The album's link stays; the edition's is retired.

- [ ] Queries find an edition's album through the album's link: the first made that holds a photograph
- [ ] The registry rows; `event.album` in `RETIRED_FIELDS`; the seed
- [ ] The To do's editions query (`studio/todo.ts`, `"photos": count(album->photos)`) reads the album that names the edition, as the site does, so past years' rows keep counting
- [ ] Migrations `album-link` and a generic `retired-fields`
- [ ] `bun check` green; Playwright unchanged in both data modes

## Comments
