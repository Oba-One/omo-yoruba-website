# 81: Two canvas states have no story: the dark outline button on hover, and the filter chip row

Labels: design, later
Status: open
Blocked by: none

**Finding** (R81 in `docs/plans/review-alignment-and-quality.md`; packages/ui stories; polish; drift): Every other canvas component and state has a story, so the library otherwise meets the Build Brief line that the canvas is fully represented. The dark hover is the one state the canvas names in words that no story shows; the filter chips wait on the News page, which the owner deferred.

**Evidence:** 01 Components.dc.html, Buttons: "On dark: outline fills white on hover, focus ring turns gold"; packages/ui/src/core/Button/Button.stories.ts:41-81 has Hover and SecondaryHover on light, OnDarkSecondary and OnDarkFocus, no hover on dark. The canvas Filter chip row has no component or story; COMPONENT-MAP lists FilterChips for News (later).

**What to build:** Add an OnDarkSecondaryHover story (pseudo hover with the indigo background); leave FilterChips with the News decision. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work D22 (FilterChips waits on the News page); this ticket adds the review's evidence.

## Comments
