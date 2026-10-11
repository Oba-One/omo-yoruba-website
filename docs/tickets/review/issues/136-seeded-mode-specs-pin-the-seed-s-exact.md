# 136: Seeded-mode specs pin the seed's exact words, titles and counts in the dataset members now edit

Labels: infra
Status: open
Blocked by: none

**Finding** (R136 in `docs/plans/review-alignment-and-quality.md`; e2e: seeded mode; minor; tests): The first real album, a new hero heading or a published price turns the local seeded run red without any defect, which trains people to ignore it just as members start editing. Verified by reading the three specs against the seed and the runbook's dataset facts.

**Evidence:** packages/web/e2e/home.spec.ts:44 decides the mode from the hero heading's seeded words and :51 fails on any dollar figure on the homepage; gallery.spec.ts:60-69 expects exactly three albums with 43, 6 and 19 photographs; album.spec.ts:11-19, 83-84 and 93 pin Gala 2025's keys and six photographs; the site and the Studio read development (docs/runbook.md:90-93), where open-work E19 and C3 add real albums and C2 changes the homepage

**What to build:** Use PLACEHOLDER_PROJECT for the mode, check shapes and order rather than the seed's values (as expectNoMockWhileOwed already does for mocks), and point fixed-content specs at seed-owned documents or a separate e2e dataset. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Albums only, 10 October 2026:** the specs no longer name an album, a count or a photograph, which the next
albums needed. The ticket stays open for the pins listed last.

- `albumToOpen` in `e2e/helpers.ts` finds the first album the gallery lists with enough photographs and reads
  its photographs' keys, in a page of its own. `album.spec.ts`, `targets.spec.ts` and `a11y.spec.ts` open that
  album; the two dataset constants in the helpers are gone. With no album to open, a spec asserts the failed
  read under CI's placeholder project and is skipped by name in any other run, never passed.
- `gallery.spec.ts` checks each tile's shape (a title, the line's wording, the address under `open`), that a
  year shows once, and the order, newest year first, in place of three titles and three counts. The prototype's
  invented college and years are refused only on a tile that still owes its year.
- `home.spec.ts` takes its mode from `PLACEHOLDER_PROJECT`. The prototype's EIN and phone are refused always,
  its address while the organization's own is owed (`expectNoMockWhileOwed`), and any dollar figure only with
  the placeholder project, where no Studio fact reaches the page.
- `gala.spec.ts` and `odunde.spec.ts` expect a past year's credit to link out only when it has a link.
- Runs of the seven changed specs, `--workers=1 --retries=1`, both projects. With CI's placeholder project:
  89 passed, 4 skipped, and the run's first test (in `a11y.spec.ts`, which this leaves alone) failed in the dev
  server's warm-up and passed on its retry. Against `development` (three albums): 89 passed, 4 skipped, and
  the heading-order test timed out on a busy machine; it and the tap-target test then stopped loading two
  extra pages, and both specs passed in both modes. Against the empty `production` dataset: 75 passed and 19
  were skipped, 15 of them album specs with no album to open. `main`'s gallery, album and home specs against
  that empty dataset: 19 failed, 17 in the album spec and 2 in the gallery spec; the home spec passed there.
- What no run shows: a gallery of more than three albums, or a tile with its year in its line. Those checks
  were read against `albumLine` and `byNewestAlbum`; the next album's publish is their first run.
- Left out on purpose: while the gallery holds the albums (ADR 0043) it lists none, so the album spec has no
  album address to try; `album-page.test.ts` covers that page's builder, and `gallery.spec.ts` the gallery's
  own sentence. The rendered album page under a hold is no longer asserted.
- Still pinned to what `development` holds, each one the next edit of that content would break:
  `programs.spec.ts` (five rows under "When things run"), `collective.spec.ts` (the h1's words),
  `our-story.spec.ts` (the four founding facts, "1997, Los Angeles", the two path chips),
  `get-involved.spec.ts` (the glance's "9" and the cards' keys), `donate.spec.ts` (the four fact labels),
  `lessons.spec.ts` (four glance facts), `impact.spec.ts` (three voices, a caption's "2026") and
  `home.spec.ts` (three voices).
- Also open from "What to build": a seed-owned album or an e2e dataset. The credit-focus spec needs an album
  whose first two photographs link their credit, and is skipped by name when the listed album has none.
