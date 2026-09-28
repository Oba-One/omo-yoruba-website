# 61: Without JavaScript the burger under 880px does nothing, and the chrome then reaches no event, program or gallery page

Labels: design
Status: open
Blocked by: none

**Finding** (R61 in `docs/plans/review-alignment-and-quality.md`; SiteNav mobile menu (no JavaScript); minor; drift): The forms, the gallery and the carousel all work without JavaScript, but the primary navigation on phones does not: the burger is a visible control with no effect, and from any inner page the only route to Odunde, the Gala, Programs or the gallery is the logo, then the homepage's own links. No ADR records a no-JavaScript decision for the menu (ADR 0020 only chose the native dialog).

**Evidence:** test-results/review/site/chrome.txt NOJS lines at 375: burger visible, a click leaves dialog#oy-nav-menu closed, no noscript fallback, the only visible header link is the logo; the footer's page links are /get-involved#member, /get-involved#partner, /donate#give, /impact, /our-story, /impact#governance. Capture nojs-nav-375.png. Code: SiteNav.astro:67-75 (the burger is a type=button) and :182-190 (the menu opens only through showModal in the inline script); SiteFooter.astro:155-168 (two link columns).

**What to build:** Give the menu a no-JavaScript path, for example a noscript style that shows the flattened links under 880px or the declarative command=show-modal on the burger, and list Odunde, the Gala, Programs and the gallery in the footer's columns. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
