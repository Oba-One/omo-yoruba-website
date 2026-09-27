# 48: Component stories draw cards and rows without the page root, so Storybook shows a clear ground, an ink hairline and the unchosen texture

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R48 in `docs/plans/review-alignment-and-quality.md`; packages/ui stories (Cards, Content, Page, Forms); major; drift): The card treatment settled in polish passes 2 and 3 (paper ground, indigo hairline, grain-dots) depends on custom properties that exist only inside the page root, and only the page-section stories supply one. Every component story for a card or a path row therefore renders with a transparent or white ground, a dark ink border and the old 0.028 dot field, visibly unlike the canvas and the site. This is the library the owner reviews and the one Chromatic will baseline (open-work E16), so accepting baselines now would lock in the wrong card. Verified by computed style in 19 stories and by eye in the captures.

**Evidence:** packages/tokens/src/oy-components.css:17-25 defines --card-ground and --card-line only under .oy-home, .oy-nav and .oy-modal; packages/ui/.storybook/preview.ts:38-44 wraps a story only in .oy-dark. Measured in 17 component stories (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/storycards.mjs): Card, ProgramCard, NewsCard, PullQuote, DoorCard, SubprogramCard, EnquiryCard, PathRow, PathRows, TakePartBand, CardGrid give background rgba(0, 0, 0, 0), border rgb(34, 34, 42) and texture opacity 0.028; ZoneCard, ZoneGrid, PersonCard, TicketTierCard, TicketTiers, OutcomeCard give background rgb(255, 255, 255). The canvas and the site give rgb(250, 245, 236) paper, rgba(30, 42, 90, 0.22) and 0.045; the Pages/* stories (PageRoot, HomeRoot) match the site. Captures: test-results/review/library-rules/canvas-cards.png against test-results/review/library-rules/story-cards-doorcard--default.png and test-results/review/library-rules/story-cards-pathrow--member.png. Also: packages/tokens/src/oy-components.css:17-25 and :794-799 define --card-ground, --card-line, --card-line-hover and --paper-grain* only under .oy-home, .oy-nav, .oy-modal; :26-39 set .oy-card and .oy-path background and border-color from them; :160-162 .v2-card:hover sets 0.28 alpha; packages/ui/.storybook/preview.ts:39-45 adds only the dark decorator; storybook-static/astro-prerendered-stories.json 'cards-card--default' is <div class="sb-oy-narrow"><article class="oy-card v2-card"> with no root; 97 stories in 11 files draw .oy-card or .oy-path without .oy-home or data-card

**What to build:** Add a global decorator in .storybook/preview.ts that wraps every story in <div class="oy-home" data-card="grain-dots" data-theme="adire">, keeping the dark wrapper inside it, then re-check the card stories. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
