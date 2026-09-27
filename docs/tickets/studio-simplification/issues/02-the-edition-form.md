# 02: The edition form by kind

Labels: infra
Status: resolved
Blocked by: 01

**What to build:** S1 (spec Q5, Q10). Each kind's form shows what its page reads; a starting template per kind; a Collective event needs no year; `other` leaves new documents. Nothing stored changes.

- [x] `edition-fields.ts`: kind titles, the per-kind field matrix, the retired kind
- [x] `summary` in the Edition tab; per-kind `hidden`; no check on a hidden input (the year included)
- [x] Templates for festival, Gala and Collective events; the kind lists preset their kind; no Other list
- [x] A retired choice stays visible only on a document that holds it
- [x] Tests for the matrix, the year rule and the templates
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/simplify`. From the code review: a Collective event's year and album now hide always (shown only while filled, an input vanished the moment a member cleared it), and the hero image is simply hidden, outside the matrix. Sanity checks hidden inputs, so the year rule's own hidden test gave way to `skipValidationWhenHidden` for every rule and built-in check in the schema; `validation/rules.test.ts` proves it with Sanity's validator, a Collective event with a hidden year, schedule and unpublished album reporting nothing. Agents writing through the Sanity MCP server set `kind` themselves; the recipes say so. Checks at the part 4 pull request: `bun run test` 147 files and 898 tests, typecheck clean, `bun typegen` no diff, `bun run build` green; Playwright with `--workers=1` seeded 281 passed and 11 skipped, placeholder 254 passed and 38 skipped, both equal to `main`.
