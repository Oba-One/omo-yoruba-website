# 91: Routing contacts can repeat a role, and the thank-you copy, the email and the pages then read different entries

Labels: bug
Status: open
Blocked by: none

**Finding** (R91 in `docs/plans/review-alignment-and-quality.md`; packages/content (site settings, routing); minor; correctness): With two entries for one role the thank-you copy names the second person while the email goes to the first, and Get Involved names the first. Administrators edit this list by hand, so a duplicate is an easy slip that nothing flags. Also: when a role's contact has a name but no email, the thank-you copy promises that person replies while the email went to the general inbox (routeFor, packages/content/functions/enquiry-notify/email.ts:48-61, against contactSlots, packages/content/src/enquiry-kinds.ts:466-474).

**Evidence:** packages/content/src/schema/singletons/siteSettings.ts:58-66 says "One entry per role" but has no rule. contactsByRole keeps the last entry for a role (packages/content/src/enquiry-kinds.ts:412-427); routeFor emails the first (packages/content/functions/enquiry-notify/email.ts:55-58); the pages take the first (packages/content/src/queries/trust-pages.ts:32, :106, :147; program-pages.ts:67). The take-part band already refuses a repeat (schema/singletons/index.ts:18-22). Also: packages/content/src/enquiry-kinds.ts:38-47 (KIND_TO_ROLE) and the role on each spec (:157, :188, :212, :233, :255, :280, :317, :347). The JavaScript path reads spec.role (packages/web/src/lib/forms/handlers.ts:172, packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:112); the no-JavaScript sent=1 path and the email read KIND_TO_ROLE (packages/web/src/layouts/SiteLayout.astro:78, functions/enquiry-notify/email.ts:55). No test compares them (enquiry-kinds.test.ts:38 and :75-79 check each against CONTACT_ROLES only).

**What to build:** Add a rule on contacts that each role appears once ("Each role has one entry."), as the take-part band does for ways in. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
