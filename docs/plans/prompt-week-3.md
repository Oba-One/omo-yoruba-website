# Prompt: week 3, the member guide, real content and the first member test

Written 27 September 2026, at the end of the weeks 1 and 2 session (`docs/plans/handoff-weeks-1-2.md`). Paste into a
fresh session at the repo root on `main`, after `git pull`. Everything from weeks 1 and 2 has merged, and both
migration days ran on 27 September. It runs week 3 of `docs/plans/four-week-plan.md`: the organization meets in the
week of 12 October, content freezes on Thursday 8 October, and one member does the common tasks unaided before then.

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-weeks-1-2.md, docs/plans/open-work.md, docs/plans/wayfinder.md,
docs/plans/four-week-plan.md (weeks 3 and 4), the "Triage" section of docs/plans/review-alignment-and-quality.md,
docs/runbook.md (Migrations; Studio, preview and Visual Editing), ADRs 0042 to 0044, and the oy-content-ops,
oy-release, oy-content-model and oy-voice skills. If the Zeffy pull request (branch `feat/zeffy-embed`) is still
open, read it and its ADR.

The goal for the week:
- A member can add an edition, an album with its credits and consent, a person and a news post, and clear a to-do
  item, with `docs/content-ops.md` and without help.
- Real content goes in through the Sanity MCP (the claude.ai connector writes as the owner), the organization's
  facts first, into `development` (D3).
- The owner's open decisions are asked, one at a time, each with a recommendation.

Every rule in AGENTS.md holds: never invent content, Pending for every empty required field, one gold action per
screen view, full diacritics, no em dashes, no emoji. Review each diff with /code-review before its commit, open a
pull request per part, and merge only when the owner says so in this session. Never apply a migration without the
owner. Update docs/plans/open-work.md in the same pull request as each item lands.

## Part 1: finish the Studio work

- **The page lists' reference reads.** Pull request 13's queries read both the old documents and the new page
  lists, for one deploy. Its migrations ran on 27 September, so the old reads can go: one small pull request,
  with the queries, TypeGen, the builders' tests and the seeded specs of the pages it touches.
- **The schema deploy.** Ask whether the owner ran it (`bunx sanity login`, then `bun run --filter @oy/content
  sanity -- schema deploy`); the project's Editor token cannot. The Sanity connector's `list_workspace_schemas`
  shows the deployed schema. It must run again after the credit link change (ADR 0046) merges: on 28 September
  the deployed `photographer` had no Link, so an agent reading it would leave a photographer's page out.
- **`production` private (D3).** Ask whether the owner changed its visibility; the connector's `list_datasets`
  shows each dataset's ACL. Then correct the runbook's "Hosting today".
- **The migration snapshots** in `~/omo-yoruba-exports`: delete them once the owner says the site looks right.

## Part 2: the member guide and the recipes

Write `docs/content-ops.md` for members, for the Studio as it is: an event edition prepared as drafts and published
on its announce day, an album with its credits, consent note and photographs, a person, a news post (there is no
News page before launch, D22, but the homepage's news card shows posts), a to-do item cleared, when to ask for help,
and what never to do (the held-back switches, deleting, anything under Settings). Add screenshots as an Editor and
as an administrator; the owner invites an Editor account first (open-work, D4). Then refresh the `oy-content-ops`
and `oy-release` skills to match. The guide says what the gallery's Coming soon switch does and does not do
(ADR 0043), for the day consent is ever withdrawn (D5 has consent today).

## Part 3: roles, preview host and real content

- The roles the owner chose (ADR 0042): check the member view with the Editor account.
- The preview host, if D15 says yes (runbook).
- E1: prove that a publish purges a page, with the runbook's signed probe; never print a secret.
- E19: add what the owner sends, C1 to C3 first, through the oy-content-ops recipes. Nothing invented; the owner
  confirms each fact. C3's credits are done (28 September, ADR 0046); it still wants the consent policy in the
  owner's words, the summer camp's year, the captions and the header line. The claude.ai Sanity connector is
  signed in as the owner and writes (below), so this does not wait for the project's own Sanity MCP (`/mcp`).
- The member test: one or two members do the common tasks with the guide while the owner watches. Ticket every place
  a member stalled under `docs/tickets/`, one ticket each.

## Part 4: the owner's decisions

Ask one at a time, each with your recommendation and today's default:
- **Giving (decided: Zeffy, embedded, 27 September):** once the owner's Zeffy form exists, confirm how it handles
  fees, receipts and monthly giving (C12), then the dialog copy the Zeffy pull request held back (review R38).
- **The review's owner tickets:** R47 (a reopened form keeps what was typed?), R110 (what the 17px floor covers),
  R142 (require TypeGen drift and Playwright and axe), R143 (the advisories to accept).
- **D2, D7, D11, D15** as the owner wants.

## Part 5: the review's ready groups, as time allows

One small pull request each, from `main`, with /implement and the tdd skill, a test that fails first: contrast and
type (R12, R37, R42, R49, R50); the dialogs (R46 and the scrim half of R47; R45 is in the Zeffy pull request); the
latent layouts (R15, R21); Storybook's page root (R48); the guardrail hook (R144, which the owner reviews); and R85,
now that pull request 13 has landed.

## What these weeks learned

- **Migrations.** The runbook's Migrations section worked as written on 27 September: export, rehearse on the
  export, dry-run live, merge, wait for the production deploy (`gh api repos/<owner>/<repo>/deployments?sha=<sha>`
  and its statuses), apply at once, re-plan, and run the seeded specs of the changed pages before and after.
  `retired-fields` reports its wait for `album-link` or `one-control` as blocked, by design.
- **Stacked pull requests.** The branch protection is strict, so a pull request must contain `main` to merge, and
  base branches are not deleted on merge: retarget the next one with `gh pr edit N --base main`, merge `main` into
  it and push. `git merge-tree --write-tree --name-only A B` previews the conflicts without touching the tree.
  `sanity.types.ts` conflicts resolve by `bun typegen`.
- **lefthook** hides the unstaged half of a partially staged file during pre-commit while other files keep their
  unstaged changes, so a commit that stages half a file can fail a typecheck the tree passes: commit whole files.
- **Draft mode** needs the signed session (ADR 0044). The e2e signs one with the Viewer token parsed from
  `packages/web/.env` (`READ_TOKEN` in `packages/web/e2e/helpers.ts`); the Playwright process does not load that
  file itself.
- **Known flakes:** the first axe test after a cold dev server (Vite reloads the page), and pull request 10's
  footer-trigger test in placeholder mode (one extra page load, once in four runs). Rerun before chasing either.
- **Access:** the Vercel MCP cannot list the project's environment variables (403), but the owner's signed-in
  Vercel CLI can (`vercel env ls` in `packages/web`). The claude.ai Sanity connector is signed in as the owner: it
  reads datasets and deployed schemas, and it writes, `patch_documents` saving drafts and `publish_documents`
  publishing them (the album credits went in that way on 28 September). The project's Editor token cannot deploy
  the schema.

## Closing

Run `bun check`, `bun run build`, the Storybook build and the whole Playwright suite in both data modes before the last
pull request. Then bring open-work and the wayfinder up to date, write `docs/plans/prompt-week-4.md` (first the
fixes for what the member test found, then polish and rehearsal: the review's remaining majors and the content
pass at 375 and 1440), and ask the owner to run /mattpocock-skills:handoff (the agent cannot invoke it) and save it
to `docs/plans/handoff-week-3.md`.
