# 65: Page H1s are 32px on phones and under 44px until about 1048px wide, with line height 1.12

Labels: design
Status: open
Blocked by: none

**Finding** (R65 in `docs/plans/review-alignment-and-quality.md`; PageHeader (11 inner routes); minor; rule-conflict): AGENTS.md sets hero 44 to 64px and headings at 1.15, and D11 asks the owner about the photo hero (34px), the hero token (38px) and H2 (30px), but not about the page header H1 that eleven routes use, which is the smallest of all at 32px. The prototype sets it, so it is a rule conflict the owner should settle with D11 rather than a silent drift.

**Evidence:** packages/tokens/src/oy-components.css:1009-1013 (.oy-phead h1 { font-size: clamp(32px, 4.2vw, 48px); line-height: 1.12 }), ported from docs/design/design/oy-components.css:227. Measured: 32px at 375 and 48px at 1440 on /odunde, /gala, /programs, /programs/yoruba-lessons, /programs/cultural-collective, /get-involved, /impact, /our-story, /donate, /gallery and /gallery/odunde-2026; the 404 heading is 38px with 1.15.

**What to build:** Fold the page header into the D11 decision: either raise the clamp floor to 44px or record 32px on phones beside the hero values; set line-height 1.15. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work D11 (T30); the page header H1 is not in its list; this ticket adds the review's evidence.

## Comments
