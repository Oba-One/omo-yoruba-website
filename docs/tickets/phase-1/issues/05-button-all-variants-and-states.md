# 05: Button with every variant and state

Labels: design
Status: resolved
Blocked by: 04

**What to build:** one `Button` component renders as a link or a button: primary (gold),
secondary (indigo outline that fills on hover), quiet (text with arrow), default and small sizes,
with hover (darken or fill, no lift), focus (2px ring, offset 2px, gold-300 in dark scope), pressed
(settle 1.5 percent), disabled and busy ("Sending...") states, and 44px minimum targets. Stories
show every variant and state, the diacritics test string, an OnDark set, and document the one gold
primary action per view rule.




- [x] `src/core/Button/Button.astro` with typed props `variant`, `size`, `href`, `type`, `arrow`,
      `busy`, `disabled`
- [x] Stories: Default (primary), Secondary, Quiet, Small, WithArrow, AsLink, Hover, SecondaryHover,
      Focus, Pressed, Disabled, DisabledLink, Busy, Diacritics, OnDark, OnDarkSecondary, OnDarkFocus
- [x] Test renders the stories and checks link versus button output, disabled and busy attributes
- [ ] `addon-a11y` reports no violations on any Button story (checked by hand on Default and
      Secondary in the panel; every-story enforcement needs the Vitest addon, Phase 3)
