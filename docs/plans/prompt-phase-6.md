# Prompt: Phase 6, the program pages

Written 12 September 2026 at the end of Phase 5, to paste into a fresh session at the repo root once
the Phase 5 pull request has merged (wayfinder ticket 36). It extends the Phase 6 prompt in
`docs/design/PROMPTS.md` with what Phase 5 learned.

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-phase-5.md (the environment notes and the owner
follow-ups: CI's Playwright job builds with a placeholder Sanity project, so every spec must pass with
and without Studio data; run Playwright locally with `--workers=1`; the Astro dev server can keep a
stale scoped stylesheet for an edited @oy/ui component until it restarts; the agent's permissions deny
`packages/web/.env.example`), docs/plans/wayfinder.md with tickets 07, 22, 30, 31 and 37, ADRs 0018 to
0028 (0025: take-part rows on the singleton; 0027 and 0028: where a repo rule outranks a prototype),
docs/design/ROUTES-AND-INTERACTIONS.md sections 1, 3, 4 and 5 for /programs,
/programs/yoruba-lessons and /programs/cultural-collective, docs/design/CONTENT-MODEL.md for
programsPage, lessonsPage, collectivePage, program, initiative, person, testimonial and event
(collective), and docs/design/COMPONENT-MAP.md. Open docs/design/design/10 Programs.dc.html, 11 Yoruba
Language School.dc.html and 12 Yoruba Cultural Collective.dc.html in full: they are the fidelity bar at
375 and 1440. Every rule in AGENTS.md holds: never invent content, Pending for every empty required
field, one gold action per screen view, full diacritics, Yoruba Language Lessons never "School" (one
teacher, live online, times and fees agreed with her directly, no terms, no Saturdays, no venue), and
green only inside Cultural Collective content.

Work on a new branch phase-6/program-pages cut from main after the Phase 5 pull request merges, and
finish by opening a pull request against main.

Run /grill-with-docs on the program seam before building: the take-part rows of the three pages (the
prototypes' chips are Enroll, Volunteer and Give on /programs, Membership, Volunteer and Give on
Lessons, Partner, Skills and Updates on the Collective, so the six ways in of
`packages/content/src/take-part.ts` grow or a second row type appears; ADR 0025 expected the same row
object); what Kids & STEM and Cultural Exchange render inline on /programs and how their owed facts
read; the year strip's months and where they come from (`programsPage` rows referencing editions); the
Lessons FAQ as an accordion with its Pending answers and ticket 07's shape for defaults; the teacher as
a PersonCard (portrait or the woven tick) and what the page may say about her; the Collective's
initiatives (Solar Hub, Green Goods) with their status lines, its collective events and the green
scope; and each page's layout options with the names in packages/content/src/layout-options.ts
(programsPage: cards, inline, yearstrip; lessonsPage: lesson, portraits, faq; collectivePage:
initiatives, green, status, events). Update CONTEXT.md and add ADRs as decisions land. Then /to-tickets and
/implement.

Build in @oy/ui with stories and tests, each variant a story and each empty state Pending: YearStrip,
Accordion (single and multi open, 44px closed rows), ContactBlock, and what the grill adds; reuse
PageHeader, GlanceStrip, Split, Prose, ProgramCard, CardGrid, PersonCard, PullQuote, TakePartBand,
Handoff and PhotoCarousel rather than forking them. Fixtures hold confirmed facts, the bracketed
placeholder form for owed copy and Pending states only. Add one page-section story per layout option.

In packages/web: compose the three routes from Sanity, one defineQuery each in @oy/content through
loadQuery, layout options from each singleton, cachePage with tagsForRoute, the Presentation locations
through the route map (`programRoute` already maps a program's page) and data-sanity edit attributes
as on /odunde. Extend the seed only with confirmed facts.

Before the code review, compare the three pages with their prototypes at 375 and 1440 (the `design`
entry of .claude/launch.json serves the prototypes on 4399; docs/runbook.md, "Comparing a page with its
prototype"), fix what differs and record in an ADR where a repo rule outranks a prototype. Playwright
and axe on the three routes at 375 and 1440 in both data modes, the earlier suites green; append the
routes to lighthouserc.cjs and run lhci on the local production build (or the preview once ticket 28 is
done) against QUALITY section 3. Run /code-review on the whole diff, fix what it finds, commit, open
the pull request and stop. Run /handoff before ending and save it to docs/plans/handoff-phase-6.md.
