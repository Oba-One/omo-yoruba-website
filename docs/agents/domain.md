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

<!-- shared-engineering:begin -->
## Applying shared engineering guidance

Use `pragmatic-programming` for coding work and `domain-driven-design` for semantic
or behavioral changes, following discovery and fallback instructions in root
`AGENTS.md`. Preserve this repo's single-context layout. A new field or form does
not require a new bounded context, service, aggregate hierarchy, or event store.

For the affected behavior, identify its canonical terms, owner, and a concrete
success or rejection example. Follow `oy-content-model` for schema and query changes:
edition-specific facts belong to the edition, required launch facts use the Pending
registry, and enquiry shapes derive from the one enquiry-kinds specification.
Distinguish an enquiry from a subscriber and a money handoff from a locally confirmed
payment. Preserve the existing next-edition and confirmed-fact rules.

Keep shared knowledge in its existing source, use typed functions and schemas where
sufficient, and test the actual changed rule or integration boundary. Update glossary
terms and consequential ADRs through the existing domain workflow; regenerate types
or other projections only through their owning commands. Routine visual changes
that preserve meaning continue through their normal UI workflow.
<!-- shared-engineering:end -->
