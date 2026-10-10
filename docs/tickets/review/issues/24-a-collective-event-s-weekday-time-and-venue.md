# 24: A Collective event's weekday, time and venue line measures 4.45:1 on the tint, under AA

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R24 in `docs/plans/review-alignment-and-quality.md`; /programs/cultural-collective, EventList; minor; a11y-perf): The elder test asks for AA everywhere, and this is 13.5px regular text, so it needs 4.5:1. It is latent because development holds no Collective event (the section shows its Pending line), but the first event the owner enters renders below AA. The prototype intends this section on the tint too (its runtime drops the theme, ADR 0033), so the fix keeps the design.

**Evidence:** Storybook Pages/Collective/Events/Shown at 1440 (test-results/review/programs/story-collective-events-shown-1440.png): .oy-lrow-where is 13.5px regular rgb(107,107,118) on the section's rgb(232,236,246) = 4.45:1, while the summary line above takes rgb(95,95,106) = 5.33:1. packages/tokens/src/oy-components.css:1636-1640 reads var(--muted), which the alt ground does not remap (packages/ui/src/page/Section/Section.astro:65-69 remaps --text-muted only); packages/tokens/src/tokens/colors.css:36 itself records --muted at 4.45 on this tint. The events section is ground alt (packages/web/src/pages/programs/cultural-collective.astro:86).

**What to build:** Read var(--text-muted) in .oy-lrow-body .oy-lrow-where so the tint's AA-safe grey applies. Size S.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 9 October 2026:** Fixed in the pull request that carries this comment. The latent case arrived on Donate
first: the two "other ways to give" rows published that day carry a detail line on the alt ground, and
`donate.spec.ts`'s "is clean for axe with the page settled" went red in both projects in the seeded mode,
color-contrast at 4.45:1. `.oy-lrow-body .oy-lrow-where` now reads `--text-muted`, which the alt ground swaps for
its AA grey: 5.33:1 measured on Donate. The same rule serves a Collective event's line, which no event exists yet to
show. Red before and green after: that axe check, and a token test that holds the rule and the grey's contrast on
the tint. Playwright passes on Donate in both data modes; in the placeholder mode the rows are the Pending line.
