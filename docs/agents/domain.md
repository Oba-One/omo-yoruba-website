# Domain docs

How the engineering skills consume this repo's domain documentation when
exploring the codebase. Layout: single-context.

## Before exploring, read these

- `CONTEXT.md` at the repo root: the shared vocabulary.
- `docs/adr/`: read the ADRs that touch the area you are about to work in.
- `docs/design/`: the design handoff. `README.md` there is the brief; the five
  companion docs are the specs each phase builds from.

If a file does not exist yet, proceed silently. `/grill-with-docs` and
`/domain-modeling` create terms and ADRs lazily when they are resolved.

## Use the glossary's vocabulary

When your output names a domain concept (a ticket title, a component prop, a
schema field, a test name), use the term as defined in `CONTEXT.md`. Do not
drift to the synonyms it tells you to avoid.

If the concept you need is not in the glossary yet, that is a signal: either you
are inventing language the project does not use (reconsider) or there is a real
gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, say so explicitly rather than
silently overriding:

> Contradicts ADR-0002 (all components as `.astro`), but worth reopening because...

Some conflicts are the owner's to settle: see the Storybook pivot rule in
`CLAUDE.md`.
