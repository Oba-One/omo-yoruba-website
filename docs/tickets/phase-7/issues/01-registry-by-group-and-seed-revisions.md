# 01: Registry rows by group, and seed revisions

Labels: infra
Status: resolved
Blocked by: none

**What to build:** the two seams the trust pages lean on. A registry row narrowed by a person's group
answers `pendingWhat` and `presenceWhat` the way a row narrowed by an edition's kind does, so Our Story
and Impact can name the board and the staff and volunteers apart. And the seed can revise a value it
wrote earlier: a stored value that still reads exactly as the earlier seed wrote it moves to the new
seed's value, while anything an editor changed stays (spec, "Seed revisions"; ADR 0035).

- [x] `@oy/content`: `pendingWhat(type, field, kind)` and `presenceWhat(type, kind)` match a row narrowed
      by `group == "…"` as by `kind == "…"`; tested
- [x] The seed: a revisions list (type, path, the earlier value, the new value or an unset), applied only
      where the stored value deep-equals the earlier value, counted in the dry run and the write log; tested on keyed paths
      and on a value an editor changed
- [x] `bun check` green

## Comments

13 September 2026. `@oy/content`: `rowKinds` reads a row narrowed by an edition's kind or a person's group,
named once (`group == "board"`) or as a list (`group in ["staff", "volunteer"]`), so `pendingWhat` and
`presenceWhat` answer Our Story's groups apart; the one person presence row splits into "the board's names,
roles and bios" and "the staff and volunteers to list". The seed: `SeedRevision` (type, patch path, the
earlier value, the new value or an unset), `buildRevisions(assets)` (empty until the page tickets add
theirs) and `revisedFields`, which moves a stored value only when it deep-equals the earlier value with its
keys in any order, reaching keyed array items; the write log and the dry run count them. Tests: 44 passed
in the two files.
