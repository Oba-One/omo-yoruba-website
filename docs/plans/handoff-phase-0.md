# Handoff: Phase 0, bootstrap and agent docs

Written 4 September 2026 at the end of the Phase 0 session, for the session that reviews
Phase 0 and then runs Phase 1 (`docs/design/PROMPTS.md`). Branch: `phase-0/bootstrap`.

## What exists now

- Bun workspace with `packages/web` (Astro 7.3.1, `@astrojs/vercel`, `output: 'server'`,
  `astro:env` schema, PostHog behind `PUBLIC_POSTHOG_KEY`, CSP as a report-only header),
  `packages/storybook` (empty, Phase 1), `packages/tokens`, `packages/ui`, `packages/content`
  (scaffolds) and `packages/lint` (working checks with tests).
- Agent docs: `CLAUDE.md`, `CONTEXT.md`, ADRs 0001 to 0011 in `docs/adr/`, seven repo
  skills in `.claude/skills/oy-*`, `.mcp.json` (Sanity MCP), `docs/runbook.md` stub,
  `docs/agents/` (tracker and domain docs).
- Quality gates: `biome.json`, `lefthook.yml` (pre-commit, pre-push, commit-msg),
  `.lintignore` (the only place lint exemptions live), `.github/workflows/ci.yml` (cached
  install, `bun run check`, build). `bun run check` is green; the build produces
  `.vercel/output`.
- Plan: `docs/plans/wayfinder.md` with 25 decision tickets in `docs/tickets/wayfinder/issues/`.
- Research with sources: `docs/research/` (versions, Astro 7 facts, Biome, lefthook, PostHog).
- Wizard: `scripts/setup-wizard.sh` (seven stages; not run).

## What the code review changed

The Phase 0 code review (ten finder angles, verified, plus a sweep) found 55 candidates;
about 35 were fixed before the commit. The ones a future session should know about: the
voice lint no longer masks hyphenated or slash-separated prose, sentence-final prose-only
terms or attribute copy; the colour check understands token-based colour functions,
fragments, selectors, modern colour spaces and named colours; the CLI is anchored to the
repo root and reports read errors; commit messages allow autosquash prefixes and ignore the
verbose diff; the pre-commit hook runs Biome before the parallel checks and skips merges
and rebases; CI has a dependency cache, read-only token permissions and no cancel on main;
the middleware tolerates immutable responses; the CSP report endpoint is bounded; the
wizard resolves the repo root, never pushes empty values, confirms before overwriting
Vercel, and keeps the Resend key out of the web app's env file. Findings left open on
purpose: the 39 MB of original photographs under `docs/design/design/images` (owner call),
Lighthouse in CI (needs the preview URL, Phase 4), and nonces or hashes for inline styles
(Phase 9, ADR 0011).

## Layout change after the first commit

On the owner's instruction the apps moved under `packages/` (`packages/web`,
`packages/storybook`), matching the green-goods repo. ADR 0003, `CLAUDE.md`, the wizard,
the runbook and the lint scope were updated; `packages/web/vercel.json` pins the Vercel
settings for that root directory. The handoff docs under `docs/design/` still describe an
`apps/` split; the repo wins.

## GitHub Actions

`ci.yml` has four jobs (check, build with a JS size summary, commit message rules on pull
requests, shellcheck), all safe to require in branch protection; `audit.yml` runs `bun audit`
weekly; Dependabot keeps the SHA-pinned actions current; a PR template carries the
validation checklist. Shape borrowed from green-goods: a composite `setup-js` action and
SHA pins. The GitHub repo exists at Oba-One/omo-yoruba-website (public, no branch
protection yet; the runbook has the command).

## What is stubbed or deliberately deferred

- `bun storybook`, `bun typegen`, `bun seed`, `bun e2e` print a pointer and exit 1 until
  their phase lands. `bun run build` and `bun run test` need the `run` word: `bun build` and
  `bun test` are Bun built-ins.
- Every `astro:env` variable is optional so the repo builds before the wizard runs; Phase 2
  should make the Sanity variables required. Public values are inlined at build time.
- `security.csp` is off; the policy is a report-only header (ADR 0011). The `/api/csp-report`
  endpoint logs to the function log only.
- `packages/ui` typechecks with `tsc` against a placeholder `src/index.ts`; Phase 1 switches
  it to `astro check` when the first `.astro` component lands. `packages/ui` and
  `packages/content` already have Vitest projects (empty, `passWithNoTests`).
- Casing lint (Title Case warning) and the GROQ content scan wait for Phase 2 fixtures and
  content. Playwright, Lighthouse, Chromatic and the typegen drift step are listed at the
  top of `ci.yml` with their phases.
- The `setup-pre-commit` skill the pre-step installed was removed: it installs Husky,
  lint-staged and Prettier, which contradicts lefthook and Biome. `git-guardrails-claude-code`
  stays; its hook copy in `.claude/hooks/` fails closed when the payload cannot be parsed,
  and on the owner's instruction (5 September 2026) it allows plain pushes and blocks only
  forced ones.
- The Sanity MCP server needs OAuth on first use; the `sanity` plugin's own MCP entry also
  shows as unauthenticated in this session.

## Deviations to know about

- The Matt Pocock plugin was not in the local marketplace snapshot; the marketplace was
  refreshed and the plugin installed at user scope. Its slash commands were not loaded in
  the Phase 0 session, so `/setup-matt-pocock-skills`, `/wayfinder`, `/tdd`, `/research`,
  `/wizard` and `/handoff` were followed by reading the skill files directly. They are
  available as commands from the next session.
- `.lintignore` excludes `docs/design/design/` (prototypes, design system, Build Brief) from
  every check and the six companion docs from the diacritics check only. Owner accepts or
  reverses in ticket 18.
- The wizard library from the `wizard` skill template carries one documented change:
  `tput dim` tolerates terminals without that capability.
- `mise` refuses the repo's `.mise.toml` until `mise trust` is run; the session used the
  Node 22 install path directly.

## Owner decisions waiting

The frontier table in `docs/plans/wayfinder.md`. Before Phase 1: tickets 12 (org and
Vercel team), 17 (run the wizard), 18 (lint carve-out), 11 (Storybook hosting), and
whether the 39 MB of original photographs stay in git (the seed reads only `w2/`).

## Suggested skills for the next session

`/to-tickets` for Phase 1, then `/implement` per ticket; `research` for
`@storybook-astro/framework` limits and `astro:fonts` subsets (ticket 19); repo skills
`oy-design-system`, `oy-component`, `oy-voice`; `/code-review` before the commit;
`/handoff` at the end.
