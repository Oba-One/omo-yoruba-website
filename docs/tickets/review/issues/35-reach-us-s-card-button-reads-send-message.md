# 35: Reach us's card button reads 'Send message' where the prototype and the site's other contact buttons read 'Send a message'

Labels: design, later
Status: open
Blocked by: none

**Finding** (R35 in `docs/plans/review-alignment-and-quality.md`; /our-story; polish; drift): The trigger opens the same contact form from three places with two labels. EnquiryCard defaults its trigger to the form's submit label, which suits the event pages' cards, but the prototype names this trigger as the other contact buttons do.

**Evidence:** packages/web/src/pages/our-story.astro:174 renders EnquiryCard kind=contact without a label, so the spec's submit label 'Send message' (packages/content/src/enquiry-kinds.ts:343); 15 People and History.dc.html's card button 'Send a message'; Get Involved's ContactBlock (packages/ui/src/content/ContactBlock/ContactBlock.astro:66) and the gallery credits say 'Send a message'; test-results/review/trust/c-os-1440-contact.png

**What to build:** Pass label="Send a message" to Our Story's EnquiryCard; the form's own submit keeps 'Send message'. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
