# 72: The success block puts Close inside the gold-edged card; the prototype sets it below the card

Labels: design, later
Status: open
Blocked by: none

**Finding** (R72 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal; polish; drift): A small visual difference in the success state only; the Give Dialog's fallback keeps its buttons inside the box, as its prototype does, which is probably where the pattern came from.

**Evidence:** test-results/review/chrome/story-modal-success-1440.png against modal-proto-member-1440-success.png; EnquiryModal.astro:126-134 places .oy-ok-actions inside .oy-ok, while Enquiry Modal.dc.html renders the Close row as a sibling after .oy-ok.

**What to build:** Move the Close row after the .oy-ok block, so the modal body's 16px gap separates them. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
