# 46: Without JavaScript the modal served by ?enquiry=<kind> cannot be closed: ×, Cancel and the success Close do nothing and Escape does not close it

Labels: bug
Status: open
Blocked by: none

**Finding** (R46 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal; major; correctness): ADR 0019 makes the no-JS path a supported contract, and the trigger links, the 400 error re-render and the sent=1 success all work, but the visitor has no way out except Back or editing the address. The same markup is what every visitor gets if the inline scripts are blocked, for example by an enforced CSP that misses a hash (open-work D13, E9). The Lightbox solved the same case with links (docs/tickets/phase-8/spec.md).

**Evidence:** scratchpad chrome/nojs.mjs, javaScriptEnabled false, /get-involved?enquiry=member#enquiry at 1440 and 375 (test-results/review/chrome/nojs-member-1440.png, nojs-member-375.png): after clicking × and Cancel the dialog stays open and the address keeps ?enquiry=member; Escape leaves it open; Tab from the top reaches the logo, Events and the nav links under the scrim; on ?enquiry=member&sent=1 the success Close does nothing either (nojs-member-sent-1440.png). EnquiryModal.astro:106, 130-132 and 167-169 render type=button controls that only the script wires; the dialog is served with the open attribute, so it is not modal. Also: test-results/review/site/enquiry-nojs.jsonl, all eight kinds at 1440 and 375: the trigger link opens the modal (open attribute, scrim 1440x900 at 0), an empty submit answers 400 with the summary in view and the typed value kept, then clicking × and Cancel leaves the dialog open and the URL unchanged (afterCloseClicks.open true) and the nav is not reachable under the scrim (navReachable false). nojs-enquiry-member-error-1440.png, nojs-enquiry-success-contact-1440.png. Code: EnquiryModal.astro:106 (× is type=button), :130 (success Close, type=button), :167 (Cancel, type=button); tokens oy-components.css:1885-1895 (.oy-modal-scrim fixed, inset 0, z-index 200). Contrast: the Lightbox served open closes without JavaScript through a link (Lightbox.astro:89, gallery.txt NOJS close link).

**What to build:** Make the three controls work unenhanced: links to the page path without enquiry and sent (the script keeps intercepting them), as the Lightbox's served-open controls are, or a form method=dialog around them; consider inert on the page behind while served open. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
