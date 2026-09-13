# Handoff: Phase 7, conversion and trust

Written 13 September 2026 at the end of the Phase 7 session, for the owner's follow-ups and the session
that runs Phase 8. Branch: `phase-7/conversion-and-trust`, pull request
https://github.com/Oba-One/omo-yoruba-website/pull/8 against `main` (its body lists what is in it, the
checks, the Lighthouse numbers and what the review left). Tickets: `docs/tickets/phase-7/` (the spec from
the grill and sixteen tickets, each with a Comments section). Decisions: ADRs 0034 to 0036. Wayfinder
tickets 41 and 42 opened for the owner. The paste-ready prompt for Phase 8 (the gallery) is
`docs/plans/prompt-phase-8.md`.

## Where it stands

- Pull request 8 is open and nothing is merged. When this was written, CI on `8b08693` had 10 checks
  passing, none failing, and "Playwright and axe" still running; GitHub reports it mergeable.
- Local checks after the code review's fixes (`eb52ce4`):
  - `bun check`: 131 files, 751 tests.
  - `bun run build` and the Storybook build (all 58 Phase 7 stories prerendered without an error).
  - Playwright, the four trust specs with the targets sweep and the heading-order check: 83 passed and 3
    skipped in each data mode (the skips are viewport-only checks).
  - The whole suite last ran before the review: seeded 246 passed and 8 skipped; placeholder project (CI)
    217 passed and 37 skipped.
  - Lighthouse for all ten routes, both presets, is in ticket 15 and the pull request.
- The prototype comparison (ticket 15, ADR 0036) fixed eight differences and recorded the rest. The code
  review ran on the whole diff in two axes, three reviewers each, split by area; what it fixed is in
  `eb52ce4`'s message, and what it left is in the pull request and "Known gaps" below.
- `development` holds everything the seed now writes, the Phase 7 revisions included (the Get Involved
  doors, the two unset header actions, Impact's captions, headline order and associations label, Our
  Story's volunteer chip, Donate's give-now facts and tax line). `bun seed -- --dry-run` now reports 0
  revisions due there.
- The seams Phase 8 reuses:
  - `packages/web/src/lib/sanity/view.ts` gained `textOr`, `oneLine` and `present` beside `cleanText`;
    `page-skeleton.ts` is unchanged in shape.
  - `@oy/content/pending`: rows can narrow by `group` as well as `kind`, including `in [...]`; named
    constants for every condition row's chip; `presenceWhat(type, kind)` by kind or group.
  - The seed's `buildRevisions` (with an optional `id`) for any value an earlier seed wrote.
  - `@oy/content/doors`, `@oy/content/giving`, `programHref` in `@oy/content/routes`.
  - In `@oy/ui`: `OutcomeCard`, `Timeline`, `Split`'s `align`, `SectionHead`'s `swatch`, `PhotoMosaic`'s
    six, `Section`'s dark ground; component rows in `docs/design/COMPONENT-MAP.md`.
  - The e2e helpers gained `bodyOption` and `expectGiveRoundTrip`.

## Owner follow-ups, in order

1. **Ticket 41:** check the four pages in the Studio and on the preview, then merge pull request 8. It
   holds two calls: the green volunteer chip on Our Story (ADR 0036), and the section-lead spacing that
   changed on every page (Chromatic baselines move with it). Until the merge deploys, the Studio on `main`
   does not know the new fields; edit the trust pages from the pull request's preview.
2. **Ticket 42:** the trust pages' owed facts. Two seeded lines need your word first:
   - The give-now blurb's "one time or monthly" and "Your receipt arrives by email straight away". They
     sit beside chips that mark monthly giving and the receipt as owed; Q14 kept the blurb, so it stays
     until you confirm or change it.
   - The larger-scale intro's "Named levels" and "we send the deck".
3. **Ticket 07:** the Our Story timeline stays hidden until you confirm its entries.
4. **Tickets 02 and 03:** the EIN, the address, the phone, the routing contacts and the Zeffy link fill
   chips on all four trust pages at once.
5. **Tickets 26, 36 and 39** can be closed: pull requests 5, 6 and 7 have merged.
6. **Still open from earlier phases:**
   - Owner tickets 25, 27, 28, 29, 30, 31, 32, 37, 38 and 40.
   - Content tickets 04, 05, 06 and 09, and the setup tickets 08, 10, 11, 12, 13, 17, 18 and 22.
   - Session ticket 35 (fonts): `/`, `/odunde` and `/gala` still miss mobile LCP or CLS on this machine
     (ticket 15's table).

## Decisions made without the owner (reverse any)

The grill's answers in `docs/tickets/phase-7/spec.md` are the owner's. ADR 0036 lists where a rule
outranks a prototype and the seeded copy taken from the prototypes. Beyond those, from the code review:

- **Placeholder outcome cards take the outcome's own chip.** They show "participation figures or what is
  being measured" rather than "participation figures per program", a reading of Q6's "each its name and
  the chip" (`impact-page.ts`).
- **Donate's box to Impact** promises "a source line under every number" only while Impact's `sources`
  option shows them. `donatePageQuery` reads that option, and a publish of `impactPage` now purges
  `/donate` too (`routes.ts`).
- **The give door's bullets are not owed.** The registry row excludes the give door, which no page draws
  with bullets (`pending.ts`).
- **An empty give-now list** shows its own chip, "the give-now facts".
- **Registry labels:** the Where labels that said "About" now say "Our Story", and Donate's rows name
  their sections.
- **The Studio's help text** for an other way's detail no longer names the register's payment platform.
- **Stega:** any value directly under `layout` stays clean by its parent, and `doors` left
  `STEGA_LOGIC_KEYS` so the Gala's doors time keeps click-to-edit (`stega.ts`).
- **Governance** reads a dated document before an undated one of the same kind (`trust-pages.ts`).
- **Seed revisions:** a revision can name one document (`SeedRevision.id`), and the dry run counts the
  revisions due rather than those defined.

## Known gaps

- **The populated states in a browser.** No person, outcome, governance document, giving level, other way,
  partner, testimonial or association exists in either dataset, and both datasets hold the layout
  defaults. Those states and the non-default options run only in the unit and story tests.
- **Test coverage after the review.** Only the trust specs, the targets sweep and the heading-order check
  re-ran locally after `eb52ce4`. Its other changes (the glance note link's 44px, component defaults,
  stories) are unit-tested, and CI runs the whole suite on the pull request.
- **Lighthouse** ran on the build before the review's fixes. Those fixes are CSS and copy only.
- **The Receipt cell** finds the give-now fact by its label, as Q17 decided; renaming that fact removes
  the cell.
- **The review's judgement calls left as they are:**
  - The outcome's `kind` field and preview repeat the year strip row's.
  - Phase 6's program anchors are still literals beside `INLINE_PROGRAM_SECTIONS`.
  - `StatStrip` draws its cell once per variant.
  - `ContactBlock`'s `part="both"` and `label={false}` have no page yet.
  - `label` is a chip switch on `DoorCard` and a button label on `ContactBlock`.
  - The page-section story builders take bare booleans.
  - `rowKinds` still reads kinds back out of GROQ filters.
- **TypeGen unions.** Phase 6's note stands for `festivalPageQuery`, `galaPageQuery`, `homepageQuery` and
  `siteSettingsQuery`.

## Environment notes

The notes in `docs/plans/handoff-phase-6.md` and `docs/runbook.md` still hold (the owner-only handoff
skill, denied `curl` and `sleep`, serving `.vercel/output` for lhci, prototype captures). New in Phase 7:

- **Changing a seeded value.** Add a `SeedRevision` in `buildRevisions`
  (`packages/content/scripts/seed-data.ts`), never an overwrite. It applies only to the seed's own
  documents and only while the stored value deep-equals the earlier seed's; `withKeys` keys start at 1
  (`stat-1`). Check with `bun seed -- --dry-run` first.
- **GROQ ordering.** `order(field desc)` puts documents with no value first (checked against the dataset).
  Order by `defined(field) desc, field desc` for the newest dated one.
- **Prototype traps** (also in the runbook's comparison section):
  - `15 People and History.dc.html` draws everything from the board on outside `.oy-home`.
  - `16 Donate.dc.html`'s inline split columns break its own layout at 375.
  - A block hidden on the dataset (Our Story's timeline) is compared by forcing the prototype's section
    visible and opening the story's `iframe.html?id=...`.
- **Wider headings.** The weight-only Source Serif 4 (ADR 0026) sets headings and figures about 8 percent
  wider than the prototypes' cut, so a heading can wrap where the prototype fits.
- **Checking the static Storybook.** `packages/ui/storybook-static/astro-prerendered-stories.json` holds
  every story's prerendered HTML by id; scan it for errors instead of serving the build.
- **The review's reviewers** took 8 to 13 minutes each in the background; editing files while they read
  would make their line references stale, so wait for all six before fixing.
- **CI's Lighthouse jobs** report success while the bypass secret is missing (they skip with a notice,
  ticket 28).

## Suggested skills for the next session

The paste-ready prompt for Phase 8 (`/gallery` and `/gallery/[album]`) is `docs/plans/prompt-phase-8.md`.
Start it after pull request 8 merges.

- **Before building:** `/grill-with-docs` on the gallery seam, then `/to-tickets`. Two questions to settle
  first:
  - How a shared `?photo=<key>` link squares with "nothing opens on load except `#give`".
  - Ticket 37's swipe answer, which the carousel and the Lightbox share.
- **Per ticket:** `/implement`, with `tdd` for the builders, the registry rows and the Lightbox's
  history handling.
- **New libraries:** `research` before any is pinned (the Lightbox follows ADR 0018 and ADR 0027 with no
  library); the owner's yes before installing.
- **Repo skills:**
  - `oy-component`: `AlbumTile` and `Lightbox`, an inline-script custom element with play functions.
  - `oy-page`: the two routes from `18 Photo Gallery.dc.html`, compared at 375 and 1440.
  - `oy-content-model`: `album`, `photographer`, `galleryPage` and their registry rows.
  - `oy-voice`: alt text, captions, credits and the consent copy.
  - `oy-design-system`: the mosaic, the viewer and the dark overlay.
  - `oy-content-ops`: the owner's Studio follow-ups above.
- **Closing:** `wayfinder` for the map, `/code-review` on the whole diff before the pull request, and ask
  the owner to run `/mattpocock-skills:handoff` at the end.
