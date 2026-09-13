# Prompt: Phase 7, conversion and trust

Written 13 September 2026 at the end of Phase 6, to paste into a fresh session at the repo root once the
Phase 6 pull request has merged (wayfinder ticket 39). It extends the Phase 7 prompt in
`docs/design/PROMPTS.md` with what Phases 5 and 6 learned.

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-phase-6.md (if the owner ran /handoff; otherwise the
Phase 6 tickets' comments in docs/tickets/phase-6/issues/ and ADRs 0029 to 0033), docs/plans/wayfinder.md
with tickets 02, 07, 09, 22, 32, 38 and 40, docs/design/ROUTES-AND-INTERACTIONS.md sections 1, 3, 4 and 5
for /get-involved, /impact, /our-story and /donate, docs/design/CONTENT-MODEL.md for getInvolvedPage,
impactPage, storyPage, donatePage, door, hometownAssociation, stat, outcome, partner, testimonial,
governanceDoc, timelineEntry, person and givingLevel, and docs/design/COMPONENT-MAP.md. Open
docs/design/design/13 Get Involved.dc.html, 14 Impact.dc.html, 15 People and History.dc.html and 16
Donate.dc.html in full: they are the fidelity bar at 375 and 1440. Every rule in AGENTS.md holds: never
invent content (no figure, date, name, quote or amount), Pending for every empty required field, one gold
action per screen view, full diacritics, "Odunde" unmarked in display text, green only inside Cultural
Collective content, and every Donate opening the Give Dialog.

Work on a new branch phase-7/conversion-and-trust cut from main after the Phase 6 pull request merges, and
finish by opening a pull request against main.

Run /grill-with-docs on the trust seam before building: Impact's figures (a `stat` or an `outcome` with its
source line, or the plain "not yet measured" statement; the `sources` option; what a figure with no source
shows), the governance block from `governanceDoc` (a file, or the note "Copies on request"), the funders
and partners it names; Our Story's timeline and ticket 07's default (the option is `hidden` until the owner
confirms the entries), the board and staff as PersonCards with short or full bios and portraits by option,
and "Reach us" with the ContactBlock Phase 6 built; Get Involved's four doors as cards or rows, the
hometown associations and "Or just talk to someone"; Donate's one gold "Give now", the giving levels and
what each gift does (register-invented until the owner confirms them), and the other ways to give. Each
page's layout options keep the names in packages/content/src/layout-options.ts (getInvolvedPage: doors,
hta; impactPage: stats, outcomes, sources, funders; storyPage: timeline, bios, portraits; donatePage:
impact). Update CONTEXT.md and add ADRs as decisions land. Then /to-tickets and /implement.

Build in @oy/ui with stories and tests, each variant a story and each empty state Pending: OutcomeCard
(figure with source, or plain statement; card and row), Timeline, and what the grill adds; reuse
PageHeader, StatStrip, DoorCard and PathRow, PersonCard (its `bioPending`), ContactBlock, FactList,
PartnerRow, PullQuote, Handoff, Section and SectionHead rather than forking them. Fixtures hold confirmed
facts, the bracketed placeholder form for owed copy and Pending states only: no dates, even as ISO
strings, and no photograph of a person standing in for someone named. Add one page-section story per
layout option.

In packages/web: compose the four routes from Sanity, one defineQuery each in @oy/content through
loadQuery (filter by `_type` and `_id` so TypeGen types the singleton alone), layout options from each
singleton, the page skeleton in packages/web/src/lib/sanity/page-skeleton.ts, cachePage with
`{ draft, failed }`, the Presentation locations through the route map and data-sanity edit attributes on
every option's container. Clean stega with `cleanText` before a value becomes a logic key, an href or a
comparison, render Studio URLs through `safeHref`, and register every Pending wording in
packages/content/src/pending.ts (read a wording from a named constant, never by matching a registry row's
text). Extend the seed only with confirmed facts.

Before the code review, compare the four pages with their prototypes at 375 and 1440 (the `design` entry
of .claude/launch.json serves the prototypes on 4399; docs/runbook.md, "Comparing a page with its
prototype", including the note on a prototype whose runtime hides its theme), fix what differs and record
in an ADR where a repo rule outranks a prototype. Playwright and axe on the four routes at 375 and 1440 in
both data modes (`PLACEHOLDER_PROJECT` in packages/web/e2e/helpers.ts tells a spec which mode it is in;
every test asserts something in both, and `expectEnquiryRoundTrip` and `axeViolations` replace copies), the
routes in the 44px targets sweep and the heading-order check, the earlier suites green; append the routes
to lighthouserc.cjs and run lhci on the local production build against QUALITY section 3. Run /code-review
on the whole diff, fix what it finds, commit, open the pull request and stop. Ask the owner to run
/mattpocock-skills:handoff (the skill cannot be invoked by the agent) and save it to
docs/plans/handoff-phase-7.md; write the owed-facts wayfinder ticket and the Phase 8 prompt as Phase 6
did. Leave every `Owner: yes` ticket for the owner, and do not merge.
