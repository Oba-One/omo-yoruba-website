# Handoff: weeks 1 and 2, the Studio simplified, the deep review and its blockers

Written 27 September 2026 at the end of the session that ran `docs/plans/prompt-weeks-1-2.md` (parts 0 to 5 and the
closing) with the owner's added requests: simpler READMEs, a `DESIGN.md`, the navigation fix, the deep review, the
blockers fixed, the majors triaged and research on online giving. The next session starts from
`docs/plans/prompt-week-3.md`. Decisions are in ADRs 0041 to 0044; the review is
`docs/plans/review-alignment-and-quality.md` with its tickets under `docs/tickets/review/issues/`; the giving research
is `docs/research/online-giving-options.md`.

## Where it stands

- **Merged on 27 September**, at the owner's word ("do the merges you feel are ready", then "go ahead and complete
  the work"):
  - [10](https://github.com/Oba-One/omo-yoruba-website/pull/10), the navigation fix (ADR 0041).
  - [11](https://github.com/Oba-One/omo-yoruba-website/pull/11) and
    [12](https://github.com/Oba-One/omo-yoruba-website/pull/12), the Studio simplification's part 4, the To do and
    the sidebar (ADR 0042).
  - [17](https://github.com/Oba-One/omo-yoruba-website/pull/17), the review's three blockers and the Zeffy frame
    (ADRs 0043 and 0044).
  - [13](https://github.com/Oba-One/omo-yoruba-website/pull/13) and
    [14](https://github.com/Oba-One/omo-yoruba-website/pull/14), part 5, each with its migration day (below).
  - [15](https://github.com/Oba-One/omo-yoruba-website/pull/15), the 404 page, the READMEs, `DESIGN.md`, the week 1
    tidy and `SANITY_PREVIEW_SECRET` retired; and
    [16](https://github.com/Oba-One/omo-yoruba-website/pull/16), the deep review, its triage, the giving research,
    the week 3 prompt and this handoff, each once its checks passed.

  `main` deploys to the public host, so the simplified Studio at `/admin` and every fix above are live there.
- **The migration days, 27 September, with the owner out of the Studio:**
  - Exported, rehearsed on the export, dry-run live; each matched its pull request's description.
  - Applied right after each production deploy. 13: `album-link` (2), `inline-lists` (5: the Collective's two
    initiatives moved into its page list), `teacher-group` and `retired-fields` (nothing). 14: `one-control` (2),
    `scopes` (nothing), `retired-fields` (9). Every re-plan is empty, and `bun seed -- --dry-run` has nothing due.
  - The pages' seeded specs before and after each apply: 189 passed and 1 skipped (13), 126 passed and 2 skipped
    (14). The public host showed the moved initiatives and Odunde's take-part order unchanged.
  - The two full exports were deleted. The four `.before.ndjson` snapshots (only the documents the migrations
    wrote) stay in `~/omo-yoruba-exports` for `bun run migrate -- restore`, until the owner is happy with the site.
- **Not done on 27 September:** `sanity schema deploy`. The project's Editor token lacks the `deployStudio` grant,
  so it needs the owner's own login. The owner deployed it on 29 September.
- **Open:** the Zeffy embed work (the owner chose Zeffy, embedded, on 27 September), on branch `feat/zeffy-embed`
  with its own pull request.
- **Decided on 27 September:** D3 (`development` holds the real content through launch; `production` to be made
  private) and D5 (the organization has consent; its event photographer took the photographs). The gallery stays
  `built`.
- **The triage** is in the report's "Triage" section and on each ticket:
  - R44 and R109 resolved by pull request 10; R01 to R03 by pull request 17.
  - Eleven majors are ready for an agent in five groups, and R85 is ready now that 13 has landed.
  - R38 is part of the Zeffy pull request; R47 and R110 wait on the owner's decision; R142 and R143 on the owner's
    action or approval.
  - The 143 minor and polish findings are untriaged.

## Owner follow-ups, in order

1. **Make `production` private (D3):** sanity.io/manage, the project, Datasets, `production`, Edit, Visibility:
   Private. Agents do not change access settings.
2. **Deploy the schema** with your login: `bunx sanity login`, then `bun run --filter @oy/content sanity -- schema
   deploy`. It tells the MCP and agents what each field requires. Done on 29 September; agents read it by id
   (runbook, Studio, preview and Visual Editing).
3. **Delete three lines** from `packages/web/.env.example`: `PUBLIC_ZEFFY_EMBED_URL`, `PUBLIC_EVENTBRITE_URL` and
   `SANITY_PREVIEW_SECRET` (agents cannot edit that file; none of the three is set in Vercel).
4. **Zeffy:** create the donation form, turn on automatic tax receipts, decide on monthly giving, and paste the
   embed URL into Organization details (called Site settings before 30 September), Zeffy embed URL. Review the Zeffy pull request.
5. **Invite an Editor account.** The member view, the guide's screenshots and the member test need it.
6. **Sign in the Sanity MCP** (`/mcp` in an interactive session) for real content (E19). Since 28 September E19
   no longer waits for it: the claude.ai Sanity connector writes as the owner.
7. **The gallery's facts (C3):** the event photographer's name as each album's credit should read, and the consent
   policy in your words. The credits were done on 28 September (Red Carpet Films, ADR 0046); the policy remains.
8. **Decide:** R47, R110, R142 (a repository setting) and R143; D2, D7, D11 and D15 as wanted.
9. **Confirm** pull request 15's three 404 doors (the homepage, Get Involved, Programs), or name others.
10. **E1:** prove that a publish purges a page, with the runbook's probe.
11. **Delete the migration snapshots** in `~/omo-yoruba-exports` once the site looks right.

## Decisions made without the owner (reverse any)

- **R01, the ticket's first option.** Coming soon now holds the albums: album pages, photo addresses and the event
  pages' past photographs.
  - Odunde keeps its past years in words and attendance; the Gala withdraws its past years.
  - The hold applies in draft mode too, so the Presentation tool shows what visitors see.
  - The second option (unpublishing albums, with the description corrected) stays open (ADR 0043).
- **The draft session** is keyed with the Viewer token rather than `SANITY_PREVIEW_SECRET`, and lasts twelve hours
  (ADR 0044).
- **The Zeffy frame** accepts only an https address on an origin the CSP's `frame-src` lists (`framableSrc`).
- **Merges.** All of 10 to 17 merged under the owner's word, 13 and 14 on their migration days.
- **SANITY_PREVIEW_SECRET retired** from the env schema, the wizard and the runbook (pull request 15), since nothing
  read it and its name invited rotating the wrong secret.
- **The short ui README** points at ADRs 0018 and 0041 instead of keeping pull request 10's long paragraph.
- **The triage's outcomes and groups** (the report).

## Known gaps

- **The consent hold does not reach a photograph a page shows through its own field.** The Studio's description,
  CONTEXT.md and D5 say so. With consent confirmed (D5), it matters only if consent is ever withdrawn.
- **The purge is soft.** After the hold flips, each cached page can show its old photographs to one more visitor. A
  hard purge needs `@vercel/functions` as a direct dependency, the owner's call.
- **The page lists' reference reads.** Pull request 13's queries read both shapes for one deploy; with its migrations
  applied, the old reads can go (a small pull request).
- **Flaky tests:**
  - The first axe test after a cold dev server. Vite reloads the page; it passes alone.
  - Pull request 10's footer-trigger test in placeholder mode: one extra page load, once in four runs; 3 of 3 on a
    repeat.
- **Held branches in e2e.** Seeded runs take the album, Odunde and Gala specs' held branches only while
  `development`'s gallery is on `soon`. Today it is `built`.
- **Lighthouse on previews** skips without the bypass secret (D14, wayfinder ticket 28).
- **The week 4 prompt** is not written; week 3's closing writes it.

## Environment notes

What these weeks learned about the repo's tooling is in `docs/plans/prompt-week-3.md`, "What these weeks learned";
not repeated here. Two more:

- **Tools for the cascade:**
  - Resolve a `sanity.types.ts` conflict with `git checkout --ours` and then `bun typegen`.
  - When a commit must take only part of a file, `git hash-object -w` and `git update-index --cacheinfo` stage a
    prepared version of it without touching the tree.
- **Pull request 17's code review:**
  - Ten finders, one verifier per candidate, a sweep, then a focused review of the fixes. Each ran as a parallel
    subagent for 8 to 20 minutes; do not edit the files they read while they run.
  - Verifiers' mutation checks on scratch copies proved two tests vacuous.

## Suggested skills for the next session

- **To start:** read `docs/plans/prompt-week-3.md`, then `/grill-with-docs` for the owner's decisions, one at a time.
- **The migration days:** the `oy-content-model` skill and the runbook; never apply without the owner.
- **The member guide:** `oy-content-ops`, `oy-release` and `oy-voice`.
- **The review's ready groups:** `/implement` with the `tdd` skill, `oy-page` for page changes, and `oy-component`
  for library changes.
- **Giving follow-ups:** `research` before any new provider or library is pinned.
- **Every commit:** `/code-review` first.
- **At the end:** bring the wayfinder map up to date, then ask the owner to run `/mattpocock-skills:handoff` (an
  agent cannot invoke it) and save it to `docs/plans/handoff-week-3.md`.
