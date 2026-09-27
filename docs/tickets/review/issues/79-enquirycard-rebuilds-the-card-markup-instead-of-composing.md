# 79: EnquiryCard rebuilds the card markup instead of composing Card, so its hover differs from every other card

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R79 in `docs/plans/review-alignment-and-quality.md`; EnquiryCard; polish; judgement): A second hand-written card shell means a change to Card will not reach the enquiry cards on Lessons and Our Story. The page prototypes draw that card as a plain .oy-card too, so the site matches them, but the canvas gives every card the same hover (border, title, arrow, rule). Verified by reading the component and hovering each card kind with Playwright.

**Evidence:** packages/ui/src/forms/EnquiryCard/EnquiryCard.astro:54-55 writes <article class="oy-card oy-enquiry-card"><div class="oy-card-body"> by hand, without v2-card. Hover measured at 1440 (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/cardhover.mjs): on /programs/yoruba-lessons and /our-story the border goes to rgba(30, 42, 90, 0.5), the title stays rgb(30, 42, 90), no arrow slides and no rule draws; ProgramCard, DoorCard, NewsCard and SubprogramCard go to rgba(30, 42, 90, 0.28), warm the title to rgb(180, 85, 45), slide the arrow 5px and draw the rule.

**What to build:** Build EnquiryCard on Card (as SubprogramCard and DoorCard do) so it inherits the card language, or record that the form card keeps the plain hover the 11 and 15 prototypes draw. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
