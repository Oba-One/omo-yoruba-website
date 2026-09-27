# Omo Yorùbá of Southern California

The website of Omo Yorùbá of Southern California, a 501(c)(3) founded in 1997 in Los Angeles.
The site has three jobs, in this order:

1. Prove legitimacy and impact to a grant reviewer in under two minutes.
2. Make joining obvious.
3. Run the vendor, sponsor and ticket funnels for the Odunde Festival (June, Leimert Park) and the
   End-of-Year Gala (November or December).

The owner and members of the organization add photos, news and events in the Sanity Studio, which
the site embeds at `/admin`. The stack is Astro 7 on Vercel, Sanity, Storybook and Bun workspaces.

## Get it running

1. Use Node 22 and Bun 1.4. `.mise.toml`, `.node-version` and `packageManager` pin them; with mise,
   run `mise trust` once, then `mise install`.
2. Run `bun install`. It installs every workspace and the git hooks.
3. Put the environment in `packages/web/.env`. The owner's setup wizard,
   `bash scripts/setup-wizard.sh`, walks through the steps only a person can do (Sanity, Vercel,
   Resend, PostHog, Chromatic) and writes the file. Otherwise copy `packages/web/.env.example` and
   fill it in. The site needs `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. The content
   lives in the private `development` dataset: give the wizard `development` when it asks (its
   default, `production`, is empty until decision D3), and without the Viewer token
   (`SANITY_API_READ_TOKEN`) every page shows its Pending chips.
4. Run `bun dev` and open http://localhost:4321. The Studio is at http://localhost:4321/admin: sign
   in with a Sanity account that belongs to the project.

## Everyday commands

From the repo root:

| Command | Does |
| --- | --- |
| `bun dev` | the site and the Studio on port 4321 |
| `bun storybook` | the component library on port 6006 |
| `bun run test` | the unit tests (Vitest) |
| `bun check` | typecheck, lint, unit tests and the toolchain pins; the pre-push hook runs it |
| `bun run build` | the production build of `packages/web` |
| `bun e2e` | the Playwright and axe suite |
| `bun typegen` | the Sanity types after a schema or query change; commit what it writes |

`bun test` and `bun build` are Bun's own test runner and bundler, which is why the repo uses
`bun run test` and `bun run build`. Every other command is in [AGENTS.md](AGENTS.md).

## Where to read next

- [AGENTS.md](AGENTS.md): the rules, every command and where things live, for people and coding
  agents alike. [CLAUDE.md](CLAUDE.md) imports it for Claude Code.
- [docs/runbook.md](docs/runbook.md): environments, deploys, the Studio and preview, the webhook,
  the seed, migrations and CI.
- [CONTEXT.md](CONTEXT.md): the words the code, the Studio and the copy share.
- [docs/adr/](docs/adr/): the decisions, one file each, with the reasons.
- [docs/plans/wayfinder.md](docs/plans/wayfinder.md): the map of the work and the owner's open
  decisions.
- [DESIGN.md](DESIGN.md): the visual system in one file, the tokens, type, layout, components and
  rules, in Google's DESIGN.md format.
- [docs/design/](docs/design/): the design handoff (the brief, the specs and the prototypes), kept
  frozen as the reference.
- The packages: [web](packages/web/README.md), [content](packages/content/README.md),
  [ui](packages/ui/README.md), [tokens](packages/tokens/README.md) and
  [lint](packages/lint/README.md).

## Contributing

- Work on a branch and open a pull request: `main` takes changes only through one whose checks
  pass. CI runs the check, the build, TypeGen drift, the Storybook build, Playwright and axe, and
  the commit message and shell script checks (runbook, CI and merging).
- Write conventional commit messages, `type(scope): summary`, such as `docs(readme): shorter setup`.
  The commit-msg hook checks each one, and CI checks the pull request title too.
- No em dashes anywhere: code, comments, copy, docs and commit messages. Use a comma, a colon or a
  new sentence. No emoji.
- Yoruba words keep their full marks. Headings and buttons use sentence case.
- Never invent content (dates, prices, figures, names, quotes): an empty field renders Pending.

The rest of the rules are in [AGENTS.md](AGENTS.md).
