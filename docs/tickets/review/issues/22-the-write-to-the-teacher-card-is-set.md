# 22: The Write to the teacher card is set at the generic enquiry card scale, smaller and wider set than the prototype's

Labels: design
Status: open
Blocked by: none

**Finding** (R22 in `docs/plans/review-alignment-and-quality.md`; /programs/yoruba-lessons, EnquiryCard; minor; drift): ADR 0033 and spec Q7 record this card's copy (the enrol spec's) and its outline trigger, not its scale, so the difference is unrecorded. The page tells parents they start by writing to the teacher, and this card is where they do it; the prototype gives it more presence than a generic card, and a 14.5px blurb running 658px wide reads harder than the prototype's 16px at 52ch. Measured on the live page at 1440 and compared side by side at 375.

**Evidence:** getComputedStyle at 1440: prototype h3 24px/600, blurb 16px with 26.4px line height held to 52ch (414px), body padding 30px 30px 32px and gap 12px (11 Yoruba Language School.dc.html:66-68); site h3 20px, blurb 14.5px/23.2px with no measure (658px lines), padding 20px 22px 24px, gap 8px (packages/tokens/src/components.css:316-331 through EnquiryCard). The site's count line reads '8 questions' where the prototypes write counts in words ('Four questions' in 09 End-of-Year Gala.dc.html and 15 People and History.dc.html). Captures test-results/review/programs/p11-1440-section-teacher.png, s11-1440-section-teacher.png, pair11-375-section-teacher.png.

**What to build:** Give EnquiryCard a larger variant for a page's main form card (title 22 to 24px, blurb 16px at about 50ch, 30px padding, the count in words) and use it for the Lessons teacher card. The Our Story prototype's contact card draws the same larger scale (22px, 16px at 46ch). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
