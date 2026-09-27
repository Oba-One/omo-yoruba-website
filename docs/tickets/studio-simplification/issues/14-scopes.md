# 14: Remove the scopes that show nothing

Labels: infra
Status: resolved
Blocked by: 09

**What to build:** S12 (spec Q8). The Odunde sponsor scope and the partner scopes other than Odunde go.

- [x] The option lists, Presentation and tests
- [x] Migration `scopes`
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

27 September 2026. Built on `studio/one-control` (pull request C). The scope lists live in a plain module
(`src/scopes.ts`) that the schema and the migration read: a sponsor level is the Gala's or the
organization's, and a partner's only scope is the Odunde page (Impact lists every partner whatever its
scope). The Presentation banner for Odunde levels goes, and so does the input that hid retired choices,
which nothing else used. Migration `scopes`: a partner keeps only its Odunde scope (none left unsets the
field); an Odunde sponsor level waits for the owner. `development` holds no partners or sponsor levels, so
the dry run moves nothing.
