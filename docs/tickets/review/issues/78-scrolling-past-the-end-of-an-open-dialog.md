# 78: Scrolling past the end of an open dialog scrolls the page behind it

Labels: bug, later
Status: open
Blocked by: none

**Finding** (R78 in `docs/plans/review-alignment-and-quality.md`; Dialogs (scrim); polish; correctness): Long forms (vendor, member, volunteer, enrol) outgrow a laptop viewport and are read by scrolling the scrim, and scroll chaining then carries on into the page underneath. Focus return scrolls the trigger back into view on close, so the effect is a moving backdrop rather than a lost place.

**Evidence:** test-results/review/site/modal-geometry.txt: at 1366x768 with JavaScript, the vendor form in its error state (panel 971px) scrolls the scrim to its end, then further wheel events move window.scrollY from 0 to 4400 while the modal stays open; the same at 375 through the sheet. Code: tokens oy-components.css:1885-1895 (.oy-modal-scrim has overflow auto and no overscroll-behavior).

**What to build:** Add overscroll-behavior: contain to .oy-modal-scrim and to the sheet panel under 720px. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
