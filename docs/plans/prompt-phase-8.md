# Prompt: Phase 8, gallery

Written 13 September 2026 at the end of Phase 7, to paste into a fresh session at the repo root once the
Phase 7 pull request has merged (wayfinder ticket 41). It extends the Phase 8 prompt in
`docs/design/PROMPTS.md` with what Phases 5 to 7 learned.

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-phase-7.md (if the owner ran /handoff; otherwise the Phase 7
tickets' comments in docs/tickets/phase-7/issues/ and ADRs 0034 to 0036), docs/plans/wayfinder.md with
tickets 09, 37 and 42, docs/design/ROUTES-AND-INTERACTIONS.md sections 1, 3, 4 and 5 for /gallery and
/gallery/[album], docs/design/CONTENT-MODEL.md for album, photographer, galleryPage and oyImage, ADR 0027
(the photo carousel, whose open choices the Lightbox shares) and docs/design/COMPONENT-MAP.md. Open
docs/design/design/18 Photo Gallery.dc.html in full: it is the fidelity bar at 375 and 1440, in its
mosaic, album and viewer states. Every rule in AGENTS.md holds: never invent content (no date, name,
caption, credit or consent line), Pending for every empty required field, one gold action per screen
view, full diacritics, "Odunde" unmarked in display text, alt text that describes the moment, credits per
album with `creditConfirmed` shown honestly, and no filters on the gallery.

Work on a new branch phase-8/gallery cut from main after the Phase 7 pull request merges, and finish by
opening a pull request against main.

Run /grill-with-docs on the gallery seam before building: the album mosaic's order and density (an album
without a date, as the summer camp's; the `soon` state when no album is published), what a tile shows
(cover, title, count, credit, captions always or on hover by the `captions` option), the album page's grid
and what `open: viewer` and `open: grid` change, the Lightbox (`<dialog>`, arrows, swipe, Escape, focus
back to the tile, caption and credit inside, `?photo=<key>` written with `history.pushState` and Back
closing it), and how a shared `?photo=` link squares with "nothing opens on load except `#give`" in
AGENTS.md and ROUTES section 3: decide it with the owner and record it. Settle ticket 37's swipe answer for
the carousel and the Lightbox together. The credits and consent copy come from
`galleryPage.creditsAndConsent` and each album's `credit`, `creditConfirmed` and `consentNote`; the
album photographs' captions are the register's until the owner confirms them (ticket 09). Layout options
keep the names in packages/content/src/layout-options.ts (galleryPage: open, captions, state). Update
CONTEXT.md and add ADRs as decisions land. Then /to-tickets and /implement.

Build in @oy/ui with stories and tests, each variant a story and each empty state Pending: AlbumTile
(captions always or on hover, density) and Lightbox, an inline-script custom element like
`oy-photo-carousel` (ADR 0018, ADR 0027: a `<script is:inline>` guarded by `customElements.get`, copy from
data attributes, `data-ready` once wired, play functions that wait for it and drive the keyboard); reuse
PhotoTile, PhotoMosaic, CreditLine, PageHeader, Section, SectionHead and Handoff rather than forking them.
Fixtures hold the register's photographs with their confirmed captions, the bracketed placeholder form for
owed copy and Pending states only; no dates, even as ISO strings. Add one page-section story per layout
option.

In packages/web: compose both routes from Sanity, one defineQuery each in @oy/content through loadQuery
(filter a singleton by `_type` and `_id`; the album route by slug, with a 404 for an unknown slug), layout
options from the singleton, the page skeleton, cachePage with `{ draft, failed }` (an album page tags
`album` and `photographer`), the Presentation locations through the route map and data-sanity edit
attributes on every option's container and every photograph. Clean stega with `cleanText` before a value
becomes a key, an href or a comparison (a photo's `_key` in the URL most of all), render Studio URLs
through `safeHref`, and register every Pending wording in packages/content/src/pending.ts, reading a
condition row's wording from a named constant. Extend the seed only with confirmed facts; to change a
value an earlier seed wrote, add a revision (`buildRevisions`, ADR 0035), never an overwrite.

Before the code review, compare both routes and the open viewer with the prototype at 375 and 1440 (the
`design` entry of .claude/launch.json serves the prototypes on 4399; docs/runbook.md, "Comparing a page
with its prototype": a prototype's runtime can hide its theme, and its inline styles can override the
tokens' mobile rules), fix what differs and record in an ADR where a repo rule outranks the prototype.
Playwright and axe on both routes at 375 and 1440 in both data modes (`PLACEHOLDER_PROJECT` in
packages/web/e2e/helpers.ts; every test asserts something in both, `expectNoMockWhileOwed` holds the
register's inventions, `axeViolations` runs with the Lightbox open too), the deep link and history (open,
Back, forward, a shared link), the routes in the 44px targets sweep and the heading-order check, and the
earlier suites green with `--workers=1`; append the routes to lighthouserc.cjs and run lhci on the local
production build against QUALITY section 3 (a photograph-heavy page: watch LCP and the image sizes). Run
/code-review on the whole diff, fix what it finds, commit, open the pull request and stop. Ask the owner to
run /mattpocock-skills:handoff (the skill cannot be invoked by the agent) and save it to
docs/plans/handoff-phase-8.md; write the owed-facts wayfinder ticket and the Phase 9 prompt as Phase 7
did. Leave every `Owner: yes` ticket for the owner, and do not merge.
