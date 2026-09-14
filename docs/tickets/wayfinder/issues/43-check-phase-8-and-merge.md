# Check the gallery in the Studio and on the preview, then merge the Phase 8 pull request

Type: task
Status: resolved
Owner: yes
Labels: infra
Phase: 8
Blocked by: none

## Question

Phase 8 (the gallery) is pull request https://github.com/Oba-One/omo-yoruba-website/pull/9 from `phase-8/gallery`.
Before merging:

1. Open `/admin`, the Presentation tool and `/gallery`. Click an album's cover (it opens the album's cover, or its first
   photograph when none is chosen), the albums section (the `state` option) and the mosaic (`open` and `captions`). On
   `/gallery/gala-2025`, click a photograph (it opens that photograph in the album), the credit line, and the consent
   note once one exists. A photographer's banner lists the event pages and says the credit also shows on the page of
   every album that names them.
2. Look at both routes and an open photograph at 375 and 1440 against `18 Photo Gallery.dc.html`. ADR 0040 lists what
   matches and what stays different on purpose; the captures are reproducible (`docs/runbook.md`, "Comparing a page
   with its prototype").
3. Try the photo address:
   - Open a photograph from a tile, and move with the arrows or a swipe.
   - Press Back: the Lightbox closes and the page stays. Press Forward: it reopens.
   - Paste the address into a new tab: it opens on that photograph, and closing it keeps the album page.
   - Without JavaScript, the same address serves it open with working links.
4. Decide what the pages show today:
   - `open: viewer` sends a tile to its album's first photograph, and `grid` to the album page (Q4).
   - The captions are the register's descriptions, so the Lightbox's bar runs to two or three lines where the
     prototype's short captions take one (ticket 44 asks for yours).
   - An album page loads only its first photograph at once and crops the grid's tiles to 16:9 (the spec's
     Performance section); the Lightbox always shows the whole photograph.
   - The gallery stays out of the nav, as the wireframe has it; the homepage, the event pages and Impact link to it.
5. The seed ran on `development` during the phase: it revised the gallery's header line to "Odunde, the Gala and the
   summer camp. Open an album and start looking." and retired `galleryPage.intro`. Run `bun seed` on any other dataset
   that should match.
6. Until this branch deploys, the Studio on `main` still offers the consent policy (`creditsAndConsent`) as rich text;
   write it from this pull request's preview, where it is plain text.
7. Merge when satisfied. Phase 9 starts from `main` afterwards (`docs/plans/prompt-phase-9.md`).

## Comments

13 September 2026. Merged at the owner's request, with CI green and the preview ready (`docs/plans/open-work.md`,
D1). Steps 1 to 4 (click-to-edit in Presentation, the comparison with the prototype, the photo
address by hand, the four calls) are not lost: the deep review (`docs/plans/prompt-deep-review.md`) covers the
comparison and the behaviour, and week 1 of `docs/plans/four-week-plan.md` walks the Studio with the owner. Step 5's
reseeding of other datasets waits for D3 (which dataset holds the real content).
