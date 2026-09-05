# Fonts: provider and subsets for underdots

Type: research
Status: resolved
Owner: no
Labels: design
Phase: 1
Blocked by: none

## Question

`astro:fonts` needs a provider for Source Serif 4 and Source Sans 3 with the Noto fallbacks, `font-display: swap`, preload, and subsets that include Latin Extended Additional and combining marks so the test string renders with no tofu at every weight. Verify against the Astro fonts reference and pick local files versus a provider.

## Answer

Resolved 5 September 2026 in Phase 1. Findings with sources:
`docs/research/fonts-source-serif-sans-subsets.md`.

- Both faces carry every glyph and the mark positioning the test string needs; the Google
  subsetted files shape identically to Adobe's release fonts at 400, 600 and 700.
- Subsets: latin, latin-ext and vietnamese, for both families. The underdot vowels and the
  combining grave, acute and dot below live in vietnamese, Ṣ and ṣ in latin-ext.
- Local files over a provider: `@oy/tokens/fonts.css` declares hand-written `@font-face` rules
  over the pinned `@fontsource-variable/source-serif-4` and `@fontsource-variable/source-sans-3`
  5.3.0 files (the same Google builds, OFL 1.1), `font-display: swap`, one `unicode-range` per
  subset, served from the site's origin, so the CSP keeps no font origin and Storybook loads the
  faces without `astro:fonts`. The Astro Fonts API can consume the same files later through
  `fontProviders.fontsource()` or `fontProviders.local()` with `subsets: ["latin", "latin-ext",
  "vietnamese"]`.
- Content rule that follows: keep Yoruba text NFC. A decomposed base plus mark splits across two
  font files and loses its anchors.
- Left to the owner: Source Serif 4 ships with the optical size axis the handoff requested
  (about 253 KB across the three subsets against 106 KB for the weight-only files); italics are
  declared but download only when used; Noto stays a name in the stack, not a shipped file.
