# 01: Fonts: weight-only Serif and the Yoruba subsets

Labels: infra, design
Status: open
Blocked by: none

**What to build:** the homepage's fonts drop from 472 KB to about 152 KB with the same Yoruba
coverage: Source Serif 4 loads the weight-only files, and Ń ń, Ǹ ǹ, Ḿ ḿ, Ṣ ṣ come from committed
subsets of a few KB declared after each family's latin-ext rule (ADR 0026). Wayfinder ticket 33
closes with the before and after numbers of both presets.

- [ ] A script in `@oy/tokens` regenerates the subsets from the pinned fontsource files, with the recipe and licence in `docs/research/phase-5-yoruba-font-subsets.md`
- [ ] `fonts.css` declares the subsets after latin-ext for both families and both styles; a test pins the order, the ranges and that every file exists
- [ ] The test string renders with no tofu in the Serif at 600 and 700, upright and italic (a story or the type foundations page)
- [ ] lhci on the local production build, both presets, before and after, written into wayfinder ticket 33 with a follow-up ticket for metric-matched fallbacks

## Comments
