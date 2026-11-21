# Repository adapter: Omo Yorùbá of Southern California website

The kit skills (review, debug, plan, ship, research) keep the method; this file holds what is specific to this repository. Each skill reads its own section plus `## checks`. `AGENTS.md` owns the rules; where it says more, follow it.

## checks

### Guide
`AGENTS.md` § Commands and § Merging; `.agents/merge-policy.json` for tiers and required checks.

### Base
The live PR base, else `origin/main`. `main` is the only long-lived branch, and every merge into it is a production deploy on Vercel.

### Command rules
`bun run test` and `bun run build`, never `bun test` or `bun build` (Bun's own runner and bundler). From a worktree with no `packages/web/.env`, write one holding `PUBLIC_SANITY_PROJECT_ID=placeholder` and `PUBLIC_SANITY_DATASET=development` (CI's values) before `bun run check`, `bun run build` or a push. Run one heavy step at a time (install, build, Playwright, Storybook).

### Selector
none: pick the tier by hand from Tiers and the paths in `.agents/merge-policy.json`.

### Tiers
| Tier | Use | Command |
|---|---|---|
| targeted | the smallest proof of one changed behavior | `bunx vitest related --run <path>` |
| style | path-scoped, non-mutating format and lint | `bunx biome check <path> && bun packages/lint/src/cli.ts all <path>` |
| checkpoint | a coherent cross-package batch or shared-interface change | `bun run check` |
| push | ready-for-CI gate on the committed tree before a push | `bun run check` |
| readiness | explicit production-readiness review; non-mutating full local gate | `bun run check && bun run build && bun e2e` |
| full | explicit full local gate or pre-release | `bun run check && bun run build && bun e2e` |
| release | release gate | none: a merge into `main` is the release |

### Conditional checks
- shell scripts, hooks or their fixtures → `bash scripts/tests/<name>.test.sh` (all of them run in CI's Shell scripts job)
- the Sanity schema → `bun typegen`, then commit `packages/content/schema.json` and `sanity.types.ts`
- a page or component a visitor sees → `bun e2e`, and captures at 375 and 1280 wide
- `package.json` or `bun.lock` → `bun run check:audit`

### Criticality
`.agents/merge-policy.json` names the paths. Critical (enquiry and form handling, the dataset, CSP, the link and Zeffy guards, deploy config, CI): the full tier plus an adversarial review by a fresh agent, then afo merges. Sensitive (schema, queries, routes, the Pending registry, migrations, agent config): the push tier plus an adversarial review by a fresh agent. Routine: the targeted tier.

### CI
GitHub Actions, `.github/workflows/ci.yml` and `agents-doctor.yml`. Every job there is a required check (`.agents/merge-policy.json` `requiredChecks`). CI owns Playwright with axe on a clean runner, the Storybook build, and TypeGen drift; the Vercel preview and Lighthouse run on GitHub's deployment events.

### Rendered proof
Captures at 375 and 1280 wide, labeled with the route and width, for any visible change. `/admin` needs a signed-in Sanity session; agents have none, so Studio claims rest on the Sanity package's labels and the Studio's own tests.

## review

### Scopes
web → `packages/web/**`; ui → `packages/ui/**`; content → `packages/content/**`; tokens → `packages/tokens/**`; lint → `packages/lint/**`; ci → `.github/**`, `scripts/**`

### Special scopes
none

### Dependency order
`@oy/lint` → `@oy/tokens` → `@oy/content` → `@oy/ui` → `@oy/web`

### Requirement sources
The PR body; ADRs in `docs/adr/`; `CONTEXT.md` for vocabulary; `docs/design/README.md` for the brief.

### Invariants
`AGENTS.md` § Rules that lint cannot catch, and its rule and enforcer table. Never invent content: empty renders Pending, and every required field is in `packages/content/src/pending.ts`.

### Quality bar
`AGENTS.md` § Working rules.

### Architecture guide
`docs/adr/` (one decision per file) and `CONTEXT.md`.

### State lens
Triggers: enquiry actions, the Zeffy dialogs, the Lightbox, draft sessions. Rules: `docs/adr/`.

### Critical lenses
enquiry and form handling → personal data: nothing logged or echoed, a write lands only in a private dataset; link and Zeffy guards → no stored value opens another site or frames another origin; CSP → every new origin is justified; deploy config → the build still refuses a public dataset.

### Test budget
none

### Deep pass
A fresh agent with the diff and the critical lens, briefed without the author's conclusion.

### Gap shapes
A page edited in `packages/web/src/pages` but not in its `packages/ui/src/pages/*/sections.ts` story twin; a schema field missing from `pending.ts`; copy with bare Yoruba words or an em dash.

### Not findings
Pending chips on a field the owner has not filled; the dataset named `development` serving production (decision D3).

### Immutable records
`docs/adr/*.md` (a change is a new ADR that supersedes).

### Tracker
`docs/agents/issue-tracker.md`.

## debug

### Context
`AGENTS.md`, `docs/runbook.md`, `CONTEXT.md`.

### Reporters
The owner (afo) and org members who edit content in the Studio.

### Safety
Never print, copy or log enquiry or subscriber content. Nothing writes to the live dataset or the live site without the owner's say. The Viewer token reads; the Editor token is the owner's.

### Real surface
`https://www.omoyorubasocal.org` (production, reads the private `development` dataset); `/admin` for the Studio.

### Layers
Astro page or action → `@oy/ui` component → GROQ in `@oy/content` → Sanity dataset; Sanity Functions for notices and content lint.

### Data path
page → `packages/web/src/lib/sanity/load-query.ts` → `packages/content/src/queries/` → dataset; enquiry → `packages/web/src/actions` → `lib/forms/handlers.ts` → dataset → `enquiry-notify` Function → Resend.

### Environment truth
Sanity project `qsya7q8x`, datasets `development` (live content) and `production` (empty), both private; Vercel project `omo-yoruba`; `docs/runbook.md` § Hosting today.

### Boundary probes
Sanity: `bun run --filter @oy/content query -- '<GROQ>' --dataset development` (counts only, never enquiry fields).

### Known errors
"PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are required" → the worktree has no `packages/web/.env` (Command rules).

### UI gotchas
`docs/runbook.md` § Local; an edited `@oy/ui` scoped stylesheet can stay stale in `astro dev` until a restart.

### Known symptoms
| Symptom | Likely cause | Diagnostic |
|---|---|---|
| Every page shows Pending | no Viewer token, or the dataset is private and unread | check `SANITY_API_READ_TOKEN` in the scope |
| A publish does not show | soft purge serves one stale copy | request twice within the minute |

### Evidence map
routes → `packages/content/src/routes.ts`; cache tags → same; CSP → `packages/web/src/lib/csp.ts`; Functions → `packages/content/functions/`.

### Telemetry
PostHog (pageviews only, no autocapture); Vercel function logs for `[csp-report]`.

### Known-failure notes
`docs/runbook.md`, in the section the failure belongs to.

### Slices
none

### Tracker
`docs/agents/issue-tracker.md`.

## plan

### Context
`AGENTS.md`, `CONTEXT.md`, `docs/adr/`.

### Quality bar
`AGENTS.md` § Working rules.

### Priorities
Legitimacy for grant reviewers → joining → the festival and gala funnels.

### Design sections
Content: which fields are new, their Pending entries, and who fills them.

### Architecture guide
`docs/adr/`

### Seam registry
none

### Plan location
none: a plan lives in the session or the PR body, not in the repository.

### Plan files
none

### Lanes and proof
none

### Dependency order
schema → TypeGen → queries → components → pages

### Always-separate
A schema change and a stored-content migration; a dependency bump and a feature.

### Plan triggers
A schema change, a migration, a new page, anything in the critical tier.

### Start gate
none

### Tracker mirror
none

### Closeout
Merge on the tier's proof, record it in the PR body.

### Lifecycle
none

### Templates
none

### Teams
none

## ship

### Branch check
none; branches are named `<type>/<slug>` by convention.

### Protected branches
`main`

### PR issue line
none

### Hooks
lefthook: pre-commit runs Biome, the voice and colour checks, a typecheck of touched packages and `vitest related`; pre-push runs `bun run check`; commit-msg checks a conventional subject with no em dash.

### Commit format
Conventional commits (`type(scope): subject`), checked by `packages/lint/src/cli.ts commit-msg` and `scripts/check-commits.sh` in CI.

### Push gate
The pre-push `bun run check`; CI runs the rest.

### PR
`.github/pull_request_template.md`: Why, Measured, Verification (with the tier and its proof), Not verified.

### Merge
`.agents/merge-policy.json`: squash, `gh pr merge <n> --squash --match-head-commit <sha>`. Critical waits for afo.

### After merge
none

### Report line
The deploy: the Vercel production status on the merge commit.

### Unattended
Dependabot action bumps only; anything in the critical tier waits for afo.

## research

### Plan entry point
none

### Neighbor skills
content questions → `oy-content-model`, `oy-content-ops`; copy → `oy-voice`; styling → `oy-design-system`

### Durable evidence
`docs/research/<topic>.md`, one verified library fact per file, with sources.

### Mapping workflow
none

### Tracker
`docs/agents/issue-tracker.md`
