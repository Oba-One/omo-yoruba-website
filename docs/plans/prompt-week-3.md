# Prompt: week 3, the migrations, the member guide and the first member test

Written 27 September 2026, at the end of the weeks 1 and 2 session (`docs/plans/handoff-weeks-1-2.md`). Paste into a
fresh session at the repo root on `review/alignment-and-quality`, the top of the open stack; `git fetch` first and
check which of pull requests 13 to 16 have merged since. It runs week 3 of `docs/plans/four-week-plan.md`: the
organization meets in the week of 12 October, content freezes on Thursday 8 October, and one member does the common
tasks unaided before then.

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-weeks-1-2.md, docs/plans/open-work.md, docs/plans/wayfinder.md,
docs/plans/four-week-plan.md (weeks 3 and 4), the "Triage" section of docs/plans/review-alignment-and-quality.md,
docs/runbook.md (Migrations; Studio, preview and Visual Editing), docs/research/online-giving-options.md, ADRs 0042
to 0044, and the oy-content-ops, oy-release, oy-content-model and oy-voice skills.

The goal for the week:
- Pull requests 13 and 14 land with their migrations, run with the owner, so the Studio members meet is the
  simplified one, and 15 and 16 follow them.
- A member can add an edition, an album with its credits and consent, a person and a news post, and clear a to-do
  item, with `docs/content-ops.md` and without help.
- Real content goes in through the Sanity MCP once it is signed in and D3 has named the dataset, the
  organization's facts first.
- The owner's open decisions are asked, one at a time, each with a recommendation.

Every rule in AGENTS.md holds: never invent content, Pending for every empty required field, one gold action per
screen view, full diacritics, no em dashes, no emoji. Review each diff with /code-review before its commit, open a
pull request per part, and merge only when the owner says so in this session. Never apply a migration without the
owner. Update docs/plans/open-work.md in the same
pull request as each item lands.

## Part 1: the migration days (with the owner)

For pull request 13, then 14, follow the runbook's Migrations section, with the owner out of the Studio for the
hour:
1. `bun run export` (outside the repo), then rehearse each migration on the export (`--from`).
2. The dry run on `development`: no conflict except `retired-fields`' planned wait for `album-link` (13) or
   `one-control` (14), which clears once those apply; publish or discard any draft that blocks.
3. For 14 only: after 13 has merged, `gh pr edit 14 --base main`, merge `main` into `studio/one-control` and push,
   so that merging 14 deploys to production (branch protection is strict, and base branches are not deleted on
   merge).
4. With the owner's word, merge the pull request, wait for the production deploy, then apply at once
   (`--apply`), in the order the pull request names: 13 is `album-link`, `inline-lists`, `teacher-group`,
   `retired-fields`; 14 is `one-control`, `scopes`, `retired-fields`.
5. `bun seed -- --dry-run` reports nothing due, and the pages render the same content: run the seeded Playwright
   specs of the pages the pull request changes before the day and again after the apply. Delete the export.
6. Deploy the schema, so the MCP and agents see the new shape: `bun run --filter @oy/content sanity -- schema
   deploy` needs the owner's CLI login (`bunx sanity login`); the Sanity MCP's schema deploy works once it is
   signed in.

After 13's day, drop the page lists' reference reads that kept both shapes working for one deploy. After 14's day,
retarget 15 to `main` and merge `main` into it, and the same for 16 after 15; merge each when the owner says so
(15 once the owner has confirmed its 404 doors).

## Part 2: the member guide and the recipes

Write `docs/content-ops.md` for members, for the Studio as it is after part 1: an event edition prepared as drafts
and published on its announce day, an album with its credits, consent note and photographs, a person, a news post
(there is no News page before launch, D22, but the homepage's news card shows posts), a to-do item cleared, when to
ask for help, and what never to do (the held-back switches, deleting, anything under
Settings). Add screenshots as an Editor and as an administrator; the owner invites an Editor account first
(open-work, D4). Then refresh the `oy-content-ops` and `oy-release` skills to match, and record in the guide what
the consent hold does and does not do (ADR 0043).

## Part 3: roles, preview host and real content

- The roles the owner chose (ADR 0042): check the member view with the Editor account.
- The preview host, if D15 says yes (runbook).
- E1: prove that a publish purges a page, with the runbook's signed probe; never print a secret.
- E19: once the owner signs the Sanity MCP in (`/mcp`) and D3 has named the dataset for real content, add what the
  owner sends, C1 to C3 first, through the oy-content-ops recipes. Nothing invented; the owner confirms each fact.
- The member test: one or two members do the common tasks with the guide while the owner watches. Ticket every place
  a member stalled under `docs/tickets/`, one ticket each.

## Part 4: the owner's decisions

Ask one at a time, each with your recommendation and today's default. Ask D3 first, before any real content or
member test (open-work: decide before members type facts):
- **D3:** which dataset holds the real content, and making `production` private.
- **D5:** consent for faces, and whether the gallery's hold should also reach the photographs pages show through
  their own fields (ADR 0043's considered options). In the seeded data every page photograph is an album photograph.
- **Giving:** which provider takes gifts, and whether monthly giving and emailed receipts are offered (review R38,
  C12, D8). Walk the owner through the research's ranking and its questions.
- **The review's owner tickets:** R47 (a reopened form keeps what was typed?), R110 (what the 17px floor covers),
  R142 (require TypeGen drift and Playwright and axe), R143 (the advisories to accept).
- **D2, D7, D11, D15** as the owner wants.
- The soon sentence, if header photographs come down under D5 (ADR 0043).

## Part 5: the review's ready groups, as time allows

One small pull request each, from `main`, with /implement and the tdd skill, a test that fails first:
contrast and type (R12, R37, R42, R49, R50); the dialogs (R45, R46, the scrim half of R47); the latent layouts
(R15, R21); Storybook's page root (R48); the guardrail hook (R144, which the owner reviews). R85 follows part 1.

## What these weeks learned

- **Stacked pull requests.** The branch protection is strict, so a pull request must contain `main` to merge:
  after each merge, merge `main` into the next branch and push. `git merge-tree --write-tree --name-only A B`
  previews the conflicts without touching the tree. `sanity.types.ts` conflicts resolve by `bun typegen`.
- **lefthook** hides the unstaged half of a partially staged file during pre-commit while other files keep their
  unstaged changes, so a commit that stages half a file can fail a typecheck the tree passes: commit whole files.
- **Draft mode** needs the signed session (ADR 0044). The e2e signs one with the Viewer token parsed from
  `packages/web/.env` (`READ_TOKEN` in `packages/web/e2e/helpers.ts`); the Playwright process does not load that
  file itself.
- **Known flakes:** the first axe test after a cold dev server (Vite reloads the page), and pull request 10's
  footer-trigger test in placeholder mode (one extra page load, once in four runs). Rerun before chasing either.
- **The Vercel MCP** cannot list the project's environment variables (403); ask the owner.
- **The consent hold** covers what pages reach through albums; `galleryHeld(page)` in `packages/web/e2e/helpers.ts`
  reads it.

## Closing

Run `bun check`, `bun run build`, the Storybook build and the whole Playwright suite in both data modes before the last
pull request. Then bring open-work and the wayfinder up to date, write `docs/plans/prompt-week-4.md` (first the
fixes for what the member test found, then polish and rehearsal: the review's remaining majors and the content
pass at 375 and 1440), and ask the owner to run /mattpocock-skills:handoff (the agent cannot invoke it) and save it
to `docs/plans/handoff-week-3.md`.
