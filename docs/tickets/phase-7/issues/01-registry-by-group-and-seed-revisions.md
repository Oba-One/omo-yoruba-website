# 01: Registry rows by group, and seed revisions

Labels: infra
Status: open
Blocked by: none

**What to build:** the two seams the trust pages lean on. A registry row narrowed by a person's group
answers `pendingWhat` and `presenceWhat` the way a row narrowed by an edition's kind does, so Our Story
and Impact can name the board and the staff and volunteers apart. And the seed can revise a value it
wrote earlier: a stored value that still reads exactly as the earlier seed wrote it moves to the new
seed's value, while anything an editor changed stays (spec, "Seed revisions"; ADR 0035).

- [ ] `@oy/content`: `pendingWhat(type, field, kind)` and `presenceWhat(type, kind)` match a row narrowed
      by `group == "…"` as by `kind == "…"`; tested
- [ ] The seed: a revisions list (type, path, the earlier value, the new value or an unset), applied only
      where the stored value deep-equals the earlier value, reported in the dry run; tested on keyed paths
      and on a value an editor changed
- [ ] `bun check` green

## Comments
