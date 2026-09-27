# 62: Without JavaScript a newsletter error re-renders at the top of the page, with the sentence out of view in the footer

Labels: bug
Status: open
Blocked by: none

**Finding** (R62 in `docs/plans/review-alignment-and-quality.md`; NewsletterForm (no-JavaScript error re-render); minor; correctness): The visitor presses Subscribe at the bottom of the page and the reload shows its top, with no sign that anything went wrong unless they scroll back down. The Enquiry Modal does not have this problem because it is fixed over the viewport. With JavaScript the newsletter behaves as the inventory asks: sentence under the field, text kept, no POST for an invalid address.

**Evidence:** test-results/review/site/newsletter.txt: NOJS empty and malformed submits at 1440 and 375 answer 400 at /programs?_action=newsletter with the sentence under the field (role alert, value kept) but scrollY 0 and errorInView false; captures nojs-newsletter-error-viewport-1440.png and -375.png show the page header. Code: packages/web/src/lib/forms/action-paths.ts:17 (NEWSLETTER_ACTION has no fragment) while modal-state.ts:110-112 sends a success to #oy-newsletter.

**What to build:** Post the footer form to ?_action=newsletter#subscribe so the re-render lands on the form, as the success redirect already does. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
