# Voice lints run in pre-commit, CI and Sanity from one shared word list

The em dash check and the Yoruba diacritics check encode the voice rules in code:
`packages/lint` runs them on staged files in pre-commit, on the whole repo in CI, and the
same word list (`packages/lint/yoruba-terms.json`) feeds the Sanity validation rules and the
`content-lint` function (Phase 2). Errors in the repo, warnings in the Studio.

## Consequences

- Exemptions live in `.lintignore` at the repo root, not in code. Today: the vendored
  prototypes, design system and Build Brief under `docs/design/design/` (em dashes and the
  older festival spelling; they must stay verbatim), the six companion docs for the
  diacritics check only (they quote bare forms on purpose), the word list and the lint
  package's own fixtures, one third-party skill, and generated files. The owner accepts or
  reverses the handoff carve-out in wayfinder ticket 18.
- The colour literal check limits `packages/web` and `packages/ui` to `var(--*)` tokens.
