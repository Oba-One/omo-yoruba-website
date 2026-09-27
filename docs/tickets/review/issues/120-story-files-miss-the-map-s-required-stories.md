# 120: Story files miss the map's required stories: seven have no Default, ButtonRow has no OnDark though it sits on Impact's dark band, NewsCard has no Pending

Labels: infra
Status: open
Blocked by: none

**Finding** (R120 in `docs/plans/review-alignment-and-quality.md`; Stories (conventions); minor; tests): The map requires Default, each variant, Pending and OnDark where a part meets a dark scope; the gaps mean Chromatic has no baseline for ButtonRow's buttons on indigo and the 404 story the owner confirms (E4) differs from the page.

**Evidence:** No Default: ListRow, PersonCard, TicketTierCard, PartnerRow, SponsorLevels, TicketTiers, CreditLine (.stories.ts exports); packages/ui/src/page/ButtonRow/ButtonRow.stories.ts has Default only, no note (.oy-button-row-note) and no OnDark, while packages/web/src/pages/impact.astro:215-218 puts a gold and an outline button in it on the dark band; NewsCard.stories.ts has no Pending; NotFound.stories.ts:12 gives Default a kicker the live 404 (packages/web/src/pages/404.astro:29-33) never shows; rule at COMPONENT-MAP.md:152-154

**What to build:** Rename each file's first story to Default, add ButtonRow OnDark and WithNote stories, a NewsCard Pending (or record why it cannot be empty), and make NotFound's Default the page as the site renders it. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
