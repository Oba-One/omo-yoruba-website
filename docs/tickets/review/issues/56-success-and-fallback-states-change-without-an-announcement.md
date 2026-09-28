# 56: Success and fallback states change without an announcement

Labels: bug
Status: open
Blocked by: none

**Finding** (R56 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, NewsletterForm, GiveDialog; minor; a11y-perf): Errors are announced (the summary has role alert and takes focus), but the outcome a screen reader user most needs, 'Ẹ ṣé! ✓' and what happens next, is never read out (WCAG 4.1.3). A Give Dialog visitor waiting on a form that never loads hears nothing when the fallback appears.

**Evidence:** No aria-live or role=status in packages/ui/src/forms/EnquiryModal/EnquiryModal.astro, NewsletterForm/NewsletterForm.astro or GiveDialog/GiveDialog.astro (grep). scratchpad chrome/modal-states.mjs with a stubbed bridge: after an ok result the fields are replaced and focus moves to a button named only 'Close'; the newsletter success rewrites the button label and shows a line; the Give Dialog swaps the embed for the fallback after its timer while focus stays on ×. Also: test-results/review/site/success-render.txt (the sent=1 render, which shows the same block the JavaScript path reveals): [data-success] has no role and no aria-live, the Close button has no aria-describedby. Code: EnquiryModal.astro:126-134 (the success block) and succeed() :336-349 (reveals it and focuses Close); NewsletterForm.astro:87 (the done line, no role) while its error line has role alert.

**What to build:** Give the success block, the newsletter's done line and the Give fallback role=status, or point the Close button's aria-describedby at the success heading and body. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
