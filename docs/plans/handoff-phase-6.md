# Handoff: Phase 6, the program pages

Written 13 September 2026 at the end of the Phase 6 session, for the owner's follow-ups and the session
that runs Phase 7. Branch: `phase-6/program-pages`, pull request
https://github.com/Oba-One/omo-yoruba-website/pull/7 against `main` (its body lists what is in it, the
checks and the Lighthouse numbers). Tickets: `docs/tickets/phase-6/` (the spec from the grill and thirteen
tickets, each with a Comments section). Research with sources: `docs/research/phase-6-faq-accordion.md`.
Decisions: ADRs 0029 to 0033. Wayfinder tickets 39 and 40 opened for the owner. The paste-ready prompt
for Phase 7 is `docs/plans/prompt-phase-7.md`.

## Where it stands

- Pull request 7 is open and nothing is merged. CI passed all 11 checks on `491de64` and GitHub reports
  it mergeable. Locally, after the code review's fixes (`f0b5ff2`):
  - `bun check`: 121 files, 654 tests.
  - `bun run build` and the Storybook build (its 13 play functions finish in the canvas).
  - Playwright on the whole suite: seeded 174 passed and 8 skipped; placeholder project (CI) 149 passed
    and 33 skipped.
  - Lighthouse numbers for all six routes are in ticket 12 and the pull request.
- The code review ran on the whole diff in two axes, three reviewers each, split by area. What it found
  and what was fixed is in `f0b5ff2`'s message and this handoff's "Known gaps"; nothing it rated hard is
  left open.
- The seams the next pages reuse:
  - `packages/web/src/lib/sanity/page-skeleton.ts` (`pageSkeleton`, `glanceFacts`, `pastYears`) beside
    `view.ts`, and the builders `programs-page.ts`, `lessons-page.ts` and `collective-page.ts`.
  - `@oy/content/pending`: `pendingWhat(type, field, kind)`, `presenceWhat(type, kind)`, the
    `fieldRows` helper, and a named constant where a page needs a condition row's wording
    (`TEACHER_EMAIL_PENDING`).
  - `@oy/content/take-part` (`WAY_INS`, `WAY_CHIPS`, `isQuietWay`, `wayAction`),
    `@oy/content/routes` (`EVENT_PAGE_NAMES`), `@oy/content/lead-event` (`collectiveEvents`).
  - `@oy/ui/content/edition-dates` (`monthDay`, `weekdayTime`): pages word dates, components take text.
  - In `@oy/ui`, built for Phase 7: `ContactBlock`, `PersonCard`'s `bioPending`, `FactList` links with a
    44px target, `Section`'s `width="narrow"`.
  - The e2e helpers `PLACEHOLDER_PROJECT`, `axeViolations` and `expectEnquiryRoundTrip`, beside
    `settle`, `openEnquiry`, `expectNoMockWhileOwed` and `goldSharingAView`.
  - Component rows are in `docs/design/COMPONENT-MAP.md`.

## Owner follow-ups, in order

1. **Ticket 39:** check the three pages in the Studio and on the preview, then merge pull request 7. It
   holds three calls: the Programs header's gold "Enrol a learner", the white handoff box on a tinted
   section, and the capitals in the Collective's pills. Until the merge deploys, the Studio on `main`
   does not know the new fields; edit the program pages from the pull request's preview.
2. **Ticket 40:** the program pages' owed facts, with three older lines to confirm: "Video call" on the
   Lessons glance, "Online, scheduled with the teacher" on the year strip, and the enrol form's "settled
   after the first lesson".
3. **Ticket 31:** a photograph of the Collective, which the homepage card, the Programs card and the
   Collective page share.
4. **Ticket 35:** fonts. On this machine the event pages' mobile layout shift now fails lhci's aggregate
   (0.060 on `/odunde`, 0.063 on `/gala`, the glance band moving on the font swap), where Phase 5 saw it
   in single runs only. Same cause; metric-matched fallback faces would close it.
5. **Ticket 36** can be closed: pull request 6 merged on 13 September 2026.
6. **Still open from earlier phases:**
   - Owner tickets 25, 27, 28, 29, 30, 32, 37 and 38.
   - Content tickets 02, 03, 04, 05, 06 and 09.
   - The Phase 5 handoff's two questions without a ticket (the performer enquiry's "Five questions",
     and `PUBLIC_ZEFFY_EMBED_URL` in the env schema) are untouched.

## Decisions made without the owner (reverse any)

The grill's answers in `docs/tickets/phase-6/spec.md` are the owner's. ADR 0033 lists where a rule
outranks a prototype. Beyond those:

- **Kickers on the strong green tint** take terracotta 700: terracotta 600 measures 4.42:1 on
  `--green-50`, under AA at 12px (`oy-components.css`).
- **A handoff box on an alternate ground** is white, since the tokens' box is tinted like the ground and
  vanishes (`Handoff.astro`, ADR 0033).
- **The initiative section carries the collective scope itself** as well as sitting inside the page's
  (ADR 0031's consequences), so its greens hold in a component story.
- **Registry rows the spec did not list:** the Lessons glance with no facts ("the facts at a glance"), a
  linked teacher's missing short bio (listed only for the person the Lessons page links), a level
  without its line, a step without its place, and an empty year strip.
- **The Studio's count of Collective events still to come** requires a start, as the page does.
- **The take-part row's chip now reaches the event pages** (their queries project `chip`); the Studio
  already offered it and the new ways in there.
- **`--green-700` is `#1f5c41`**, the spec's value and the volunteer chip's, 6.6:1 on its tint.
- **The year strip row** errors in the Studio when it names neither a program nor an event.

## Known gaps

- **"Ask to join" in a browser.** The loop that opens the contact form from a Collective event runs
  only once a dated collective event exists; none does in either dataset. Ticket 10's box for it stays
  unticked; the trigger's markup is unit-tested.
- **Layout options in Playwright.** The specs read each option from the page and branch on it, but both
  datasets hold the defaults, so the non-default branches run only in the unit and story tests.
- **Keyboard in the play functions.** Storybook's synthetic Enter and Space cannot toggle a native
  summary, so the Accordion and Disclosure play functions click and Tab; Playwright presses the keys
  (ADR 0032).
- **`keepsOwnList`** is stored and unread; the Updates row always points at the site newsletter
  (ADR 0029, ticket 40).
- **TypeGen unions.** `festivalPageQuery`, `galaPageQuery`, `homepageQuery` and `siteSettingsQuery`
  filter by `_id` alone, so TypeGen types each result as a union over every document type; the program
  queries add `_type` and get the singleton alone. Harmless today, worth aligning.
- **The review's judgement calls left as they are:**
  - `rowKinds` reads a row's kind back out of its GROQ filter.
  - `EntryList`, `EventList` and `SponsorLevels` share one list shape.
  - `PullQuote` repeats its three states for the single variant.
  - `page-skeleton.ts` also holds the event pages' `pastYears` and `GLANCE_MAX`.
  - The Phase 6 blocks in `oy-components.css` sit mid-file rather than at its end.
  - The four builders word their take-part intros with the same count shape.
  - Pages pass `PageHeader` and `TakePartBand` their props one by one.

## Environment notes

Phase 4's and Phase 5's notes still hold (`docs/plans/handoff-phase-4.md`,
`docs/plans/handoff-phase-5.md`, `docs/runbook.md`). New in Phase 6:

- **The handoff skill** runs only when the owner invokes `/mattpocock-skills:handoff`; the agent's Skill
  tool refuses it. Write the wayfinder tickets and the next prompt without it.
- **Local HTTP from the shell.** `curl` against localhost and `sleep` loops are denied. Probe a local
  server with `fetch` inside a Chrome DevTools MCP page.
- **Lighthouse on the production build.** Serve `.vercel/output` with a scratch server built from the
  runbook's recipe (static files, the render function's `fetch`, brotli, an edge cache), started from
  `packages/web` as `node --env-file=.env <server> <repo> 4400` so the agent never reads `.env`. Point
  `CHROME_PATH` at Playwright's Chromium and run `bun run lighthouse` with `LIGHTHOUSE_BASE_URL`; the
  reports land in `packages/web/.lighthouseci/` (ignored). Move the previous run's directory aside
  first.
- **Prototype captures.** Chrome DevTools MCP full-page screenshots into `test-results/` at a device
  pixel ratio of 1, then ImageMagick to crop each section pair side by side. The Collective prototype's
  runtime hides its theme (the runbook's comparison section).
- **Storybook limits** (`packages/ui/README.md`, "Known limits"): a configured slot tree deeper than
  about ten levels renders `[object Object]`, and string decorators strip `data-*` attributes.
- **`gh pr create`** failed three times on GitHub API errors before it worked. Check
  `gh pr list --head <branch>` between retries so no duplicate opens.
- **Both data modes.** Assert something in every branch of an e2e spec; `PLACEHOLDER_PROJECT` says
  which mode runs. A locator that matches nothing makes a loop pass silently (the initiatives check did,
  until the review).

## Suggested skills for the next session

The paste-ready prompt for Phase 7 (Get Involved, Impact, Our Story, Donate) is
`docs/plans/prompt-phase-7.md`. Start it after pull request 7 merges.

- **Before building:** `/grill-with-docs` on the trust seam (Impact's figures and sources, Our Story's
  timeline and ticket 07, the doors, Donate's giving levels), then `/to-tickets`.
- **Per ticket:** `/implement`, with `tdd` for the builders and registry rows.
- **New libraries:** `research` before any is pinned; the owner's yes before installing.
- **Repo skills:**
  - `oy-page`: the four routes from their prototypes, compared at 375 and 1440.
  - `oy-component`: `OutcomeCard`, `Timeline`, and what the grill adds.
  - `oy-content-model`: getInvolvedPage, impactPage, storyPage, donatePage and their documents.
  - `oy-voice`: claims, sources and the giving copy.
  - `oy-content-ops`: the owner's Studio follow-ups above.
- **Closing:** `wayfinder` for the map, `/code-review` before the commit, and ask the owner to run
  `/mattpocock-skills:handoff` at the end.
