# 73: The actions sit 16px closer to the fields than in the prototype

Labels: design, later
Status: open
Blocked by: none

**Finding** (R73 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal; polish; drift): The override came with the first build and no note explains it. The prototype's 40px gap separates the fields from the actions; the site's 24px crowds them slightly in all eight kinds.

**Evidence:** scratchpad chrome/modal-site.mjs and modal-proto.mjs, sponsor at 1440: the select ends at y 438 in both, Send enquiry starts at 462 on the site and 478 in the prototype; EnquiryModal.astro:231-233 sets .oy-form-actions margin-top 8px over the tokens' 24px (packages/tokens/src/oy-components.css:2014-2020).

**What to build:** Drop the 8px override so the tokens' 24px applies. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
