# Four weeks to the organization meeting

Written 13 September 2026. The meeting is assumed in the week of 12 October; move the weeks if it lands elsewhere.
The work list is `docs/plans/open-work.md` (`D` decisions, `C` content, `S` Studio, `E` engineering, `H`
housekeeping). The session prompt for weeks 1 and 2 is `docs/plans/prompt-weeks-1-2.md`.

## The goal

By the meeting:

1. **The Studio makes sense to a member.** It is organized around the site: a short to-do list, events with their
   parts, photos, people, pages. Each fact has one place, every input does something, and the labels use the site's
   words. A plain guide sits beside it, and at least one member has used both without help.
2. **The site shows what the organization has given.** Everything supplied is on the site, and everything still
   owed is an honest Pending chip. Edits appear within a minute.
3. **The owner arrives with a meeting pack:** a short demo, one list of what the organization still needs to give
   or decide, and a plan for who edits what.

Phases 9 (hardening) and 10 (content operations) are not done. Phase 10 is this plan's weeks 2 and 3, fitted to the
simplified Studio. Phase 9 follows the meeting, except the pieces a visitor would notice (a favicon, a 404 page).

## Principles for the Studio

- Group by how a member thinks about the organization, not by how the code is split.
- One place for each fact and each link.
- An input that changes nothing is hidden or removed.
- Labels and help text use the site's words; no ADR or ticket numbers in the Studio.
- Design choices stay out of a member's way; settings and configuration are for administrators.
- The to-do list shows only what is owed, by page.
- The content's shape changes before the guide is written, and data moves by migration or seed revision after a
  dataset export, never by hand.

## Week 1 (14 to 20 September): decide and unblock

The owner:
- Check the gallery and merge pull request 9 (D1).
- Decide the public host (D2), which dataset holds the real content (D3), and the roles on the Sanity plan (D4).
- Create the publish webhook on that host with the runbook (E1); without it an edit can take a day to appear.
- Walk the Studio for 45 minutes with section 3 of the open-work list, and answer its owner questions. Note
  anything else that confuses you.
- Send the organization one content request, the Now rows first: C1 (contacts and organization facts), C2, C3
  (consent and credits).
- Decide consent for faces (D5); until then the gallery can stay `state: soon`.

Agent sessions:
- **The deep review** (`docs/plans/prompt-deep-review.md`): a report and one ticket per finding.
- **Studio simplification, part 1** (the prompt at the end): a grill on section 3 with the owner's answers, an ADR,
  tickets, then the quick wins S1 to S6.
- **Small fixes:** E3 to E7 (favicon, 404 page, the performer blurb, the stale Zeffy variable, AGENTS.md
  corrections) and housekeeping H1 to H4 and H7.

Done when: D1 to D6 are decided, a publish purges the page, the review report exists, and the quick wins are merged.

## Week 2 (21 to 27 September): restructure the Studio

Agent sessions (Studio simplification, part 2):
- Build the medium and larger changes the owner chose from S7 to S15:
  - The sidebar regrouped, and the To do view.
  - One album link, and one control per decision.
  - Design options for administrators, the teacher from one source.
  - If chosen, the inline page lists and the split settings.
- Before any data moves: export `development`, then run the migrations on it and check the To do counts.
- Update TypeGen, the registry, the Presentation locations, the tests and Playwright in both data modes, then open
  one pull request.
- Fix the deep review's blockers as they come up.

The owner:
- Review the new Studio on the pull request's preview, and merge.
- Enter the content whose shape does not change: site settings facts, captions, credits, news post bodies.

Done when: the restructure is merged, `development` is migrated, and the To do view shows only what is owed.

## Week 3 (28 September to 4 October): the guide, the roles, the content

Agent sessions (Phase 10 for the simplified Studio):
- Write `docs/content-ops.md` for members. It covers adding a news post, an event edition, an album with its
  credits and consent, and a person; clearing a to-do item; when to ask for help; and what never to do. Add
  screenshots.
- Refresh the `oy-content-ops` and `oy-release` skills to match.
- Set up the roles the owner chose, and the preview host if D15 says yes.
- Once the Sanity MCP is signed in, add real content from the owner's instructions (E19).

The owner, with one or two members:
- **A usability test.** Each member does the five common tasks with the guide, and the owner notes where they
  stall.
- **Content entry.** Enter what the organization sends: C1 to C3 first, then the Launch rows as they arrive.

Done when: the guide is in the repo, one member has finished the tasks unaided, and the test's friction is ticketed.

## Week 4 (5 to 11 October): polish and rehearse

Agent sessions:
- Fix what the usability test found.
- Take the deep review's major design drift.
- A content pass page by page, at 375 and 1440: every chip is filled, or accepted as visible for now.
- Captions, credits and the gallery's state checked against the consent answer.
- Lighthouse and Playwright in both data modes; merge.

The owner:
- Content freeze on Thursday 8 October.
- Walk every page on a phone and a laptop.
- Put the meeting pack together (below).

Done when: the site is ready to show and the pack is ready.

## The meeting pack

- **A ten-minute demo:**
  - The site on a phone: the homepage, Odunde, Get Involved, Donate, the gallery.
  - The Studio: add a news post live, publish it, and watch it appear.
- **What we need from you:** the open C rows, and the decisions that belong to the organization (D5 consent, D9
  tables, D10 awards, D21 the timeline, D22 news, D24 a second Donate door), each with its default.
- **Who edits what:** the roles, the guide, a first-month schedule of who adds news, photos and events, and where to
  ask for help.
- **What comes next:** the domain, Phase 9's hardening, and launch.

## Risks

- **The domain stays broken.** Keep the Vercel host for the meeting, and leave canonical links and the sitemap for
  Phase 9.
- **Consent is unresolved.** The gallery stays `state: soon`, and identifiable children come off the pages that show
  them until it is settled.
- **A migration damages content.** Export the dataset first, and migrate `development` through reviewed scripts.
  `production` is empty, so launch starts clean.
- **Members have little time.** The Now content and one trained member are enough for the meeting; the rest stays
  as visible chips.
- **The Sanity plan limits roles or Content Releases.** Decide D4 in week 1, and keep settings for administrators
  until it is known.

## Prompt: Studio simplification

Paste into a fresh session at the repo root after pull request 9 merges.

---

Read AGENTS.md, CONTEXT.md, docs/plans/open-work.md (section 3 and the decisions it names),
docs/plans/four-week-plan.md, docs/design/CONTENT-MODEL.md, packages/content/README.md, ADRs 0006, 0013, 0014,
0017, 0025, 0035 and 0039, and the oy-content-model and oy-content-ops skills. The goal is a Studio an organization
member can manage without help: grouped by how they think about the organization, one place for each fact and
link, no input that changes nothing, labels in the site's words, design choices and configuration for
administrators, and a to-do list that shows only what is owed. Every rule in AGENTS.md holds; never invent content.

Work on a new branch studio/simplify cut from main, and finish each part by opening a pull request against main.

Run /grill-with-docs on section 3 of the open-work list with the owner, one candidate at a time (S1 to S15), using
the owner's answers to its questions. Record the decisions in an ADR and in CONTEXT.md, then /to-tickets and
/implement. Part 1 is the quick wins S1 to S6; open its pull request and stop for the owner. Part 2 is the medium
and larger changes the owner chose.

For every change to the shape of stored content:
- Export the `development` dataset first.
- Move data with a reviewed migration or a seed revision (ADR 0035), never by hand, and add retired fields to
  `RETIRED_FIELDS`.
- Regenerate TypeGen and update the registry and the presence rows, the route map, the Presentation locations
  and the cache tags.
- Keep every page rendering the same content; the site's pages must not change.

Test the structure (the sidebar's groups and what each role sees), the migrations (before and after), and the
builders. Run Playwright in both data modes with `--workers=1` and `bun check`. Compare the Studio before and after
with screenshots in the pull request.

Run /code-review on the whole diff, fix what it finds, commit, open the pull request and stop. Update
docs/plans/open-work.md's S rows as they land. The guide (`docs/content-ops.md`) waits for week 3, so it describes
the Studio as simplified. Ask the owner to run /mattpocock-skills:handoff at the end.
