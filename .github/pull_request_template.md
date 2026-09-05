## Summary

- What changed and why

## Ticket

- `docs/tickets/<effort>/issues/NN-slug.md`, or the wayfinder ticket number. Remove this section when none applies.

## Validation

- [ ] `bun run check` passes: typecheck, Biome, em dash, Yoruba diacritics, colour literals, unit tests, toolchain pins
- [ ] `bun run build` passes
- [ ] New or changed UI lives in `packages/ui` with a story: Default, each variant, Pending, OnDark where it applies
- [ ] No invented content: empty fields render Pending; every fact is on the confirmed list
- [ ] Copy follows the `oy-voice` skill: sentence case, marks on Yoruba words, no em dashes, glyphs limited to • → ✓ ×
- [ ] `CLAUDE.md`, `CONTEXT.md`, the ADRs and `docs/runbook.md` still describe the system as built
