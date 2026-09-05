# @oy/lint

The voice and colour checks that tooling cannot do for us, plus the shared word
list. Run from the repo root: `bun lint:dash`, `bun lint:yoruba`,
`bun lint:colors` (each accepts file paths, which is how lefthook passes staged
files). `yoruba-terms.json` is the one word list shared with the Sanity
validation rules and the `content-lint` function (Phase 2). Rules and
exemptions: `docs/design/QUALITY.md` section 1.
