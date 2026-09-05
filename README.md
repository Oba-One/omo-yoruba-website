# Omo Yorùbá of Southern California

Website for Omo Yorùbá of Southern California, a 501(c)(3) founded in 1997 in Los
Angeles that keeps Yoruba language, culture and community alive in Southern
California. Astro 7 on Vercel, Sanity Studio at `/admin`, Storybook, Bun workspaces.

- New here or an agent session: read `CLAUDE.md`, then `CONTEXT.md`.
- Design handoff and prototypes: `docs/design/`.
- Decisions: `docs/adr/`. Plan: `docs/plans/wayfinder.md`. Ops: `docs/runbook.md`.

## Commands

```bash
bun install      # also installs the git hooks
bun dev          # Astro dev server (packages/web)
bun check        # typecheck + lint + unit tests
bun run test     # unit tests only (bun test is Bun's own runner, not Vitest)
bun run build    # production build of packages/web (bun build is Bun's bundler)
```

CI runs the same check, the build, the commit message rules and shellcheck on every pull
request (`.github/workflows/ci.yml`); a weekly `bun audit` runs on Mondays.

Node 22 (`.node-version`, `.mise.toml`) and Bun 1.3 (`packageManager`).

## First-time setup for the owner

```bash
bash scripts/setup-wizard.sh
```

The wizard walks through the steps only a person can do: the Sanity project and
tokens, the Vercel project and its environment variables, Resend, PostHog and
Chromatic.
