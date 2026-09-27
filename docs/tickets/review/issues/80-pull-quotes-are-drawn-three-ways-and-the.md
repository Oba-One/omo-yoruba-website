# 80: Pull quotes are drawn three ways, and the body copy quote uses a gold rule as decoration

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R80 in `docs/plans/review-alignment-and-quality.md`; Prose; polish; judgement): The member voice, the Collective quote and an editor pull quote in body copy would look like three different components, and the blockquote style spends gold on decoration, which the rules reserve for actions and celebration. It is latent: the seed writes no pull quote or blockquote, so nothing shows until an editor adds one.

**Evidence:** packages/ui/src/cards/PullQuote/PullQuote.astro (19px card, the single variant on the tokens .oy-quote); packages/ui/src/content/Prose/ProsePullQuote.astro:21-45 (the pullQuote node: its own ayo row, 21px quote, bold 15px caption); packages/ui/src/content/Prose/ProseQuote.astro:9-19 (blockquote style with border-left: 4px solid var(--gold-500)). packages/content/src/schema/objects/blockContent.ts:60 allows pullQuote in every Portable Text field. No stored body uses either today (none rendered on any route).

**What to build:** Render the pullQuote node with PullQuote variant="single", and give the blockquote rule indigo or terracotta, so gold stays on actions. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
