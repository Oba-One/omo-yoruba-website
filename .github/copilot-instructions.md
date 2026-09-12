# Copilot instructions

`AGENTS.md` is the source of truth for this repository. Read it before suggesting or
reviewing changes, and do not introduce a second rule system here.

Repo-wide invariants, in short:

- Bun for scripts and installs. `bun run test` and `bun run build`, never `bun test` or
  `bun build`.
- No em dashes anywhere, no emoji, glyphs limited to • → ✓ ×. Sentence case for headings
  and buttons. Full marks on every Yoruba word.
- Colours come from `@oy/tokens` only. Components are `.astro` files in `packages/ui`,
  each with a story. Pages in `packages/web` own no component styling.
- Never invent content: an empty field renders Pending.
- Pull requests need every required CI check green (the list is in `docs/runbook.md`, CI and
  merging). Review feedback should cite the rule in `AGENTS.md` or the ADR it comes from.
