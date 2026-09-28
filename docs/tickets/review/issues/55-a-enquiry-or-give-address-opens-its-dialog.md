# 55: A #enquiry or #give address opens its dialog, but the fragment then moves focus from the first field or Close onto the dialog

Labels: bug
Status: open
Blocked by: none

**Finding** (R55 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, GiveDialog; minor; a11y-perf): These addresses are the trigger hrefs opened in a new tab, the no-JS success redirect (packages/web/src/lib/forms/modal-state.ts:82), shared links and campaign links to #give. COMPONENT-MAP asks for the first field on open and Close on success; a keyboard user lands on the dialog box and needs one more Tab.

**Evidence:** scratchpad chrome/served-open.mjs at 1440 with JavaScript: focusin order button.oy-modal-close, input#eq-member-name, then dialog#enquiry for /get-involved?enquiry=member#enquiry, and Close then dialog#enquiry for ...&sent=1#enquiry; without the hash focus stays on the field or Close. chrome/give.mjs: /#give, /donate#give and /gallery#give leave focus on dialog#give. The scripts focus first (EnquiryModal.astro:469-484, GiveDialog.astro:294-299) and the load's fragment navigation runs after them.

**What to build:** Focus after the fragment scroll (on load, a frame later), or strip the fragment with replaceState before focusing. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
