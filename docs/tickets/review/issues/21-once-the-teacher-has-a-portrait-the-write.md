# 21: Once the teacher has a portrait, the Write to the teacher card stretches and its question count floats alone mid-card

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R21 in `docs/plans/review-alignment-and-quality.md`; /programs/yoruba-lessons, EnquiryCard; major; drift): The Lessons page's main conversion card breaks into three separated pieces (title and blurb at the top, '8 questions' alone in the middle, the button at the foot) as soon as the owner links the teacher with a portrait, which is the default portraits option and the next content step (open-work C7). It is hidden today only because no teacher is linked, so the woven-tick card is shorter than the enquiry card. Verified by measuring the page-section story with a portrait at 1440; at 375 the two cards stack and do not stretch.

**Evidence:** Storybook Pages/Lessons/Portraits/Shown (iframe id pages-lessons-portraits--shown) at 1440, capture test-results/review/programs/story-lessons-portraits-shown-1440.png: the split is 516px tall (portrait 398px), the enquiry card stretches to 516px, and its blurb and its '8 questions' line are both flex 1 1 0% at 181px each, so the count sits at y 1101 and the button at y 1290. Cause: packages/tokens/src/components.css:327-331 (.oy-card-body p { flex: 1 }) reaches both paragraphs of packages/ui/src/forms/EnquiryCard/EnquiryCard.astro (the blurb and the .oy-enquiry-card-meta line). development stores lessonsPage.layout.portraits = shown and no teacher yet (bun run --filter @oy/content query). Prototype 11 Yoruba Language School.dc.html:66-73 has no count line; its button row follows the copy.

**What to build:** Keep the count with the copy: flex: none on the enquiry card's meta line (and its blurb), so only the action is pushed to the foot of a stretched card. Recheck the event pages' and Our Story's enquiry cards, which share the rule. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
