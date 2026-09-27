# 37: On the indigo tint, quiet links and FAQ questions turn terracotta 600 on hover at 4.15:1, under AA

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R37 in `docs/plans/review-alignment-and-quality.md`; /donate, /gala, /impact, /our-story, /gallery, /gallery/<album>, /programs/yoruba-lessons; major; drift): The port deepened terracotta to 700 on the alternate ground to keep AA at rest (ADR 0033, Section.astro), but the base link hover and the FAQ hover still switch to terracotta 600, which measures 4.15:1 on that tint. So the hover state fails AA on seven routes, which the elder test forbids in every state. Verified by hovering each control with Playwright and computing the ratio against the resolved ground.

**Evidence:** Hover measured at 1440 (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/states/*.json): quiet links on .oy-section--alt go from #8f3f1e on #e8ecf6 (6.13:1) to #b4552d on #e8ecf6 (4.15:1) at 14.5px bold: "See our impact" (/donate, /gala), "The festival page" (/impact), "Impact" (/our-story), "Send a message" (/gallery, /gallery/odunde-2026); the FAQ questions on /programs/yoruba-lessons (18px, 600) go from 11.58:1 to 4.15:1. Causes: packages/tokens/src/base.css:50-51 (a:hover { color: var(--link-hover) }) outranks .oy-btn--quiet's var(--accent-kicker), which packages/ui/src/page/Section/Section.astro:65-67 deepens to terracotta 700 on the tint with the comment that terracotta 600 falls under 4.5:1 there; packages/tokens/src/oy-components.css:1783-1784 sets .oy-faq-q:hover to var(--terra-600). Also: test-results/review/site/quiet.txt: nine quiet actions on eight routes (/odunde Donate, /gala See our impact, /programs/yoruba-lessons All programs, /get-involved Our Story, /impact The festival page, /our-story Impact, /donate See our impact, /gallery and /gallery/odunde-2026 Send a message) at rest rgb(143, 63, 30) on rgb(232, 236, 246) = 6.13:1, on hover rgb(180, 85, 45) = 4.15:1; 14.5px, weight 700. Code: packages/tokens/src/base.css:50-52 (a:hover sets --link-hover, terracotta 600) outranks .oy-btn--quiet's color (components.css:89-95), while Section.astro:67 and Handoff.astro:83 deepen --accent-kicker to terracotta 700 for AA on the tint. Also: scratchpad chrome/nav-dropdown.mjs at 1440: hovering either dropdown link gives rgb(180,85,45) on rgb(232,236,246), 4.15:1 at 15px/600, on the site and in the prototype (test-results/review/chrome/dropdown-site-odunde-hover-a2.png); chrome/axe.mjs reports color-contrast on #oy-nav-events > a[href$=gala] (cr 4.15). Rule: packages/tokens/src/oy-components.css:964-967, ported verbatim.

**What to build:** In .oy-section--alt also set --link-hover to var(--terra-700), and point .oy-faq-q:hover at var(--link-hover), so the hover keeps 6.1:1 on the tint. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
