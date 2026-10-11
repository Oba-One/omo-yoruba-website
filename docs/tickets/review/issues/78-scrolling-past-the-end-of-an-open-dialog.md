# 78: Scrolling past the end of an open dialog scrolls the page behind it

Labels: bug, later
Status: resolved
Blocked by: none

**Finding** (R78 in `docs/plans/review-alignment-and-quality.md`; Dialogs (scrim); polish; correctness): Long forms (vendor, member, volunteer, enrol) outgrow a laptop viewport and are read by scrolling the scrim, and scroll chaining then carries on into the page underneath. Focus return scrolls the trigger back into view on close, so the effect is a moving backdrop rather than a lost place.

**Evidence:** test-results/review/site/modal-geometry.txt: at 1366x768 with JavaScript, the vendor form in its error state (panel 971px) scrolls the scrim to its end, then further wheel events move window.scrollY from 0 to 4400 while the modal stays open; the same at 375 through the sheet. Code: tokens oy-components.css:1885-1895 (.oy-modal-scrim has overflow auto and no overscroll-behavior).

**What to build:** Add overscroll-behavior: contain to .oy-modal-scrim and to the sheet panel under 720px. Size S.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

11 October 2026: fixed by the dialog shell of ADR 0055, another way than the ticket proposed. The panel no
longer outgrows the screen, so the scrim has nothing to scroll: the panel's body scrolls and keeps its own
overscroll, and the page is held while a dialog is open (`html:has(dialog.oy-modal-scrim[open])`), since a
wheel over the scrim or the pinned head would otherwise pass to it. `e2e/enquiry.spec.ts` covers both sizes:
the vendor form at 1366 by 768 (the wheel over the body, the head and the scrim) and the bottom sheet at 375 by
740.
