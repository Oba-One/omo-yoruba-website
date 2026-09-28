# 49: Form fields are 15px, so iPhone Safari zooms the page whenever a field takes focus

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R49 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, NewsletterForm (every route); major; rule-conflict): Every owned form (member, volunteer, enrol, vendor, contact, sponsor, performer, table) and the footer newsletter use 15px fields, which iOS Safari answers by zooming the page on focus, leaving an elder on a phone scrolled sideways inside the bottom sheet. The canvas sets 15px too, but the 17px body rule outranks it and fixing it removes the zoom. Verified by computed style; the zoom is documented WebKit behaviour for fields under 16px, not reproduced in Chromium.

**Evidence:** packages/tokens/src/components.css:515 (.oy-input font-size 15px), :500-501 (.oy-label 14px), :537-542 (hint and error 13.5px). Measured at 375 in the open member form (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/inputs.mjs): every input and select 15px, labels 14px; the footer newsletter field 15px. packages/web/src/layouts/SiteLayout.astro:109 sets width=device-width, initial-scale=1 with no maximum-scale, so iOS Safari zooms any focused field under 16px.

**What to build:** Set .oy-input (inputs, selects, textareas) to 17px and the labels and error sentences to at least 15px bold, then recheck the dialog and bottom sheet at 375. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Ready: 17px fields stop the zoom and meet the body floor whatever R110 decides.
