# 115: The dialogs take over ctrl, cmd and shift clicks on their triggers, where the Lightbox lets them through

Labels: infra
Status: open
Blocked by: none

**Finding** (R115 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, GiveDialog; minor; consistency): Every trigger is a real link (/donate#give, ?enquiry=<kind>#enquiry), but a cmd or ctrl click meant to open it in a new tab opens the dialog in place instead. The library solved this once for photographs and not for the two dialogs.

**Evidence:** packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:496-511 and packages/ui/src/forms/GiveDialog/GiveDialog.astro:312-324 preventDefault every click on [data-enquiry] and [data-give]; packages/ui/src/media/Lightbox/Lightbox.astro:228-232 (plainClick guard) and its ModifiersIgnored story

**What to build:** Apply the Lightbox's plainClick test (main button, no modifier) before opening either dialog. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
