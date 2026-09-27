# 116: The newsletter form copies its required-email sentence and both forms keep a spare copy of the email pattern

Labels: infra
Status: open
Blocked by: none

**Finding** (R116 in `docs/plans/review-alignment-and-quality.md`; NewsletterForm, EnquiryModal; minor; consistency): The text matches the action's sentence today, but the README's rule exists so the site and the action never say different things; a change to REQUIRED_TEMPLATE would now split the JavaScript and no-JavaScript answers.

**Evidence:** packages/ui/src/forms/NewsletterForm/NewsletterForm.astro:46 (REQUIRED = 'We still need an email address.') vs packages/content/src/enquiry-zod.ts:57-59 (requiredSentence('an email address')); packages/ui/README.md:45 ('every form sentence come[s] from @oy/content/enquiry-kinds; nothing is copied'); fallback regex literals at EnquiryModal.astro:256 and NewsletterForm.astro:216 though data-email-pattern is always set from EMAIL_PATTERN

**What to build:** Import requiredSentence from @oy/content/enquiry-kinds for the newsletter's required message and drop the two fallback patterns. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
