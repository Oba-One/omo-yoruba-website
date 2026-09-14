# Prompt: weeks 1 and 2, decide, review, simplify the Studio

Written 13 September 2026, after pull request 9 (the gallery) merged. Paste into a fresh session at the repo root on
`main`. It starts `docs/plans/four-week-plan.md`: week 1 (decide and unblock) and week 2 (restructure the Studio).
Week 3 (the member guide, the roles, a usability test) gets its own prompt, which this session writes at the end.

---

Read AGENTS.md, CONTEXT.md, docs/plans/open-work.md (all of it: the D, C, S, E and H rows), docs/plans/four-week-plan.md,
docs/plans/prompt-deep-review.md, docs/plans/wayfinder.md, docs/runbook.md, docs/design/CONTENT-MODEL.md,
packages/content/README.md, the oy-content-model, oy-content-ops and oy-page skills, and ADRs 0006, 0013, 0014,
0017, 0021, 0025, 0035 and 0039. Read docs/plans/handoff-phase-8.md if the owner has saved it; otherwise read the
Phase 8 tickets' comments in docs/tickets/phase-8/issues/.

The goal for these two weeks is a site and a Studio the organization can see and use in the week of 12 October:
- An organization member can manage content without help, in a Studio grouped by how they think about the
  organization. Each fact and link has one place, no input changes nothing, the labels use the site's words, and
  the to-do list shows only what is owed.
- An edit reaches the site within a minute.
- The design review's blockers are fixed.

Every rule in AGENTS.md holds: never invent content, Pending for every empty required field, one gold action per
screen view, full diacritics, no em dashes, no emoji. Review each diff with /code-review before its commit, open a
pull request per part, and merge only when the owner says so in the session. As items land, update their status in
docs/plans/open-work.md in the same pull request.

## Part 1: the owner's decisions

Run /grill-with-docs with the owner before building anything, one question at a time, each with your recommendation
and the default today:
- **D2:** the public host until `omoyorubasocal.org` works.
- **D3:** which dataset holds the real content, and making `production` private.
- **D4:** the Sanity plan, and the roles for organization members.
- **D5:** consent for identifiable faces.
- **D7:** the favicon.
- **D6:** the Studio's simplification, through the questions at the end of open-work section 3. Take each of S7 to
  S15 in turn, and recommend from the principles in the four-week plan.

Offer the Launch decisions (D8 to D18) the owner wants to settle now, and leave the rest open. Record the answers in
the D rows and in a spec at docs/tickets/studio-simplification/spec.md. Put decisions about the content model or the
Studio's organization in an ADR, and new terms in CONTEXT.md.

## Part 2: unblock and tidy

Branch `chore/week-1`:
- **E1, the publish webhook.** The owner creates it in sanity.io/manage on the chosen host, following the runbook.
  Walk them through it, then prove a publish purges the page with the runbook's signed probe; never print a
  secret.
- **The small fixes that need no decision:**
  - E4: a 404 page in the site chrome. The album route's empty 404 must render it.
  - E5: the performer blurb's question count.
  - E6: remove `PUBLIC_ZEFFY_EMBED_URL` from the env schema, the runbook and the wizard.
  - E7: AGENTS.md's menu breakpoint, and the hero sizes after D11.
- **E3, the favicon,** once D7 is answered.
- **Housekeeping:** H1 to H4 and H7. Close the stale tickets after moving their calls into open-work rows, rewrite
  the ones the tracker names, refresh the wayfinder frontier, fix the documents that contradict the build, and
  record the 13 September hosting facts in the runbook.

Run `bun check`, `bun run build`, and Playwright in both data modes (`--workers=1`) for the affected specs. Then open
the pull request and stop for the owner.

## Part 3: the deep review

Run docs/plans/prompt-deep-review.md as written, on its own branch. Use parallel subagents for:
- the route comparisons;
- the chrome, the dialogs and the component canvas;
- one code-quality reviewer per package.

Deliver the report and the tickets, and fix only what the owner approves in the session. Its blockers go into part 5
if they touch the Studio or the content model, otherwise into their own small pull request.

## Part 4: the Studio's quick wins (S1 to S6)

Follow the "Prompt: Studio simplification" section of docs/plans/four-week-plan.md, part 1, on branch
`studio/simplify`:
- **S1:** the edition form.
- **S2:** hide the inputs that change nothing.
- **S3:** labels, descriptions and US dates in the site's words.
- **S4:** administrator-only tools and rows.
- **S5:** honorees need their edition.
- **S6:** the recipes that drifted, `oy-release` first.

Nothing stored changes in this part, and the site must render exactly as before; prove that with Playwright in both
data modes. Test the structure, and put before and after screenshots of the Studio in the pull request. Open the
pull request and stop for the owner.

## Part 5: the Studio's restructure (the S7 to S15 the owner chose)

Same prompt, part 2, on a new branch from `main` after part 4 merges:
- the sidebar regrouped as the site;
- the To do view with counts;
- one album link;
- one control per decision;
- design options for administrators;
- the teacher from one source;
- the larger changes (inline page lists, the split settings) if chosen.

For every change to stored content:
- Export `development` first.
- Move the data with a reviewed migration or a seed revision (ADR 0035), never by hand, and list retired fields in
  `RETIRED_FIELDS`.
- Regenerate TypeGen, and update the registry and presence rows, the route map, the Presentation locations and the
  cache tags.
- Keep every page rendering the same content.

Show the To do view's counts before and after, run the migrations on `development` with the owner watching, and
check that the site is unchanged. Then open the pull request and stop for the owner.

## Closing

Run `bun check`, `bun run build`, the Storybook build and the whole Playwright suite in both data modes before the last
pull request. Then:
- Bring docs/plans/open-work.md and docs/plans/wayfinder.md up to date.
- Write docs/plans/prompt-week-3.md for the next session: the member guide `docs/content-ops.md` for the simplified
  Studio, the roles, the preview host if D15 says yes, real content through the Sanity MCP (E19), and a usability
  test with one or two members. It should carry what these weeks learned, as the earlier phase prompts did.
- Ask the owner to run /mattpocock-skills:handoff (the agent cannot invoke it) and save it to
  docs/plans/handoff-weeks-1-2.md.
