# 54: The nav Donate button is 40px tall from 760px up, below the 44px target

Labels: design
Status: open
Blocked by: none

**Finding** (R54 in `docs/plans/review-alignment-and-quality.md`; SiteNav; minor; rule-conflict): Between 760 and 880px the bar shows Donate on tablets, where touch is the main input, and the elder test asks for 44px everywhere. The prototype's small button breaks the rule, so the rule wins.

**Evidence:** scratchpad chrome/targets.mjs: the only control under 44px in the nav, the menu, the footer and both open dialogs is 'Donate' 92x40 at 800 and 1440 (hidden under 760px, where QUALITY's 44px sweep runs); the prototype measures the same 92x40 (chrome/nav-desktop.txt). Rule: packages/tokens/src/components.css:184-188 (.oy-nav .oy-btn min-height 40px). Also: Measured 92.2 x 40px on all 13 routes at 1440 (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/rules/*-1440.json, targets). packages/tokens/src/components.css:101-105 (.oy-btn--sm min-height 40px) and :184-188 (.oy-nav .oy-btn min-height 40px). The canvas small button is 88 x 40px; the Core/Button Small story is 40px. At 375 the menu's Donate is a full 44px button. No other control on any route, in the mobile menu, the Give Dialog, the vendor and enrol forms or the Lightbox measured under 44px. Also: test-results/review/site/targets-desktop.txt: the only control under 44px at 1440 and 1024 on all 12 routes is nav a.oy-btn--primary Donate 92x40; the logo, Events and the links are 44px. Code: packages/tokens/src/components.css:184-188 (.oy-nav .oy-btn min-height 40px) and :101-105 (.oy-btn--sm), from the prototype CSS. packages/web/e2e/targets.spec.ts measures at 375 only, where the nav Donate sits in the menu at full size. Also: packages/tokens/src/components.css:101-105 (.oy-btn--sm min-height 40px) and :184-188 (.oy-nav .oy-btn min-height 40px, padding 8px 22px, 14px type); packages/ui/src/navigation/SiteNav/SiteNav.astro:64 (the only size="small" use in ui and web); oy-components.css:427-429 hides it under 760px; packages/web/e2e/targets.spec.ts:22,35 skip every viewport but 375; DESIGN.md:270 names the gap for this review

**What to build:** Give the nav Donate a 44px min-height; the 68px bar has room. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work E15 (the sweep on every route); DESIGN.md line 270; this ticket adds the review's evidence.

## Comments
