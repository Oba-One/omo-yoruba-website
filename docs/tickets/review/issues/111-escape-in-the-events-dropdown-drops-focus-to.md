# 111: Escape in the Events dropdown drops focus to the page, and aria-haspopup announces a menu the dropdown is not

Labels: bug
Status: open
Blocked by: none

**Finding** (R111 in `docs/plans/review-alignment-and-quality.md`; SiteNav; minor; a11y-perf): Because the dropdown opens on :focus-within, the script closes it by blurring the trigger, so after Escape no element has focus or a visible ring and a screen reader loses its place. aria-haspopup="true" means a menu in ARIA, so assistive technology announces a menu button and users expect arrow keys the dropdown does not support.

**Evidence:** packages/ui/src/navigation/SiteNav/SiteNav.astro:171-177 (Escape: trigger.focus(); trigger.blur()), :40-47 (aria-haspopup="true" on a button controlling a plain list of links); packages/tokens/src/oy-components.css:949-952 (the menu shows on :focus-within); packages/web/e2e/chrome.spec.ts:51-70 and SiteNav.stories.ts:86-99 assert only that the menu hides and aria-expanded is false Also: scratchpad chrome/nav-dropdown.mjs and dropdown-keys.mjs at 1440 on /odunde and /impact: Tab to Events opens the menu (focus within); Escape from a dropdown link leaves document.activeElement on body with aria-expanded false; Enter on the focused trigger closes the menu and also moves focus to body, and the next Tab lands on Programs, past the event links. SiteNav.astro:164-177 blurs the trigger to close the focus-within menu; line 44 sets aria-haspopup=true on a disclosure of links. Also: test-results/review/site/chrome.txt: focus on the Events trigger opens the menu (aria-expanded true), Tab reaches Ọdúndé Festival, Escape closes it with activeElement BODY and no visible focus; the next Tab lands on Programs. Code: packages/ui/src/navigation/SiteNav/SiteNav.astro:171-177 (trigger.focus(); trigger.blur()).

**What to build:** On Escape keep focus on the trigger and hide the menu with a state attribute on .oy-nav-drop (cleared on focusout, mouseleave or the next click) instead of blurring; drop aria-haspopup, as the APG disclosure navigation pattern does; assert the trigger keeps focus in the story and the spec. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
