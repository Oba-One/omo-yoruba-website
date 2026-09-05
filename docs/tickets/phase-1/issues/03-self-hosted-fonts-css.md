# 03: Ship a plain fonts.css with Source Serif 4 and Source Sans 3

Labels: design, infra
Status: resolved
Blocked by: 01, 02

**What to build:** Storybook and any plain HTML page can render the diacritics test string
"Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun." in the real faces,
with no tofu and correct mark placement at every weight, without `astro:fonts`. Faces are
self-hosted from pinned fontsource packages, `font-display: swap`, subset to what the test string
needs (latin, latin-ext, vietnamese), and the `--font-display` and `--font-body` stacks fall back
through Noto Serif and Noto Sans, then Georgia and system-ui.




- [x] `@oy/tokens/fonts.css` declares `@font-face` rules for both families from the pinned
      fontsource files, with the unicode ranges from the research note
- [x] The family names in the stacks match the `@font-face` declarations, and the Noto fallbacks
      follow them
- [x] A Storybook story or docs page shows the test string at kicker, body and heading sizes
      (the Foundations/Type docs page, viewed in the static build)
- [x] `docs/runbook.md` still holds true: fonts are self-hosted, no font origin in the CSP
