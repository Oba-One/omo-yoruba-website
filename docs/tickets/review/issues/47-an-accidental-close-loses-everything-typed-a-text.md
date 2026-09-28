# 47: An accidental close loses everything typed: a text-selection drag that ends on the scrim closes the dialog, and reopening resets the form

Labels: bug
Status: open
Blocked by: none

**Finding** (R47 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal; major; correctness): Selecting text to replace it is common and elders often drag a little; the whole form then disappears without warning, which breaks the spirit of 'never clear what was typed'. A stray scrim click or Escape on an eight-question form costs the same.

**Evidence:** scratchpad chrome/drag.mjs at 1440 and 375: after typing a name and a city in the member form, a mouse drag from inside the name field that ended on the scrim closed the dialog; reopening from the same door showed name '' and city ''. modal-site.mjs: every reopen after Escape or a scrim click also shows the fields empty. EnquiryModal.astro:408 closes on any click whose target is the dialog (a drag ending outside targets the common ancestor) and api.open calls form.reset() on every open (line 387). The prototype also resets on open, so this is not drift. Also: packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:384-393 (api.open runs form.reset() on every open), :404-414 (a scrim click or Escape closes)

**What to build:** Close on the scrim only when the pointerdown also landed on the dialog element, and reset a kind's form only after its success, so a reopened form keeps what was typed. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** The scrim part is a bug and ready: close only when the pointer went down on the scrim too. Whether a reopened form keeps what was typed is the owner's call (convenience against a shared device). Recommended: keep it until the form succeeds or the page is left.
