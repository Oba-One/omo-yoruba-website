# Does .astro hold up in Storybook

Type: prototype
Status: open
Owner: yes
Labels: design
Phase: 1
Blocked by: 11

## Question

The Phase 1 checkpoint: Kicker, Button, Divider, Pending, PatternBand, ImagePlaceholder and Logo built as `.astro` with stories, play functions and Chromatic. The owner looks and decides whether the framework holds. Any pivot is theirs (ADR 0002).

## Comments

5 September 2026, Phase 1 session. The seven components are built as `.astro` with colocated
stories and tests on branch `phase-1/tokens-and-storybook`. To look: `bun storybook` from the
root, or the static build with `bun run --filter @oy/ui build-storybook`. What held: rendering,
props and slots, scoped styles, the design system theme, autodocs from JSDoc, a11y panel, pseudo
states, portable stories in Vitest, 57 prerendered stories, fonts from `fonts.css`. What needed a
workaround: image imports in the static build (`Logo.stories.ts` and base36 hashes in
`.storybook/main.ts`). What is stubbed: controls in static builds, client scripts in Vitest,
`astro:actions`, `astro:env`, content collections, view transitions, server islands. Play functions
on Astro stories are marked unverified upstream in the canvas; the first interactive component
(SiteNav, Phase 3) will test them. Sources and details: `docs/research/phase-1-storybook-chromatic.md`,
`docs/plans/handoff-phase-1.md`, ADR 0002. The decision stays open for the owner.
