# Handoff: Phase 5, the Odunde and Gala event pages

Written 12 September 2026 at the end of the Phase 5 session, for the owner's follow-ups and the session
that runs Phase 6. Branch: `phase-5/event-pages`, pull request
https://github.com/Oba-One/omo-yoruba-website/pull/6 against `main` (its body lists what is in it and
the checks). Tickets: `docs/tickets/phase-5/` (the spec from the grill and eleven tickets, all resolved,
each with a Comments section). Research with sources: `docs/research/phase-5-photo-carousel-custom-element.md`,
`phase-5-portable-text-renderer.md`, `phase-5-yoruba-font-subsets.md`. Decisions: ADRs 0024 to 0028.
Wayfinder tickets 33 and 34 resolved; 36, 37 and 38 opened for the owner.

## Where it stands

- Pull request 6 is open, and CI had not reported when this was written. Everything ran locally on
  the last commit:
  - `bun check`: 107 files, 534 tests.
  - `bun run build` and the Storybook build (the carousel's play functions finish in the canvas).
  - Playwright on the whole suite: seeded 118 passed and 8 skipped; placeholder project (CI) 93 passed
    and 33 skipped.
  - Lighthouse numbers are in ticket 10 and the pull request.
- The seams the next pages reuse:
  - `packages/web/src/lib/sanity/view.ts`: `resolveImage`, `cleanText`, `editAttributes` and
    `pastAlbumView`.
  - The builders `festival-page.ts` and `gala-page.ts`.
  - `@oy/content/lead-event`: `pageEdition` and `pastEdition`.
  - `@oy/content/take-part`: the ways in and `wayAction`.
  - `pendingWhat` and `presenceWhat` in the registry.
  - `cachePage(Astro, route, { draft, failed })`.
  - `safeHref` in `@oy/ui` `core/ActionButton/action.ts`, and the stega-safe `content/sentence.ts`.
  - The e2e helpers `settle`, `openEnquiry` and `expectNoMockWhileOwed`.
  - Component rows are in `docs/design/COMPONENT-MAP.md`.

## Owner follow-ups, in order

1. **Ticket 36:** check both pages in the Studio and on the preview, then merge pull request 6. The
   ticket also covers two small jobs:
   - Delete the empty `PUBLIC_EVENTBRITE_URL=` line from `packages/web/.env.example`. The agent's
     permissions deny that file.
   - Set the Gala's Awards option to hidden if the Gala gives no awards. The development dataset
     stores `shown`.
2. **Ticket 38:** the owed facts, now with the seeded captions.
   - Six photo captions in `development` still carry unmarked Yoruba words: `agbada` (four), `fila`,
     `akara` and `shekere`.
   - The seed marks them now, but it only fills missing fields.
   - Either edit each caption and alt text in the Studio, or run `bun seed -- --replace`. That
     overwrites every seeded document, edits included.
3. **Ticket 37:** the carousel's controls (ADR 0027's answers).
4. **Ticket 35:** fonts.
   - Some single mobile Lighthouse runs of the event pages reach CLS 0.06 to 0.071, above the 0.05
     budget, although lhci's aggregate passes.
   - The cause is the font swap: the photo header's height changes by 37px when the web fonts arrive.
     The ticket has the measurements.
   - Metric-matched fallback faces would close it.
5. **Still open from earlier phases:**
   - Owner tickets 25, 27, 28, 29, 30, 31 and 32.
   - Content tickets 02, 03, 04, 05, 06 and 09.
6. **Two questions without a ticket:**
   - The performer enquiry's blurb says "Five questions" but the form asks six
     (`packages/content/src/enquiry-kinds.ts`, Phase 3 copy).
   - `PUBLIC_ZEFFY_EMBED_URL` is still declared in the env schema of `packages/web/astro.config.ts`,
     although the Give Dialog reads the Zeffy URL from the settings (the Phase 3 handoff, item 6).

## Decisions made without the owner (reverse any)

The grill's answers in `docs/tickets/phase-5/spec.md` are the owner's.

**Settled by a rule that outranks the prototype:**

- The carousel's five choices (ADR 0027, ticket 37).
- The departures listed in ADR 0028.
- The footer's headings are h2, for axe's heading-order rule.

**Made by the code review** (commit `b26e2ed`):

- **Edition rule.** It reads the calendar in Los Angeles. An edition with a start and no end counts
  until that day ends there. An undated edition stays ahead through the last month of its season
  (ADR 0024).
- **Failed reads.** A render whose Sanity read failed is never cached. During an outage every request
  re-renders, rather than serving Pending chips from the cache.
- **Studio links.** `safeHref` keeps http, https, mailto, tel and same-site links. Anything else
  renders no link, or the "the link" chip where a button expected one.
- **Sponsor levels.** Odunde-scoped levels show on no page, and Presentation says so. `/odunde` has
  no sponsor levels block.
- **Credit line.** An album with a confirmed credit but no photographer named draws no credit line.
- **Diacritics list.** It gains agbádá, fìlà, àkàrà and ṣẹ̀kẹ̀rẹ̀ (`packages/lint/yoruba-terms.json`).
  Confirm the tone marks.
- **Mock values in e2e.** A prototype's mock value (dates, prices, the venue) fails a spec only while
  that fact's Pending chip is showing. A confirmed fact that happens to match the prototype passes.

**Label casing:** the glance and plan-your-visit labels stay uppercase. `oy-components.css` and the
prototypes draw them as kickers (12px, bold, tracked, terracotta). The carousel's count is not a
kicker and is sentence case. To reverse, drop `text-transform` from `.oy-glance b` and `.oy-fact b`.

## Known gaps

- **Tier presence.** The registry's `ticketTier` presence row counts tiers of every edition.
  - Once any gala has tiers, the Studio stops listing "three prices and what each includes", while
    `/gala` still shows that chip for a next edition without tiers.
  - A presence row cannot name the next edition, and a condition row on the event would list past
    galas as well.
- **`pendingWhat` fallback.** Both builders ask for the schedule time's wording with
  `pendingWhat('event', 'schedule', kind)`.
  - `fields` match exactly (`schedule[]`), so the lookup falls back to the first condition row naming
    `schedule[`, whatever the kind.
  - Both kinds say "the time" today, so nothing is wrong yet. Make the fallback respect `kind` before
    the two wordings diverge.
- **Cleanup the review left** (no change in behaviour):
  - The two builders repeat the header, glance, past years and take-part skeleton.
  - `export { WAY_INS }` in `packages/content/src/schema/singletons/index.ts` has no importer.
  - `homepage.ts` re-exports `BuildOptions` and aliases `cleanText` as `clean`.
  - No caller passes `ZoneGrid`'s `expected`.
  - `PathRow` takes two input shapes.
  - `TakePartBand`'s `vendorTerms` is three-state.
  - The carousel's `labelledby` prop has no test.

## Environment notes

Phase 4's notes still hold (`docs/plans/handoff-phase-4.md`, `docs/runbook.md`). New in Phase 5:

- **Reading the dataset.** `bun run --filter @oy/content query -- '<groq>'` reads `development`. The
  Sanity MCP needs OAuth, which an agent session cannot complete.
- **Playwright.** Stop the 4321 and 6006 previews first and run with `--workers=1`. The prefix
  `PUBLIC_SANITY_PROJECT_ID=placeholder SANITY_API_READ_TOKEN= SANITY_API_WRITE_TOKEN=` runs the
  suite as CI does.
- **Stale styles.** The Astro dev server can serve an edited `@oy/ui` component's old scoped
  stylesheet until it restarts.
- **Prototype previews.** The `design` entry of `.claude/launch.json` serves the prototypes on 4399
  (the runbook, "Comparing a page with its prototype").
- **Storybook play functions** run only in the canvas. Open `iframe.html?id=<story-id>` and wait for
  `window.__STORYBOOK_PREVIEW__.currentRender.phase` to reach `finished` (a failure ends `errored`).
- **heading-order.** Lighthouse counts axe's best-practice rules, which the WCAG-tagged Playwright
  runs skip. Add each new route to the heading-order check in `packages/web/e2e/a11y.spec.ts`.
- **Pending chips in containers.** A container rule in `oy-components.css` that styles its `span`
  children out-specifies `.oy-pend`. Add the container to the chip rules, as
  `.oy-lrow-tier span.oy-pend` does.
- **Stega.** Text from Sanity ends in an invisible stega payload inside Presentation. Trim or test
  punctuation with `@oy/ui/content/sentence.ts`, never with an end-anchored regex on the raw string.
- **Studio URLs.** URL validation runs only in the Studio, so API and seed writes skip it. Render any
  Studio URL through `safeHref`.
- **Permissions.** The agent's permissions deny `packages/web/.env.example` for both Read and Bash.

## Suggested skills for the next session

The paste-ready prompt for Phase 6 (the program pages) is `docs/plans/prompt-phase-6.md`. Start it
after pull request 6 merges.

- **Before building:** `/grill-with-docs` on the program seam, then `/to-tickets`.
- **Per ticket:** `/implement`, with `tdd` for the builders and registry rows.
- **New libraries:** `research` before any is pinned. An accordion should need none.
- **Repo skills:**
  - `oy-page`: the three routes from their prototypes, compared at 375 and 1440.
  - `oy-component`: YearStrip, Accordion, ContactBlock.
  - `oy-content-model`: programsPage, lessonsPage, collectivePage.
  - `oy-voice`: Lessons copy, never "School".
  - `oy-content-ops`: the owner's Studio follow-ups above.
- **Closing:** `wayfinder` for the map, `/code-review` before the commit, and `/handoff` at the end.
