# 71: The current event link in the dropdown draws a curved gold line across its whole 44px row

Labels: design, later
Status: open
Blocked by: none

**Finding** (R71 in `docs/plans/review-alignment-and-quality.md`; SiteNav; polish; drift): SiteNav rightly sets aria-current on the dropdown link, and the base rule meant for the bar's links then paints its underline inside the rounded row. It reads as a smile-shaped stroke under the event name whenever the menu opens on the event pages.

**Evidence:** scratchpad chrome/nav-dropdown.mjs on /odunde and /gala: the aria-current link inside .oy-nav-drop-menu takes box-shadow 0 2px 0 rgb(232,161,58) from packages/tokens/src/components.css:180-183 (.oy-nav-links a[aria-current=page]) on a 218x44 row with an 8px radius, drawn as a curved underline (test-results/review/chrome/dropdown-site-odunde-hover.png); the prototype marks only the Events trigger (dropdown-proto-odunde-hover.png).

**What to build:** Take the underline off inside the dropdown (.oy-nav-drop-menu a[aria-current=page] { box-shadow: none }) and keep the terracotta text. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
