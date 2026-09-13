# 01: Fonts: weight-only Serif and the Yoruba subsets

Labels: infra, design
Status: resolved
Blocked by: none

**What to build:** the homepage's fonts drop from 472 KB to about 160 KB with the same Yoruba
coverage: Source Serif 4 loads the weight-only files, and Ń ń, Ǹ ǹ, Ḿ ḿ, Ṣ ṣ come from committed,
renamed subsets of a few KB first in each font stack (ADR 0026). Wayfinder ticket 33
closes with the before and after numbers of both presets.

- [x] A script in `@oy/tokens` regenerates the subsets from the pinned fontsource files, with the recipe and licence in `docs/research/phase-5-yoruba-font-subsets.md`
- [x] `fonts.css` declares the subsets as their own families first in both stacks, for both styles; a test pins the stacks, the ranges, `?no-inline` and that every file exists
- [x] The test string renders with no tofu in the Serif at 600 and 700, upright and italic (a story or the type foundations page)
- [x] lhci on the local production build, both presets, before and after, written into wayfinder ticket 33 with a follow-up ticket for metric-matched fallbacks

## Comments

12 September 2026. The research (`docs/research/phase-5-yoruba-font-subsets.md`) changed three
things before the files landed: the fonts reserve the name "Source", so the script renames the cuts
("OY Yoruba Serif", "OY Yoruba Sans", with `src/fonts/OFL.txt` carrying the notices) and they are
declared as their own families first in `--font-display` and `--font-body` rather than inside the
Source families; Vite inlined files under 4 KB, so the URLs carry `?no-inline` (the earlier matrix
had measured inlined fonts); and there are four files, not six (the optical-size cuts are gone). The
script reproduces the note's four files byte for byte and checks the drawing at every weight. The
test string was checked in the comparison page of the two Serif cuts at hero, H2, zone and glance
sizes. Numbers: wayfinder ticket 33's answer (mobile 0.77 to 0.95, LCP 5.9 s to 2.7 s; desktop 0.98
to 0.99). The remaining 0.2 s of mobile LCP is wayfinder ticket 35.
