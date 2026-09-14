# Prompt: deep review, design alignment and code quality

Written 13 September 2026 after Phase 8, to paste into a fresh session at the repo root once the Phase 8 pull request
has merged (wayfinder ticket 43). It can run before or beside Phase 9. It reviews; it does not fix, except where the
owner approves a finding in the session. Nothing merges.

---

Read AGENTS.md, CONTEXT.md, docs/plans/open-work.md, docs/plans/wayfinder.md, the latest handoff in docs/plans/,
docs/runbook.md, and in docs/design: README.md (sections 3, 5 and 8), ROUTES-AND-INTERACTIONS.md (all of it),
COMPONENT-MAP.md, QUALITY.md, CONTENT-MODEL.md and design/08 Build Brief.md (especially its polish passes 2 and 3).
Read the ADRs that record where the site differs from a prototype on purpose: 0023 (homepage), 0027 (photo
carousel), 0028 (event pages), 0033 (program pages), 0036 (trust pages) and 0040 (gallery). Every rule in AGENTS.md
holds while you review.

Work on a new branch review/alignment-and-quality cut from main. The deliverables are a report,
docs/plans/review-alignment-and-quality.md, and one ticket per finding under docs/tickets/review/issues/ in the
format of docs/agents/issue-tracker.md. Commit them, open a pull request with only the report and the tickets, and
stop. Fix nothing in this pass unless the owner approves a specific finding in the session; if they do, fix it on
the same branch with its test and note it in the report.

## Part 1: design alignment

The bar is docs/design/README.md section 8: every route matches its prototype block for block at 375 and 1440, every
component exists once in @oy/ui with its variants and states, and a named Pending placeholder stands wherever
content is owed. Earlier phases compared each page once, as it was built; this pass looks at the whole site
together, after every phase's changes to shared components, and at the parts no phase compared end to end.

1. **Routes against their prototypes**, at 375 and 1440, full page:
   - `/` and `02 Homepage.dc.html`; `/odunde` and `08 Odunde Festival.dc.html`; `/gala` and
     `09 End-of-Year Gala.dc.html`.
   - `/programs` and `10 Programs.dc.html`; `/programs/yoruba-lessons` and `11 Yoruba Language School.dc.html`;
     `/programs/cultural-collective` and `12 Yoruba Cultural Collective.dc.html`.
   - `/get-involved` and `13 Get Involved.dc.html`; `/impact` and `14 Impact.dc.html`; `/our-story` and
     `15 People and History.dc.html`; `/donate` and `16 Donate.dc.html`.
   - `/gallery`, `/gallery/<album>` and an open photograph with `18 Photo Gallery.dc.html`.
   - Where a layout option hides a block, compare the page-section story with the prototype's block shown.
2. **The chrome and the dialogs:** `Site Nav.dc.html` (desktop, the Events dropdown, the overlay under 760px, the
   current page on every route), `Site Footer.dc.html`, `Enquiry Modal.dc.html` (all eight kinds and five states,
   the bottom sheet under 720px), `Give Dialog.dc.html` (the embed and its fallback) and `Photo Carousel.dc.html`.
3. **The whole site as one:** `Omo Yoruba Site.dc.html` stitches the pages together. Walk it beside the site for
   consistency between pages: the nav's current state, section rhythm and padding, heading sizes, the one gold
   action per screen view, card and hover language, the cross-fade, and the same component looking the same
   everywhere.
4. **The library:** `01 Components.dc.html` against Storybook (`bun storybook`). Every shared component and every
   variant and state in the canvas should exist once in @oy/ui with its story. Note anything built twice, a
   page styling a library part locally, or a canvas component with no story.
5. **Behaviour:** `07 Interaction Inventory.dc.html` and ROUTES section 3, the fourteen interactions, each tried
   by hand once with and once without JavaScript where the site offers a no-JavaScript path.
6. **The design rules:** AGENTS.md "Rules that lint cannot catch", checked on every route: 6px cards with the aṣọ
   òkè edge, no hover lift and no photo zoom, the type scale and line heights, the 8px spacing grid and section
   padding, the 1100px content width, indigo carrying the weight, gold only for actions and never body text on
   light, green only inside Collective content, texture never costume, full diacritics (render the test string at
   each heading size), 17px minimum body, 44px targets, AA contrast in default, hover and focus. Precedence when
   sources disagree: `oy-components.css` beats `_ds/`, the Build Brief's polish passes beat the wireframes, the
   handoff beats the design system readme.
7. **Content honesty:** `19 Mock Content Register.dc.html`. Nothing the register marks invented appears anywhere,
   and every owed fact shows its Pending chip or line with the registry's wording.

Method: docs/runbook.md, "Comparing a page with its prototype". The `design` entry of .claude/launch.json serves the
prototypes on 4399 beside `bun dev` on 4321. Capture both at a device pixel ratio of 1 after a scroll pass, compare
section by section, and measure with `getComputedStyle` rather than by eye. Mind the recorded traps:
- A prototype's runtime can draw sections outside its theme scope.
- Inline styles can break a prototype's own mobile layout.
- `span.sc-interp` wraps interpolated strings, so a container's span rules restyle them.
- An edited component's scoped styles can stay stale in `astro dev` until the server restarts.

Classify each difference:
- **Accepted:** an ADR above already records it. Cite the ADR and move on unless the reason no longer holds.
- **Content:** Pending content, or a register invention kept out on purpose.
- **Drift:** a difference no ADR covers, including anything a later phase changed on an earlier page, such as the
  section lead spacing from Phase 7.
- **Rule conflict:** the prototype breaks a repo rule; say which rule wins and why.

Give every drift a severity: blocker (broken, inaccessible or misleading), major (visibly off the design), minor, or
polish.

## Part 2: code quality

Run /improve-codebase-architecture on the whole repository first and list its candidates in the report. Then review
the codebase by area, not a diff. Use parallel reviewers, one per area:
- packages/content: schema, structure, registry, queries, seed, functions, validation.
- packages/ui: components, stories, tests, tokens.
- packages/web: pages, builders, actions, middleware, caching, preview, CSP, e2e.
- CI, scripts and the documents.

The standards are AGENTS.md, the repo skills in .claude/skills, the READMEs, the ADRs and QUALITY.md. Look for:

- **Correctness:**
  - Stega reaching a key, an href or a comparison.
  - A failed Sanity read that caches, or shows invented content instead of Pending.
  - Cache tags that miss a type a page reads, or purge routes that miss a page.
  - Draft mode leaking into the cache.
  - Enquiry actions that trust input the Zod schema does not check.
  - The webhook's signature check, the preview secret, and rate or size limits on public endpoints.
- **Consistency:**
  - One way to do each thing: builders, view helpers, edit attributes, the route map, the registry's constants.
  - Duplicated code across the phases' builders and components.
  - Dead exports, retired fields still read, stale comments.
- **Tests:**
  - Every e2e test asserts something in both data modes.
  - Unit tests that pass whatever the code does (a `toContain` that cannot fail).
  - Behaviour with no test.
  - Stories missing their Default, variant, Pending or OnDark state.
- **Accessibility and performance:**
  - Axe clean with every dialog open; heading order; focus return.
  - Lighthouse budgets, image sizes and client JavaScript per route.
- **Documents:** CONTEXT.md, the ADRs, the component map, the READMEs, the runbook and the content-ops skill
  describe the system as built; flag every contradiction.

Verify each finding against the code before reporting it, with file and line. Mark a baseline smell (duplication,
naming, feature envy) as a judgement call, never as a bug.

## The report

- **Opening:** a summary of the worst findings.
- **Findings table:** one row per finding, with columns for the id, the area (route, component or package), the
  finding in one line, the evidence (capture path, computed value, or file and line), the severity, the class for
  design findings, the proposed fix, its size (S/M/L), and whether it needs an owner decision.
- **Grouping:** blockers first, then design drift by route, then code quality by package.
- **Closing:** a list of what was checked and found clean, so the next review does not repeat it.

Run `bun check`, `bun run build`, the Storybook build and Playwright in both data modes with `--workers=1` once at the
start. Record the results as the baseline, and treat any failure as a blocker finding. Ask the owner to run
/mattpocock-skills:handoff at the end (the agent cannot invoke it) and to triage the tickets.
