# 12: At 375 the festival header kicker sits on a bright part of the photograph at 3.1:1

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R12 in `docs/plans/review-alignment-and-quality.md`; /odunde; major; rule-conflict): On phones the header scrim is weakest where the kicker sits, and the seeded procession photograph is bright there (a white tent and building), so the first words on the festival page fail AA; the prototype fails more narrowly with its own photograph. The rule wins over the prototype, and the photograph is an editor choice that can change, so the scrim should guarantee the contrast rather than the photo. Verified from pixels under the text line, not by eye.

**Evidence:** test-results/review/library-rules/odunde-375-header.png. Pixel-sampled under the kicker "Ọdúndé • The new year has arrived" (12px bold, #f4c66d) with the text hidden (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/photo-contrast.mjs, px.mjs): mean 3.11:1, lightest decile 2.11:1 at 375; 10.0:1 at 768 and 9.9:1 at 1440. The 08 Odunde Festival prototype at 375 measures 4.25:1 mean and 2.53:1 lightest decile. The homepage hero kicker at 375 is borderline (4.74 mean, 4.32 lightest decile).

**What to build:** Deepen the photo band scrim at the top under 760px (or give the kicker the header panel) so the kicker reaches 4.5:1 over the lightest part of any header photograph. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
