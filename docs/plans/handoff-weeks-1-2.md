# Handoff: weeks 1 and 2, the Studio simplified, the deep review and its blockers

Written 27 September 2026 at the end of the session that ran `docs/plans/prompt-weeks-1-2.md` (parts 0 to 5 and the
closing) with the owner's added requests: simpler READMEs, a `DESIGN.md`, the navigation fix, the deep review, the
blockers fixed, the majors triaged and research on online giving. The next session starts from
`docs/plans/prompt-week-3.md`. Decisions are in ADRs 0041 to 0044; the review is
`docs/plans/review-alignment-and-quality.md` with its tickets under `docs/tickets/review/issues/`; the giving research
is `docs/research/online-giving-options.md`.

## Where it stands

- **Merged on 27 September** (the owner said to merge what was ready):
  - [10](https://github.com/Oba-One/omo-yoruba-website/pull/10), the navigation fix (ADR 0041).
  - [11](https://github.com/Oba-One/omo-yoruba-website/pull/11), the Studio simplification's part 4 (ADR 0042).
  - [12](https://github.com/Oba-One/omo-yoruba-website/pull/12), the To do and the sidebar.
  - [17](https://github.com/Oba-One/omo-yoruba-website/pull/17), the review's three blockers and the Zeffy frame
    (ADRs 0043 and 0044).

  `main` deploys to the public host, so the draft-mode, footer, Zeffy and consent-hold fixes and the simplified
  Studio at `/admin` are live there.
- **Open, stacked, each current with `main`:**
  - [13](https://github.com/Oba-One/omo-yoruba-website/pull/13), part 5 B: migrations, page lists, one album link,
    the teacher. Base `main`.
  - [14](https://github.com/Oba-One/omo-yoruba-website/pull/14), part 5 C: one control per decision, the scopes,
    the deletions. Base 13.
  - [15](https://github.com/Oba-One/omo-yoruba-website/pull/15), the 404 page, the READMEs, `DESIGN.md` and the
    week 1 tidy. Base 14.
  - [16](https://github.com/Oba-One/omo-yoruba-website/pull/16), the deep review, its triage, the giving research,
    the week 3 prompt and this handoff. Base 15.

  13 and 14 wait for their migration days with the owner (the runbook's Migrations section; each pull request names
  its migrations). Base branches are not deleted on merge, so retarget the next pull request to `main` by hand.
- **Checks after `main` went up the stack:**
  - `bun check` on 15: 154 files, 1016 tests.
  - Pull request 17 ran the whole Playwright suite in both data modes before its last review fixes (seeded 296
    passed; placeholder 265 passed; one known flake in each, below), and the specs it touched afterwards.
  - CI runs on every push. Auto-fix is off on 13 to 16.
- **The triage** is in the report's "Triage" section and on each ticket:
  - R44 and R109 resolved by pull request 10; R01 to R03 by pull request 17.
  - Eleven majors are ready for an agent in five groups, and R85 is ready once 13 lands.
  - R38, R47 and R110 wait on the owner's decision; R142 and R143 on the owner's action or approval.
  - The 143 minor and polish findings are untriaged.

## Owner follow-ups, in order

1. **Migration days:** pull request 13, then 14 (runbook, Migrations). Stay out of the Studio for the hour. Then
   merge 15 and 16.
2. **Invite an Editor account.** The member view, the guide's screenshots and the member test need it.
3. **Decide D3 first:** which dataset holds the real content, and making `production` private. Open-work says to
   decide it before members type facts.
4. **Sign in the Sanity MCP** (`/mcp` in an interactive session) for real content (E19), once D3 is answered.
5. **Decide:**
   - D5, including whether the albums' hold should also reach the photographs pages show themselves. In the seeded
     data they are all album photographs (ADR 0043).
   - The giving provider, monthly giving and receipts (R38, C12, D8), with the research's questions.
   - R47, R110, R142 (a repository setting) and R143.
   - D2, D7, D11 and D15 as wanted.
6. **Delete what nothing reads.** Remove `PUBLIC_ZEFFY_EMBED_URL` and `PUBLIC_EVENTBRITE_URL` from
   `packages/web/.env.example` and Vercel. `SANITY_PREVIEW_SECRET` is read by nothing (ADR 0044) and can go too.
   Agents cannot edit `.env.example`.
7. **Confirm** pull request 15's three 404 doors (the homepage, Get Involved, Programs).
8. **E1:** prove that a publish purges a page, with the runbook's probe.
9. **Say yes or no** to `@vercel/functions` as a direct dependency, for a hard purge when the hold flips.
10. **If header photographs come down under D5,** reword the soon sentence ("the Odunde and Gala pages carry their
   own photographs"). It is your copy.

## Decisions made without the owner (reverse any)

- **R01, the ticket's first option.** Coming soon now holds the albums: album pages, photo addresses and the event
  pages' past photographs.
  - Odunde keeps its past years in words and attendance; the Gala withdraws its past years.
  - The hold applies in draft mode too, so the Presentation tool shows what visitors see.
  - The second option (unpublishing albums, with the description corrected) stays open (ADR 0043).
- **The draft session** is keyed with the Viewer token rather than `SANITY_PREVIEW_SECRET`, and lasts twelve hours
  (ADR 0044).
- **The Zeffy frame** accepts only an https address on an origin the CSP's `frame-src` lists (`framableSrc`).
- **Merges.** 10, 11, 12 and 17 merged under the owner's word; 13 and 14 are held for their migration days.
- **The short ui README** points at ADRs 0018 and 0041 instead of keeping pull request 10's long paragraph.
- **The triage's outcomes and groups** (the report).

## Known gaps

- **The consent hold does not reach a photograph a page shows through its own field.** The Studio's description,
  CONTEXT.md and D5 say so.
- **The purge is soft.** After the hold flips, each cached page can show its old photographs to one more visitor.
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
