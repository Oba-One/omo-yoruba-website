# 25: Form and footer copy make promises no one has confirmed: minors' consent forms, a newsletter cadence, a program committee

Labels: content
Status: open
Blocked by: none

**Finding** (R25 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, SiteFooter, /programs/cultural-collective, /odunde; minor; content): The register does not list the dialogs' and footer's process promises, but they are statements about safeguarding, schedules and cadence that the owner has not supplied, and the newsletter is known not to send. A parent of a 16-year-old volunteer or a performer planning around "the spring" would rely on them.

**Evidence:** packages/content/src/enquiry-kinds.ts:254 (volunteer: "Volunteers under 18 are welcome. We send a guardian consent form before a first shift."), :183 and :187 (performer: "the program committee sees every one", "The festival program is decided in the spring"), seed-data.ts:560 (the Odunde performer row repeats the committee); seed-data.ts:161 (footer: "Once or twice a month.") and :808 (Collective updates row: "once or twice a month") while ticket 01 records that nothing sends. All from Enquiry Modal.dc.html and the prototypes, none in the register.

**What to build:** List these lines in the owner's owed-facts tickets for confirmation, and until then soften them (drop the newsletter cadence, drop the consent-form promise). Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
