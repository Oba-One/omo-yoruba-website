# 08: Docs, the owner's tickets and the Phase 9 prompt

Labels: later
Status: resolved
Blocked by: 07

**What to build:** the repo's documents describe what Phase 8 built, and the owner has what they need to check it
and fill the gallery: the component map, the content-ops album recipe, the READMEs and runbook where they changed,
CONTEXT and the ADRs, the wayfinder map with a ticket to check and merge the pull request and one listing the
gallery's owed facts, and the Phase 9 prompt in `docs/plans/prompt-phase-9.md`.

- [x] Component map rows for every new or changed component
- [x] `oy-content-ops`: the album recipe (the year, the credit, the consent note, the photo keys); READMEs and runbook
- [x] Wayfinder: the decisions, the check-and-merge ticket, the owed-facts ticket and the frontier
- [x] The code review on the whole diff, its findings fixed, the pull request open against `main`
- [x] The Phase 9 prompt; the owner runs `/mattpocock-skills:handoff` for `docs/plans/handoff-phase-8.md`

## Comments

13 September 2026. The component map has rows for AlbumTile and AlbumGrid, AlbumIntro, PhotoGrid, GalleryCredits, the
Lightbox, CreditLine's inline form and the carousel's swipe. The oy-content-ops album recipe covers the year from the
edition or the date, the credit and its confirmation, the consent note and the photo keys, and a gallery policy note
sits beside it. The content and ui READMEs and the runbook's Lighthouse routes are updated, and ADRs 0037 to 0040 are
among the wayfinder's decisions.

The code review ran on the whole diff (Standards and Spec, three reviewers each by area); its fixes are in
`fix(phase-8): apply the code review`, and the pull request lists what stays as it is and why. Pull request
https://github.com/Oba-One/omo-yoruba-website/pull/9 is open against `main`, not merged. Wayfinder ticket 43 asks the
owner to check it and merge, and ticket 44 lists the gallery's owed facts; both join the frontier.
`docs/plans/prompt-phase-9.md` carries Phases 4 to 8 into hardening. The handoff
(`docs/plans/handoff-phase-8.md`) is the owner's to run with `/mattpocock-skills:handoff`.
