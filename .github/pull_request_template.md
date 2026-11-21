## Why

What problem this solves, in one or two sentences. Name the ticket or decision when there is one.

## Measured

The numbers or observations that show the problem, and what changed.

- Agent: <agent>, model <model>, effort <effort>

<!-- An agent fills the line above with what `~/.agents/evals/bin/agent-model --pr` prints, read from its own session log; `dev evals scoreboard` reads it. Leave it out for work no agent made. -->

## Verification

Tier: <critical | sensitive | routine>, from the paths in `.agents/merge-policy.json`. The proof that tier asks for, with commands and results:

- routine: the targeted check (`bunx vitest related --run <path>`, or the narrowest command that exercises the change) and CI green
- sensitive: `bun run check` and an adversarial review by a fresh agent, findings addressed
- critical: `bun run check`, `bun run build` and `bun e2e` (CI green on the head), and an adversarial review by a fresh agent, findings addressed; afo merges

- [ ] `bun run check` passes: typecheck, Biome, em dash, Yoruba diacritics, colour literals, unit tests, toolchain pins
- [ ] `bun run build` passes
- [ ] New or changed UI lives in `packages/ui` with a story: Default, each variant, Pending, OnDark where it applies
- [ ] No invented content: empty fields render Pending; every fact is on the confirmed list
- [ ] Copy follows the `oy-voice` skill: sentence case, marks on Yoruba words, no em dashes, glyphs limited to • → ✓ ×
- [ ] `CLAUDE.md`, `CONTEXT.md`, the ADRs and `docs/runbook.md` still describe the system as built

## Not verified

What was not checked, and why.
