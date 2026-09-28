# 90: The newsletter address has no length limit, while every enquiry field has one

Labels: bug
Status: open
Blocked by: none

**Finding** (R90 in `docs/plans/review-alignment-and-quality.md`; packages/content (enquiry-zod.ts); minor; correctness): The subscriber path stores whatever passes into a subscriber document that administrators read in the Inbox, and Zod's email pattern sets no length bound of its own. One owned form bounds its input and the other does not.

**Evidence:** packages/content/src/enquiry-zod.ts:55-61 (subscriberSchema: trim, min 1, email, no max) against :17-18 and :29-33 (TEXT_MAX 300 and AREA_MAX 4000 on every enquiry field). bun probe: parseSubscriber accepts a 5,012 character address; parseEnquiry refuses the same address with "Keep email under 300 characters."

**What to build:** Give the subscriber email the same .max(TEXT_MAX) and sentence, by sharing one email field builder between the two schemas. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
