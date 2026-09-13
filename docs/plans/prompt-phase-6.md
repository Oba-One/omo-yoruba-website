# Prompt: Phase 6, the program pages

Written 12 September 2026 at the end of Phase 5 and revised after its code review, to paste into a fresh
session at the repo root once pull request 6 has merged (wayfinder ticket 36). It extends the Phase 6
prompt in `docs/design/PROMPTS.md` with what Phase 5 learned.

---

Read AGENTS.md, CONTEXT.md and docs/plans/handoff-phase-5.md (its known gaps, the decisions made
without me and the environment notes), docs/plans/wayfinder.md with tickets 07, 30, 31, 37 and 38,
ADRs 0018 to 0028 (0024 and 0025: the edition rule and the take-part rows; 0027 and 0028: where a repo
rule outranks a prototype), docs/design/ROUTES-AND-INTERACTIONS.md sections 1, 3 (the `enrol` form), 4
and 5 for /programs, /programs/yoruba-lessons and /programs/cultural-collective, docs/design/CONTENT-MODEL.md
sections 3 and 4 for programsPage, lessonsPage, collectivePage, program, initiative, person,
testimonial and event (collective), and docs/design/COMPONENT-MAP.md. Open docs/design/design/10
Programs.dc.html, 11 Yoruba Language School.dc.html and 12 Yoruba Cultural Collective.dc.html in full:
they are the fidelity bar at 375 and 1440. docs/design/design/19 Mock Content Register.dc.html marks
what on them is invented: the program cards' cadence and ages, Kids & STEM's ages and what they build,
everything about Cultural Exchange, the Lessons glance (format, ages, fee), levels, lesson shape,
teacher, voices and FAQ answers, the Collective's argument, the Solar Hub and Green Goods status lines,
its one voice, and the membership dues. None of it reaches a page, a fixture or the seed. Every rule in
AGENTS.md holds: never invent content, Pending for every empty required field, one gold action per
screen view, full diacritics, Yoruba Language Lessons never "School" in display text (one teacher, live
online, times and fees agreed with her directly, no terms, no Saturdays, no venue), and green only
inside Cultural Collective content.

Work on a new branch phase-6/program-pages cut from main after pull request 6 merges (from
phase-5/event-pages if it has not), and finish by opening a pull request against main.

Start with the two Phase 5 gaps the program pages would otherwise copy (handoff-phase-5.md, "Known
gaps"). First, make `pendingWhat`'s condition-row fallback in packages/content/src/pending.ts honour
`kind`, with a test, before a collective event adds a kind-filtered row. Second, move the skeleton that
packages/web/src/lib/sanity/festival-page.ts and gala-page.ts repeat (the header, the glance, the
take-part rows, the past album) into a shared module beside view.ts, so the three new builders share it.
Keep the event pages' Vitest and Playwright suites green through both.

Run /grill-with-docs on the program seam before building:

- The take-part rows. The prototypes' chips are Enroll, Volunteer and Give on /programs; Membership,
  Volunteer and Give on Lessons; Partner, Skills and Updates on the Collective (Updates points at the
  footer newsletter). `packages/content/src/take-part.ts` knows six ways in (vendor, sponsor,
  performer, volunteer, table, give), and ADR 0025 expected the program pages to reuse its row object.
  Settle whether the ways in grow or a second row type appears. Button copy follows the oy-voice skill
  ("Enrol", as the enquiry kind is spelled).
- Kids & STEM and Cultural Exchange. What they render inline on /programs, and how their owed facts
  read (`programsPage.kidsStem` and `culturalExchange`, both already in the registry).
- The year strip. Its months and where they come from (`programsPage.yearStrip[]`: month, program
  reference, note).
- The Lessons FAQ as an Accordion. CONTENT-MODEL says five `faqItem`s and the register says seven
  answers are invented. The `faq` option (closed, open) sets the default, an owner call like ticket 07.
- The teacher as a PersonCard (her portrait, or the woven tick) and what the page may say about her
  before she is named.
- The testimonials: the Lessons voices and the Collective's one voice, with initials when
  `permissionToName` is false (CONTENT-MODEL section 4).
- The Collective: the initiatives, Solar Hub and Green Goods (seeded with their names and the member-led
  flag only), and their status lines; its collective events, under ADR 0024's edition rule or a rule of their own; the green scope
  (`data-scope="collective"`); and ticket 31's photograph.
- Each page's layout options, with the names in packages/content/src/layout-options.ts:
  - programsPage: cards, inline, yearstrip
  - lessonsPage: lesson, portraits, faq
  - collectivePage: initiatives, green, status, events

Update CONTEXT.md and add ADRs as decisions land. Then run /to-tickets and work the tickets with
/implement. Before pinning anything new, verify it against its primary docs with the research skill, add
the findings to docs/research/, and wait for my yes before installing. The Accordion should need no
library (ADR 0018).

Build in @oy/ui, each part with stories and tests, every variant a story and every empty state Pending:

- YearStrip: the months in five columns.
- Accordion: single and multi open, closed rows keeping 44px, the open-by-default option, keyboard
  support and a play function.
- ContactBlock: the address, phone and email from the settings or their chips, opening `contact`.
- Whatever the grill adds.

Reuse PageHeader, GlanceStrip, Split, Prose, ProgramCard, CardGrid, PersonCard, PullQuote,
TakePartBand, Handoff and PhotoCarousel rather than forking them. Fixtures hold only confirmed facts,
owed copy in the bracketed placeholder form ("[ The shape of a lesson ]") and Pending states. Add one
page-section story per layout option. A new rule in packages/tokens/src/oy-components.css that styles
a container's `span` children also needs a `span.oy-pend` exemption for that container
(`.oy-lrow-tier span.oy-pend` is the pattern). Without it, a Pending chip inside loses its look.

In packages/web, compose the three routes from Sanity:

- One `defineQuery` each in @oy/content, loaded through `loadQuery`.
- The layout options from each singleton.
- `cachePage(Astro, route, { draft: preview, failed: Boolean(error) })`, so a failed read is never
  cached.
- The Presentation locations through the route map (`programRoute` already maps a program's page), and
  `data-sanity` edit attributes as on /odunde.
- Every Pending wording the pages show registered in packages/content/src/pending.ts, so each page and
  the Studio's Pending view name the same item.
- Any URL from the Studio rendered through `safeHref`, and punctuation on Sanity strings trimmed or
  tested with `@oy/ui/content/sentence.ts` (Presentation appends a stega suffix).
- The seed extended only with confirmed facts.

Before the code review:

- **Prototypes:** compare the three pages with their prototypes at 375 and 1440. The `design` entry of
  .claude/launch.json serves them on 4399; see docs/runbook.md, "Comparing a page with its prototype".
  Fix what differs, and record in an ADR where a repo rule outranks a prototype.
- **Playwright and axe:** run them on the three routes at 375 and 1440, seeded and the way CI runs them
  (the placeholder project, `--workers=1`).
  - Assert that the register's mock values never stand in for an owed fact, with
    `expectNoMockWhileOwed` from packages/web/e2e/helpers.ts.
  - Add the routes to e2e/targets.spec.ts and to the heading-order check in e2e/a11y.spec.ts.
  - Keep the earlier suites green. At pull request 6 the suite had 126 tests: seeded, 118 passed and 8
    skipped; placeholder, 93 passed and 33 skipped.
- **Lighthouse:** append the routes to lighthouserc.cjs and run lhci on the local production build (or
  on the preview once ticket 28 is done). Report the numbers against docs/design/QUALITY.md section 3.
- **Checks:** `bun check`, `bun run build` and the Storybook build pass.

Run /code-review on the whole diff, fix what it finds, commit, open the pull request, and stop. Run
/handoff before ending and save it to docs/plans/handoff-phase-6.md, with a wayfinder ticket listing
the program pages' owed facts (as ticket 38 does for the event pages) and the Phase 7 prompt as
docs/plans/prompt-phase-7.md. Leave every `Owner: yes` ticket for me to answer, and do not merge. I will
check the three pages in the Studio and on the preview myself.
