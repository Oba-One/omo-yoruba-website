# 58: Resting field borders are 1.51:1 on the white modal, below the 3:1 non-text minimum

Labels: design
Status: open
Blocked by: none

**Finding** (R58 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal (field tokens); minor; rule-conflict): The elder test's AA includes non-text contrast for a control's boundary when nothing else marks it. Only the resting state fails, but that is the state an elder scans to find where to type.

**Evidence:** scratchpad chrome/modal-site.mjs: .oy-input border 1.5px rgb(216,210,196) on the modal's white, 1.51:1; the fields are white on white, so the border is their only edge (WCAG 1.4.11). packages/tokens/src/components.css:512, ported from the design system; the prototype is the same. Hover and focus use indigo 700 and pass.

**What to build:** A resting field border near 3:1 on white, for example #8c8578 (3.66:1). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
