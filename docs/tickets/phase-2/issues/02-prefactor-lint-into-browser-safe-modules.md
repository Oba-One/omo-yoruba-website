# 02: Prefactor @oy/lint into browser-safe modules and add the proper nouns list

Labels: infra
Status: resolved
Blocked by: none

**What to build:** the em dash and diacritics checks importable by the browser Studio and by a
Sanity Function without pulling in `node:fs`: the file loader moves out of the pure module, the
package exports `./em-dash`, `./yoruba`, `./sentence-case`, `./yoruba-terms.json` and
`./proper-nouns.json`, and a new sentence case check (Title Case with more than two capitalised
words outside the glossary and the proper nouns) exists with tests, so the Studio warning, the
Function and a later CLI check share one implementation.

- [x] `bun run test` passes for `@oy/lint`, the CLI behaves as before
- [x] `findDashes`, `findBareTerms` and `findTitleCase` import with no Node built-ins
- [x] `proper-nouns.json` lists the organisation, place and program names the check ignores
